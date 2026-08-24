import { prisma } from "@/lib/prisma";
import { getCellHealth } from "@/lib/business";
import { ENCOUNTER_REQUIREMENTS } from "@/lib/constants";

function monthsAgo(n: number) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d;
}

export async function getGeneralDashboardStats() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [peopleCount, cellsCount, leadersCount, newPeopleThisMonth, encountersAttended, baptismsCount, cells] =
    await Promise.all([
      prisma.person.count({ where: { status: { not: "RETIRADO" } } }),
      prisma.cell.count({ where: { status: { not: "INACTIVA" } } }),
      prisma.cell.groupBy({ by: ["leaderId"], where: { leaderId: { not: null } } }).then((r) => r.length),
      prisma.person.count({ where: { registeredAt: { gte: startOfMonth } } }),
      prisma.encounterRegistration.count({ where: { attended: true } }),
      prisma.baptism.count(),
      prisma.cell.findMany({ select: { id: true }, where: { status: { not: "INACTIVA" } } }),
    ]);

  const recentReports = await prisma.attendanceReport.findMany({
    where: { date: { gte: monthsAgo(1) } },
    select: { attendancePercent: true },
  });
  const avgAttendance =
    recentReports.length > 0
      ? Math.round(recentReports.reduce((s, r) => s + r.attendancePercent, 0) / recentReports.length)
      : 0;

  const threeMonthsAgo = monthsAgo(ENCOUNTER_REQUIREMENTS.minMonths);
  const candidates = await prisma.person.findMany({
    where: {
      status: "ACTIVO",
      registeredAt: { lte: threeMonthsAgo },
      currentStage: { key: { in: ["NUEVO_MIEMBRO", "PRE_ENCUENTRO"] } },
    },
    select: { id: true, preEncounterClasses: { select: { completed: true } } },
  });
  const habilitadosParaEncuentro = candidates.filter(
    (p) => p.preEncounterClasses.filter((c) => c.completed).length >= ENCOUNTER_REQUIREMENTS.minPreEncounterClasses
  ).length;

  const healths = await Promise.all(cells.map((c) => getCellHealth(c.id)));
  const cellsEnAlerta = healths.filter((h) => h.level === "ROJO").length;

  const [prayerActiveCount, prayerResolvedThisMonth] = await Promise.all([
    prisma.prayerRequest.count({ where: { status: "ACTIVO" } }),
    prisma.prayerRequest.count({ where: { status: "RESUELTO", resolvedDate: { gte: startOfMonth } } }),
  ]);

  return {
    peopleCount,
    cellsCount,
    leadersCount,
    newPeopleThisMonth,
    avgAttendance,
    habilitadosParaEncuentro,
    encountersAttended,
    baptismsCount,
    cellsEnAlerta,
    prayerActiveCount,
    prayerResolvedThisMonth,
  };
}

export async function getGanarDashboard() {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);

  const [invitados, nuevos, aceptaronJesus, primerasAsistencias, topInviters] = await Promise.all([
    prisma.invitation.count({ where: { date: { gte: startOfMonth } } }),
    prisma.person.count({ where: { registeredAt: { gte: startOfMonth } } }),
    prisma.acceptedJesus.count({ where: { date: { gte: startOfMonth } } }),
    prisma.firstCellVisit.count({ where: { date: { gte: startOfMonth } } }),
    prisma.person.groupBy({
      by: ["invitedById"],
      where: { invitedById: { not: null } },
      _count: { invitedById: true },
      orderBy: { _count: { invitedById: "desc" } },
      take: 5,
    }),
  ]);

  const inviterIds = topInviters.map((t) => t.invitedById!).filter(Boolean);
  const inviterPeople = await prisma.person.findMany({
    where: { id: { in: inviterIds } },
    select: { id: true, firstName: true, lastNamePaternal: true },
  });
  const topInvitersWithNames = topInviters.map((t) => ({
    count: t._count.invitedById,
    person: inviterPeople.find((p) => p.id === t.invitedById),
  }));

  const newByCell = await prisma.person.groupBy({
    by: ["currentCellId"],
    where: { registeredAt: { gte: startOfMonth }, currentCellId: { not: null } },
    _count: { currentCellId: true },
    orderBy: { _count: { currentCellId: "desc" } },
    take: 8,
  });
  const cellIds = newByCell.map((c) => c.currentCellId!).filter(Boolean);
  const cellsInfo = await prisma.cell.findMany({ where: { id: { in: cellIds } }, select: { id: true, name: true, number: true } });

  return {
    invitados,
    nuevos,
    aceptaronJesus,
    primerasAsistencias,
    topInviters: topInvitersWithNames,
    newByCell: newByCell.map((c) => ({
      count: c._count.currentCellId,
      cell: cellsInfo.find((ci) => ci.id === c.currentCellId),
    })),
  };
}

export async function getConsolidarDashboard() {
  const [asistenciaReports, preEncuentroActivos, encuentroAsistidos, postEncuentroCompletos, bautismos, inactivos, enRiesgo] =
    await Promise.all([
      prisma.attendanceReport.findMany({ orderBy: { date: "desc" }, take: 12 }),
      prisma.person.count({ where: { currentStage: { key: "PRE_ENCUENTRO" } } }),
      prisma.encounterRegistration.count({ where: { attended: true } }),
      prisma.postEncounterClass.groupBy({
        by: ["personId"],
        where: { completed: true },
        _count: { personId: true },
      }).then((r) => r.filter((x) => x._count.personId >= 4).length),
      prisma.baptism.count(),
      prisma.person.count({ where: { status: "INACTIVO" } }),
      prisma.person.count({ where: { status: "EN_RIESGO" } }),
    ]);

  const avgAttendance =
    asistenciaReports.length > 0
      ? Math.round(asistenciaReports.reduce((s, r) => s + r.attendancePercent, 0) / asistenciaReports.length)
      : 0;

  return {
    avgAttendance,
    preEncuentroActivos,
    encuentroAsistidos,
    postEncuentroCompletos,
    bautismos,
    inactivos,
    enRiesgo,
  };
}

export async function getEntrenarDashboard() {
  const [discipulados, planesActivos, planesCompletados, lideresEnFormacion, herramientasUsadas] = await Promise.all([
    prisma.discipleshipSession.count(),
    prisma.developmentPlan.count({ where: { status: "EN_PROCESO" } }),
    prisma.developmentPlan.count({ where: { status: "COMPLETADO" } }),
    prisma.person.count({ where: { currentStage: { key: "LIDER_EN_FORMACION" } } }),
    prisma.discipleshipSessionTool.groupBy({
      by: ["toolId"],
      _count: { toolId: true },
      orderBy: { _count: { toolId: "desc" } },
      take: 5,
    }),
  ]);

  const toolIds = herramientasUsadas.map((h) => h.toolId);
  const tools = await prisma.discipleshipTool.findMany({ where: { id: { in: toolIds } } });
  const topTools = herramientasUsadas.map((h) => ({
    count: h._count.toolId,
    tool: tools.find((t) => t.id === h.toolId),
  }));

  const metasCumplidas = await prisma.personalGoal.count({ where: { status: "CUMPLIDA" } });

  return { discipulados, planesActivos, planesCompletados, lideresEnFormacion, topTools, metasCumplidas };
}

export async function getEnviarDashboard() {
  const [lideresEnFormacion, coLideres, lideres, nuevasCelulas, multiplicaciones, personasEnviadas] = await Promise.all([
    prisma.person.count({ where: { currentStage: { key: "LIDER_EN_FORMACION" } } }),
    prisma.person.count({ where: { currentStage: { key: "CO_LIDER" } } }),
    prisma.person.count({ where: { currentStage: { key: "LIDER" } } }),
    prisma.cell.count({ where: { parentCellId: { not: null } } }),
    prisma.leadershipMultiplication.count(),
    prisma.person.count({ where: { currentStage: { key: "ENVIO" } } }),
  ]);

  const byLeader = await prisma.leadershipMultiplication.groupBy({
    by: ["leaderId"],
    _count: { leaderId: true },
    orderBy: { _count: { leaderId: "desc" } },
    take: 5,
  });
  const leaderIds = byLeader.map((b) => b.leaderId);
  const leaderPeople = await prisma.person.findMany({
    where: { id: { in: leaderIds } },
    select: { id: true, firstName: true, lastNamePaternal: true },
  });

  return {
    lideresEnFormacion,
    coLideres,
    lideres,
    nuevasCelulas,
    multiplicaciones,
    personasEnviadas,
    topLeaders: byLeader.map((b) => ({ count: b._count.leaderId, person: leaderPeople.find((p) => p.id === b.leaderId) })),
  };
}
