import { prisma } from "@/lib/prisma";
import { monthsBetween, daysBetween } from "@/lib/utils";
import { ENCOUNTER_REQUIREMENTS } from "@/lib/constants";

// ============================================================================
// MOTOR DE REQUISITOS — Elegibilidad para Encuentro
// ============================================================================

export type EncounterEligibility = {
  antiguedadMeses: number;
  cumpleAntiguedad: boolean;
  preEncounterCompletadas: number;
  cumplePreEncuentro: boolean;
  attendancePercent: number;
  cumpleAsistencia: boolean;
  cumpleEstado: boolean;
  cumple: boolean;
  faltantes: string[];
};

export async function getEncounterRequirements() {
  const setting = await prisma.systemSetting.findUnique({ where: { key: "encounter_requirements" } });
  if (setting?.value) return setting.value as typeof ENCOUNTER_REQUIREMENTS;
  return ENCOUNTER_REQUIREMENTS;
}

export async function getEncounterEligibility(personId: string): Promise<EncounterEligibility> {
  const [person, requirements] = await Promise.all([
    prisma.person.findUniqueOrThrow({ where: { id: personId } }),
    getEncounterRequirements(),
  ]);

  const antiguedadMeses = monthsBetween(person.registeredAt);
  const cumpleAntiguedad = antiguedadMeses >= requirements.minMonths;

  const preEncounterClasses = await prisma.preEncounterClass.findMany({ where: { personId } });
  const preEncounterCompletadas = preEncounterClasses.filter((c) => c.completed).length;
  const cumplePreEncuentro = preEncounterCompletadas >= requirements.minPreEncounterClasses;

  const since = new Date();
  since.setDate(since.getDate() - 90);
  const attendances = await prisma.attendance.findMany({
    where: { personId, date: { gte: since }, isGuest: false },
  });
  const attendancePercent =
    attendances.length > 0
      ? Math.round((attendances.filter((a) => a.attended).length / attendances.length) * 100)
      : 0;
  const cumpleAsistencia = attendancePercent >= requirements.minAttendancePercent;

  const cumpleEstado = person.status === "ACTIVO";

  const faltantes: string[] = [];
  if (!cumpleAntiguedad) faltantes.push(`Antigüedad: faltan ${requirements.minMonths - antiguedadMeses} mes(es)`);
  if (!cumplePreEncuentro) faltantes.push(`Pre-Encuentro: ${preEncounterCompletadas}/${requirements.minPreEncounterClasses} clases`);
  if (!cumpleAsistencia) faltantes.push(`Asistencia: ${attendancePercent}% (mínimo ${requirements.minAttendancePercent}%)`);
  if (!cumpleEstado) faltantes.push("Estado: debe estar Activo");

  return {
    antiguedadMeses,
    cumpleAntiguedad,
    preEncounterCompletadas,
    cumplePreEncuentro,
    attendancePercent,
    cumpleAsistencia,
    cumpleEstado,
    cumple: cumpleAntiguedad && cumplePreEncuentro && cumpleAsistencia && cumpleEstado,
    faltantes,
  };
}

// ============================================================================
// SALUD DE PERSONA — verde / amarillo / rojo
// ============================================================================

export type HealthLevel = "VERDE" | "AMARILLO" | "ROJO";

export type PersonHealth = {
  level: HealthLevel;
  reasons: string[];
  daysSinceLastAttendance: number | null;
  consecutiveAbsences: number;
};

export async function getPersonHealth(personId: string): Promise<PersonHealth> {
  const attendances = await prisma.attendance.findMany({
    where: { personId, isGuest: false },
    orderBy: { date: "desc" },
    take: 10,
  });

  let consecutiveAbsences = 0;
  for (const a of attendances) {
    if (!a.attended) consecutiveAbsences++;
    else break;
  }

  const lastAttended = attendances.find((a) => a.attended);
  const daysSinceLastAttendance = lastAttended ? daysBetween(lastAttended.date) : null;

  const reasons: string[] = [];
  let level: HealthLevel = "VERDE";

  if (consecutiveAbsences >= 4) {
    level = "ROJO";
    reasons.push(`${consecutiveAbsences} ausencias consecutivas`);
  } else if (consecutiveAbsences >= 2) {
    level = "AMARILLO";
    reasons.push(`${consecutiveAbsences} ausencias consecutivas`);
  }

  if (daysSinceLastAttendance !== null && daysSinceLastAttendance > 30) {
    level = "ROJO";
    reasons.push(`${daysSinceLastAttendance} días sin asistir`);
  } else if (daysSinceLastAttendance !== null && daysSinceLastAttendance > 14 && level === "VERDE") {
    level = "AMARILLO";
    reasons.push(`${daysSinceLastAttendance} días sin asistir`);
  }

  if (reasons.length === 0) reasons.push("Avanzando con normalidad");

  return { level, reasons, daysSinceLastAttendance, consecutiveAbsences };
}

// ============================================================================
// SALUD DE CÉLULA — verde / amarillo / rojo
// ============================================================================

export type CellHealth = {
  level: HealthLevel;
  score: number;
  attendancePercent: number;
  hasRecentReport: boolean;
  memberCount: number;
  newLast90Days: number;
};

export async function getCellHealth(cellId: string): Promise<CellHealth> {
  const memberships = await prisma.cellMembership.count({ where: { cellId, isCurrent: true } });

  const since90 = new Date();
  since90.setDate(since90.getDate() - 90);

  const [reports, newPeople] = await Promise.all([
    prisma.attendanceReport.findMany({ where: { cellId }, orderBy: { date: "desc" }, take: 4 }),
    prisma.person.count({ where: { currentCellId: cellId, registeredAt: { gte: since90 } } }),
  ]);

  const avgAttendance =
    reports.length > 0 ? reports.reduce((sum, r) => sum + r.attendancePercent, 0) / reports.length : 0;

  const lastReport = reports[0];
  const hasRecentReport = lastReport ? daysBetween(lastReport.date) <= 14 : false;

  let score = 0;
  score += avgAttendance >= 70 ? 40 : avgAttendance >= 50 ? 20 : 0;
  score += hasRecentReport ? 25 : 0;
  score += newPeople > 0 ? 20 : 0;
  score += memberships >= 5 ? 15 : memberships >= 2 ? 8 : 0;

  const level: HealthLevel = score >= 70 ? "VERDE" : score >= 40 ? "AMARILLO" : "ROJO";

  return {
    level,
    score,
    attendancePercent: Math.round(avgAttendance),
    hasRecentReport,
    memberCount: memberships,
    newLast90Days: newPeople,
  };
}

export const HEALTH_COLORS: Record<HealthLevel, string> = {
  VERDE: "bg-emerald-500",
  AMARILLO: "bg-gold-400",
  ROJO: "bg-brand-600",
};

export const HEALTH_LABELS: Record<HealthLevel, string> = {
  VERDE: "Avanzando",
  AMARILLO: "Requiere atención",
  ROJO: "En riesgo",
};

// ============================================================================
// PROGRESO DE LOS 4 PILARES (para el Cardex)
// ============================================================================

export type PillarProgress = {
  ganar: number;
  consolidar: number;
  entrenar: number;
  enviar: number;
};

export async function getPillarProgress(personId: string): Promise<PillarProgress> {
  const person = await prisma.person.findUniqueOrThrow({
    where: { id: personId },
    include: {
      acceptedJesus: true,
      firstCellVisit: true,
      preEncounterClasses: true,
      encounterRegs: true,
      postEncounterClasses: true,
      baptism: true,
      churchAttendance: true,
      discipleshipAsDisciple: true,
      developmentPlans: true,
    },
  });

  // GANAR: aceptó a Jesús, primera célula, nuevo miembro (3 hitos)
  let ganarHits = 0;
  if (person.acceptedJesus) ganarHits++;
  if (person.firstCellVisit) ganarHits++;
  if (person.currentCellId) ganarHits++;
  const ganar = Math.round((ganarHits / 3) * 100);

  // CONSOLIDAR: pre-encuentro(4), encuentro asistido, post-encuentro(4), bautismo, iglesia (8 hitos)
  const preOk = person.preEncounterClasses.filter((c) => c.completed).length;
  const encuentroOk = person.encounterRegs.some((e) => e.attended) ? 1 : 0;
  const postOk = person.postEncounterClasses.filter((c) => c.completed).length;
  const baptismOk = person.baptism ? 1 : 0;
  const churchOk = person.churchAttendance?.attends ? 1 : 0;
  const consolidarHits = preOk + encuentroOk * 4 + postOk + baptismOk * 4 + churchOk * 4;
  const consolidarTotal = 4 + 4 + 4 + 4 + 4;
  const consolidar = Math.round((consolidarHits / consolidarTotal) * 100);

  // ENTRENAR: sesiones de discipulado + planes de desarrollo completados
  const sesiones = person.discipleshipAsDisciple.length;
  const planesCompletados = person.developmentPlans.filter((p) => p.status === "COMPLETADO").length;
  const planesTotal = person.developmentPlans.length;
  const entrenar = Math.min(
    100,
    Math.round((Math.min(sesiones, 5) / 5) * 60 + (planesTotal > 0 ? (planesCompletados / planesTotal) * 40 : 0))
  );

  // ENVIAR: etapa de multiplicación (líder en formación -> co-líder -> líder -> multiplicación -> envío)
  const stage = await prisma.processStage.findUnique({ where: { id: person.currentStageId ?? "" } });
  const enviarStages = ["LIDER_EN_FORMACION", "CO_LIDER", "LIDER", "MULTIPLICACION", "ENVIO"];
  const enviarIndex = stage ? enviarStages.indexOf(stage.key) : -1;
  const enviar = enviarIndex >= 0 ? Math.round(((enviarIndex + 1) / enviarStages.length) * 100) : 0;

  return { ganar, consolidar, entrenar, enviar };
}
