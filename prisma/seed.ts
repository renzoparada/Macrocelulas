import "dotenv/config";
import { fakerES as faker } from "@faker-js/faker";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { PROCESS_STAGES, DISCIPLESHIP_TOOLS, PRAYER_CATEGORIES, CHALLENGE_CATEGORIES, GOAL_CATEGORIES, EVENT_TYPES, RETREAT_TYPES } from "../src/lib/constants";
import { ROLE_PERMISSIONS, ROLE_LABELS } from "../src/lib/permissions";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function pickWeighted<T>(items: { value: T; weight: number }[]): T {
  const total = items.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  for (const item of items) {
    if (r < item.weight) return item.value;
    r -= item.weight;
  }
  return items[items.length - 1].value;
}
function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  console.log("🌱 Sembrando Macro Santidad CRM...");

  // -------------------------------------------------------------------------
  // 1. ROLES Y PERMISOS
  // -------------------------------------------------------------------------
  const roles: Record<string, { id: string }> = {};
  for (const key of Object.keys(ROLE_LABELS) as (keyof typeof ROLE_LABELS)[]) {
    roles[key] = await prisma.role.create({ data: { key: key as never, name: ROLE_LABELS[key] } });
  }

  const permissionKeysSet = new Set<string>();
  Object.values(ROLE_PERMISSIONS).forEach((perms) => perms.forEach((p) => permissionKeysSet.add(p)));
  const permissions: Record<string, { id: string }> = {};
  for (const key of permissionKeysSet) {
    permissions[key] = await prisma.permission.create({ data: { key, label: key, module: key.split(".")[0] } });
  }
  for (const [roleKey, perms] of Object.entries(ROLE_PERMISSIONS)) {
    for (const p of perms) {
      await prisma.rolePermission.create({ data: { roleId: roles[roleKey].id, permissionId: permissions[p].id } });
    }
  }
  console.log("✅ Roles y permisos creados");

  // -------------------------------------------------------------------------
  // 2. ETAPAS DEL PROCESO
  // -------------------------------------------------------------------------
  const stages: Record<string, { id: string; key: string }> = {};
  for (const s of PROCESS_STAGES) {
    stages[s.key] = await prisma.processStage.create({ data: s });
  }
  console.log("✅ Etapas del proceso creadas");

  // -------------------------------------------------------------------------
  // 3. HERRAMIENTAS DE DISCIPULADO
  // -------------------------------------------------------------------------
  const tools = await Promise.all(DISCIPLESHIP_TOOLS.map((t) => prisma.discipleshipTool.create({ data: t })));
  console.log(`✅ ${tools.length} herramientas de discipulado creadas`);

  // -------------------------------------------------------------------------
  // 4. MACRO CÉLULAS
  // -------------------------------------------------------------------------
  const macroCellNames = ["Macro Célula Santidad Norte", "Macro Célula Santidad Sur", "Macro Célula Santidad Centro"];
  const macroCells = await Promise.all(
    macroCellNames.map((name) => prisma.macroCell.create({ data: { name, description: `${name} — Ganar, Consolidar, Entrenar y Enviar.` } }))
  );
  console.log(`✅ ${macroCells.length} macro células creadas`);

  // -------------------------------------------------------------------------
  // 5. USUARIOS (ADMIN + 20 LÍDERES)
  // -------------------------------------------------------------------------
  const passwordHash = await bcrypt.hash("MacroSantidad2026", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@macrosantidad.org",
      passwordHash,
      name: "Administrador General",
      roleId: roles.ADMIN.id,
    },
  });

  const macroLeaders = await Promise.all(
    macroCells.map((mc, i) =>
      prisma.user.create({
        data: {
          email: `lider.macro${i + 1}@macrosantidad.org`,
          passwordHash,
          name: faker.person.fullName(),
          roleId: roles.LIDER_MACRO.id,
          macroCellId: mc.id,
        },
      })
    )
  );
  for (let i = 0; i < macroCells.length; i++) {
    await prisma.macroCell.update({ where: { id: macroCells[i].id }, data: { leaderId: macroLeaders[i].id } });
  }

  const cellLeaders = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.user.create({
        data: {
          email: `lider.celula${i + 1}@macrosantidad.org`,
          passwordHash,
          name: faker.person.fullName(),
          roleId: roles.LIDER_CELULA.id,
        },
      })
    )
  );

  const coLeaders = await Promise.all(
    Array.from({ length: 6 }).map((_, i) =>
      prisma.user.create({
        data: {
          email: `colider${i + 1}@macrosantidad.org`,
          passwordHash,
          name: faker.person.fullName(),
          roleId: roles.CO_LIDER.id,
        },
      })
    )
  );

  await prisma.user.create({
    data: { email: "supervisor@macrosantidad.org", passwordHash, name: faker.person.fullName(), roleId: roles.SUPERVISOR.id },
  });

  console.log("✅ Usuarios y líderes creados (20 líderes + administrador)");

  // -------------------------------------------------------------------------
  // 6. CÉLULAS (10)
  // -------------------------------------------------------------------------
  const meetingDays = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const cells = [];
  for (let i = 0; i < 10; i++) {
    const macroCell = macroCells[i % macroCells.length];
    const cell = await prisma.cell.create({
      data: {
        number: String(60 + i),
        name: `Célula ${faker.word.words(1)} ${i + 1}`.replace(/^./, (c) => c.toUpperCase()),
        macroCellId: macroCell.id,
        leaderId: cellLeaders[i].id,
        coLeaderId: i < coLeaders.length ? coLeaders[i].id : undefined,
        foundedAt: daysAgo(randomInt(180, 900)),
        meetingDay: pick(meetingDays),
        meetingTime: `${randomInt(17, 20)}:00`,
        address: faker.location.streetAddress(),
        status: "ACTIVA",
      },
    });
    cells.push(cell);
  }
  console.log(`✅ ${cells.length} células creadas`);

  // -------------------------------------------------------------------------
  // 7. PERSONAS (100 discípulos) + PROCESO
  // -------------------------------------------------------------------------
  const stageDistribution: { value: string; weight: number }[] = [
    { value: "ACEPTO_JESUS", weight: 8 },
    { value: "PRIMERA_CELULA", weight: 10 },
    { value: "NUEVO_MIEMBRO", weight: 20 },
    { value: "PRE_ENCUENTRO", weight: 15 },
    { value: "ENCUENTRO", weight: 10 },
    { value: "POST_ENCUENTRO", weight: 10 },
    { value: "BAUTISMO", weight: 8 },
    { value: "INTEGRACION_IGLESIA", weight: 6 },
    { value: "DISCIPULADO", weight: 6 },
    { value: "ENTRENAMIENTO", weight: 3 },
    { value: "LIDER_EN_FORMACION", weight: 2 },
    { value: "CO_LIDER", weight: 1 },
    { value: "LIDER", weight: 1 },
  ];

  const howArrivedOptions = [
    "INVITACION_PERSONAL",
    "INVITACION_MIEMBRO",
    "INVITACION_LIDER",
    "IGLESIA",
    "EVENTO",
    "CONGRESO",
    "ENCUENTRO",
    "REDES_SOCIALES",
    "CAMPANA",
    "OTRO",
  ];

  const stageOrder = PROCESS_STAGES.map((s) => s.key);
  const people: { id: string; stageKey: string; cellId: string }[] = [];

  for (let i = 0; i < 100; i++) {
    const sex = pick(["MASCULINO", "FEMENINO"]) as "MASCULINO" | "FEMENINO";
    const firstName = sex === "MASCULINO" ? faker.person.firstName("male") : faker.person.firstName("female");
    const cell = pick(cells);
    const registeredAt = daysAgo(randomInt(5, 500));
    const stageKey = pickWeighted(stageDistribution);

    const person = await prisma.person.create({
      data: {
        firstName,
        lastNamePaternal: faker.person.lastName(),
        lastNameMaternal: faker.person.lastName(),
        birthDate: faker.date.birthdate({ min: 15, max: 65, mode: "age" }),
        sex,
        documentId: faker.string.numeric(8),
        phone: faker.phone.number({ style: "national" }),
        whatsapp: faker.phone.number({ style: "national" }),
        email: faker.internet.email({ firstName }).toLowerCase(),
        address: faker.location.streetAddress(),
        city: "Lima",
        zone: faker.location.county(),
        occupation: faker.person.jobTitle(),
        registeredAt,
        status: pickWeighted([
          { value: "ACTIVO", weight: 85 },
          { value: "EN_RIESGO", weight: 8 },
          { value: "INACTIVO", weight: 7 },
        ]) as never,
        howArrived: pick(howArrivedOptions) as never,
        currentCellId: cell.id,
        currentStageId: stages[stageKey].id,
      },
    });

    await prisma.cellMembership.create({ data: { personId: person.id, cellId: cell.id, joinedAt: registeredAt } });
    people.push({ id: person.id, stageKey, cellId: cell.id });
  }
  console.log(`✅ ${people.length} personas (discípulos) creadas`);

  // Invitaciones (quién invitó a quién) — encadenar aleatoriamente
  for (const p of people) {
    if (Math.random() < 0.6) {
      const inviter = pick(people.filter((x) => x.id !== p.id));
      await prisma.person.update({ where: { id: p.id }, data: { invitedById: inviter.id } });
      await prisma.invitation.create({ data: { inviterId: inviter.id, invitedId: p.id, cellId: p.cellId } });
    }
  }
  console.log("✅ Invitaciones registradas");

  // -------------------------------------------------------------------------
  // 8. GANAR / CONSOLIDAR — hitos según etapa alcanzada
  // -------------------------------------------------------------------------
  function reachedStage(stageKey: string, target: string) {
    return stageOrder.indexOf(stageKey) >= stageOrder.indexOf(target);
  }

  const encounter1 = await prisma.encounter.create({
    data: { type: "ENCUENTRO", name: "Encuentro con Dios — Edición Verano", date: daysAgo(90), place: "Casa de Retiros El Manantial", capacity: 80 },
  });
  const encounter2 = await prisma.encounter.create({
    data: { type: "RE_ENCUENTRO", name: "Re-Encuentro Restauración", date: daysAgo(30), place: "Casa de Retiros El Manantial", capacity: 60 },
  });

  const timelineRows: { personId: string; date: Date; type: string; title: string; description?: string; icon?: string; isPrivate?: boolean }[] = [];

  for (const p of people) {
    const events: typeof timelineRows = [];
    const person = await prisma.person.findUniqueOrThrow({ where: { id: p.id } });
    const base = person.registeredAt;

    events.push({ personId: p.id, date: base, type: "REGISTRO", title: "Persona registrada en el sistema", icon: "UserPlus" });

    if (reachedStage(p.stageKey, "ACEPTO_JESUS")) {
      const d = daysAgo(randomInt(5, 400));
      await prisma.acceptedJesus.create({ data: { personId: p.id, date: d, place: pick(["Célula", "Iglesia", "Encuentro", "Casa"]), accompaniedBy: faker.person.fullName() } });
      events.push({ personId: p.id, date: d, type: "ACEPTO_JESUS", title: "Aceptó a Jesús", icon: "Sparkles" });
    }

    if (reachedStage(p.stageKey, "PRIMERA_CELULA")) {
      const d = daysAgo(randomInt(5, 380));
      await prisma.firstCellVisit.create({ data: { personId: p.id, date: d, cellName: `Célula ${p.cellId}`, broughtBy: faker.person.fullName() } });
      events.push({ personId: p.id, date: d, type: "PRIMERA_CELULA", title: "Primera vez en célula", icon: "Home" });
    }

    if (reachedStage(p.stageKey, "PRE_ENCUENTRO")) {
      const classesCompleted = reachedStage(p.stageKey, "ENCUENTRO") ? 4 : randomInt(0, 3);
      for (let c = 1; c <= 4; c++) {
        await prisma.preEncounterClass.create({
          data: { personId: p.id, classNumber: c, completed: c <= classesCompleted, date: c <= classesCompleted ? daysAgo(randomInt(10, 200)) : undefined },
        });
      }
      if (classesCompleted === 4) events.push({ personId: p.id, date: daysAgo(randomInt(10, 150)), type: "PRE_ENCUENTRO", title: "Completó Pre-Encuentro", icon: "ListChecks" });
    }

    if (reachedStage(p.stageKey, "ENCUENTRO")) {
      const enc = pick([encounter1, encounter2]);
      const d = daysAgo(randomInt(5, 150));
      await prisma.encounterRegistration.create({ data: { encounterId: enc.id, personId: p.id, cellId: p.cellId, confirmed: true, attended: true, registeredAt: d } });
      events.push({ personId: p.id, date: d, type: "ENCUENTRO", title: `Asistió a ${enc.name}`, icon: "Sparkles" });
    }

    if (reachedStage(p.stageKey, "POST_ENCUENTRO")) {
      const classesCompleted = reachedStage(p.stageKey, "BAUTISMO") ? 4 : randomInt(0, 3);
      for (let c = 1; c <= 4; c++) {
        await prisma.postEncounterClass.create({
          data: { personId: p.id, classNumber: c, completed: c <= classesCompleted, date: c <= classesCompleted ? daysAgo(randomInt(5, 120)) : undefined },
        });
      }
    }

    if (reachedStage(p.stageKey, "BAUTISMO")) {
      const d = daysAgo(randomInt(5, 100));
      await prisma.baptism.create({ data: { personId: p.id, date: d, place: "Río Rímac / Piscina Iglesia Central", responsibleName: faker.person.fullName() } });
      events.push({ personId: p.id, date: d, type: "BAUTISMO", title: "Bautismo", icon: "Droplet" });
    }

    if (reachedStage(p.stageKey, "INTEGRACION_IGLESIA")) {
      await prisma.churchAttendance.create({
        data: { personId: p.id, attends: true, churchName: "Iglesia Macro Santidad", frequency: pick(["Semanal", "Quincenal"]), lastAttendance: daysAgo(randomInt(1, 14)) },
      });
    }

    timelineRows.push(...events);
  }
  await prisma.personTimeline.createMany({ data: timelineRows });
  console.log("✅ Hitos de GANAR/CONSOLIDAR y Timeline registrados");

  // -------------------------------------------------------------------------
  // 9. DISCIPULADO
  // -------------------------------------------------------------------------
  const disciplePool = people.filter((p) => reachedStage(p.stageKey, "DISCIPULADO"));
  const mentorPool = people.filter((p) => reachedStage(p.stageKey, "LIDER_EN_FORMACION"));
  const mentorFallback = pick(people);

  for (const p of disciplePool) {
    const sessionsCount = randomInt(1, 4);
    for (let s = 0; s < sessionsCount; s++) {
      const mentor = mentorPool.length > 0 ? pick(mentorPool) : mentorFallback;
      const session = await prisma.discipleshipSession.create({
        data: {
          discipleId: p.id,
          mentorId: mentor.id,
          date: daysAgo(randomInt(1, 200)),
          topic: pick(["Identidad en Cristo", "Vida de oración", "Perdón y restauración", "Propósito y llamado", "Mayordomía financiera", "Familia y matrimonio"]),
          situation: faker.lorem.sentence(),
          objective: faker.lorem.sentence(),
          commitments: faker.lorem.sentence(),
          nextStep: faker.lorem.words(5),
        },
      });
      const sessionTools = faker.helpers.arrayElements(tools, randomInt(1, 3));
      await prisma.discipleshipSessionTool.createMany({ data: sessionTools.map((t) => ({ sessionId: session.id, toolId: t.id })) });
    }

    if (Math.random() < 0.5) {
      await prisma.developmentPlan.create({
        data: {
          personId: p.id,
          title: pick(["Escuela de Discípulos", "Curso de Liderazgo Nivel 1", "Formación Bíblica Básica", "Escuela de Líderes"]),
          category: pick(["Clase", "Curso", "Formación"]),
          status: pick(["EN_PROCESO", "COMPLETADO"]),
          startDate: daysAgo(randomInt(30, 200)),
          completedAt: Math.random() < 0.5 ? daysAgo(randomInt(1, 30)) : null,
        },
      });
    }
  }
  console.log("✅ Discipulados registrados");

  // -------------------------------------------------------------------------
  // 10. VIDA — desafíos, metas, sueños, logros, testimonios
  // -------------------------------------------------------------------------
  for (const p of people) {
    if (Math.random() < 0.4) {
      await prisma.lifeHistory.create({
        data: {
          personId: p.id,
          history: faker.lorem.paragraph(),
          strengths: faker.lorem.words(6),
          developmentAreas: faker.lorem.words(6),
          gifts: pick(["Servicio", "Enseñanza", "Misericordia", "Liderazgo", "Hospitalidad"]),
          purpose: faker.lorem.sentence(),
        },
      });
    }
    if (Math.random() < 0.3) {
      await prisma.personalChallenge.create({
        data: {
          personId: p.id,
          problem: faker.lorem.words(5),
          category: pick(CHALLENGE_CATEGORIES),
          description: faker.lorem.sentence(),
          status: pick(["ABIERTO", "EN_SEGUIMIENTO", "MEJORANDO", "RESUELTO"]) as never,
        },
      });
    }
    if (Math.random() < 0.4) {
      await prisma.personalGoal.create({
        data: {
          personId: p.id,
          goal: faker.lorem.words(4),
          category: pick(GOAL_CATEGORIES),
          progress: randomInt(0, 100),
          status: pick(["EN_PROCESO", "CUMPLIDA"]),
          targetDate: daysAgo(-randomInt(30, 200)),
        },
      });
    }
    if (Math.random() < 0.3) {
      await prisma.dream.create({
        data: {
          personId: p.id,
          dream: faker.lorem.words(5),
          horizon: pick(["CORTO_PLAZO", "MEDIANO_PLAZO", "LARGO_PLAZO"]) as never,
          nextStep: faker.lorem.words(4),
        },
      });
    }
    if (Math.random() < 0.25) {
      await prisma.achievement.create({
        data: {
          personId: p.id,
          achievement: pick(["Completó Encuentro", "Terminó un curso", "Consiguió trabajo", "Lideró una reunión", "Restauró una relación"]),
          category: "Personal",
          comment: faker.lorem.sentence(),
        },
      });
    }
    if (Math.random() < 0.15) {
      await prisma.testimonial.create({
        data: {
          personId: p.id,
          before: faker.lorem.sentence(),
          process: faker.lorem.sentence(),
          after: faker.lorem.sentence(),
          whatGodDid: faker.lorem.sentence(),
          isPublic: Math.random() < 0.5,
          authorizedToShare: Math.random() < 0.5,
        },
      });
    }
  }
  console.log("✅ Historias, metas, sueños, logros y testimonios registrados");

  // -------------------------------------------------------------------------
  // 11. MOTIVOS DE ORACIÓN
  // -------------------------------------------------------------------------
  const prayerSubjects = [
    "Restauración familiar",
    "Dirección para una decisión laboral",
    "Salud de un familiar",
    "Propósito personal",
    "Provisión económica",
    "Restauración matrimonial",
    "Salvación de un familiar",
    "Sabiduría para estudios",
    "Sanidad emocional",
    "Protección espiritual",
  ];

  for (const p of people) {
    const requestCount = pickWeighted([
      { value: 0, weight: 40 },
      { value: 1, weight: 40 },
      { value: 2, weight: 20 },
    ]);
    for (let i = 0; i < requestCount; i++) {
      const status = pickWeighted([
        { value: "ACTIVO", weight: 55 },
        { value: "RESUELTO", weight: 35 },
        { value: "DESACTIVADO", weight: 10 },
      ]) as "ACTIVO" | "RESUELTO" | "DESACTIVADO";

      const startDate = daysAgo(randomInt(1, 150));
      const request = await prisma.prayerRequest.create({
        data: {
          personId: p.id,
          motivo: pick(prayerSubjects),
          category: pick(PRAYER_CATEGORIES),
          priority: pick(["URGENTE", "IMPORTANTE", "NORMAL"]) as never,
          status,
          startDate,
          resolvedDate: status === "RESUELTO" ? daysAgo(randomInt(0, 60)) : null,
          deactivatedDate: status === "DESACTIVADO" ? daysAgo(randomInt(0, 60)) : null,
          isPrivate: Math.random() < 0.2,
        },
      });

      if (Math.random() < 0.5) {
        await prisma.prayerRequestUpdate.create({
          data: { prayerRequestId: request.id, note: "Seguimiento: seguimos orando y acompañando.", date: daysAgo(randomInt(0, 30)) },
        });
      }

      if (status === "RESUELTO") {
        await prisma.prayerRequestResolution.create({
          data: { prayerRequestId: request.id, response: "Dios respondió y la situación mejoró notablemente.", testimony: "Encontró una nueva oportunidad y paz en su familia." },
        });
      }

      await prisma.personTimeline.create({
        data: { personId: p.id, date: startDate, type: "ORACION", title: "Motivo de oración registrado", description: request.motivo, icon: "HandHeart", isPrivate: request.isPrivate },
      });
    }
  }
  console.log("✅ Motivos de oración registrados");

  // -------------------------------------------------------------------------
  // 12. ASISTENCIA (últimas 8 semanas por célula)
  // -------------------------------------------------------------------------
  for (const cell of cells) {
    const memberships = await prisma.cellMembership.findMany({ where: { cellId: cell.id } });
    for (let week = 0; week < 8; week++) {
      const date = daysAgo(week * 7);
      let attendeesCount = 0;
      for (const m of memberships) {
        const attended = Math.random() < 0.75;
        if (attended) attendeesCount++;
        await prisma.attendance.create({ data: { cellId: cell.id, personId: m.personId, date, attended, isGuest: false } });
      }
      const attendancePercent = memberships.length > 0 ? Math.round((attendeesCount / memberships.length) * 100) : 0;
      await prisma.attendanceReport.create({
        data: {
          cellId: cell.id,
          date,
          membersCount: memberships.length,
          attendeesCount,
          newCount: randomInt(0, 2),
          guestsCount: randomInt(0, 3),
          absentCount: memberships.length - attendeesCount,
          attendancePercent,
          activity: pick(["Alabanza y estudio bíblico", "Dinámica de integración", "Testimonios y oración"]),
        },
      });
    }
  }
  console.log("✅ Asistencia e informes de célula (8 semanas) generados");

  // -------------------------------------------------------------------------
  // 13. RETIROS, CONGRESOS, EVENTOS
  // -------------------------------------------------------------------------
  const retreatType = await prisma.retreatType.create({ data: { name: pick(RETREAT_TYPES) } });
  const retreat = await prisma.retreat.create({ data: { retreatTypeId: retreatType.id, name: "Retiro de Liderazgo 2026", date: daysAgo(60), place: "Casa de Retiros Monte Sinaí" } });
  await prisma.retreatParticipant.createMany({
    data: faker.helpers.arrayElements(people, 15).map((p) => ({ retreatId: retreat.id, personId: p.id })),
  });

  const congress = await prisma.congress.create({ data: { name: "Congreso Nacional de Multiplicación 2026", date: daysAgo(45), place: "Centro de Convenciones Lima" } });
  await prisma.congressParticipant.createMany({
    data: faker.helpers.arrayElements(people, 25).map((p) => ({ congressId: congress.id, personId: p.id, inscription: true, attendance: true })),
  });

  const cosecha = await prisma.event.create({ data: { type: "Cosecha", name: "Cosecha de Verano", date: daysAgo(20), objective: "Alcanzar nuevas personas para Cristo", responsibleName: faker.person.fullName() } });
  const cosechaGuests = faker.helpers.arrayElements(people, 12);
  await prisma.eventParticipant.createMany({
    data: cosechaGuests.map((p, i) => ({ eventId: cosecha.id, personId: p.id, role: i < 6 ? "INVITADO" : "NUEVO" })) as never,
  });

  for (const type of EVENT_TYPES.slice(0, 5)) {
    const event = await prisma.event.create({ data: { type, name: `${type} — Macro Santidad`, date: daysAgo(randomInt(5, 120)), responsibleName: faker.person.fullName() } });
    await prisma.eventParticipant.createMany({
      data: faker.helpers.arrayElements(people, randomInt(5, 15)).map((p) => ({ eventId: event.id, personId: p.id })),
    });
  }
  console.log("✅ Retiros, congresos y eventos registrados");

  // -------------------------------------------------------------------------
  // 14. MULTIPLICACIÓN
  // -------------------------------------------------------------------------
  const potentialLeaders = people.filter((p) => reachedStage(p.stageKey, "LIDER_EN_FORMACION"));
  for (const leader of potentialLeaders.slice(0, 5)) {
    const disciple = pick(people.filter((p) => p.id !== leader.id));
    await prisma.leadershipMultiplication.create({
      data: { leaderId: leader.id, discipleId: disciple.id, stage: pick(["LIDER_EN_FORMACION", "CO_LIDER", "LIDER"]) as never, notes: "Avanzando en su proceso de formación." },
    });
    await prisma.leadershipDevelopment.create({
      data: { personId: leader.id, startDate: daysAgo(randomInt(30, 300)), strengths: "Liderazgo servicial, enseñanza", growthAreas: "Delegación" },
    });
  }

  // Una célula multiplicada de ejemplo
  const motherCell = cells[0];
  const newCell = await prisma.cell.create({
    data: {
      number: "70",
      name: "Célula Vida Nueva",
      macroCellId: motherCell.macroCellId,
      parentCellId: motherCell.id,
      leaderId: cellLeaders[0].id,
      foundedAt: daysAgo(15),
      status: "EN_FORMACION",
    },
  });
  console.log(`✅ Multiplicación registrada (célula ${newCell.number} nació de C${motherCell.number})`);

  // -------------------------------------------------------------------------
  // 15. TAREAS Y NOTIFICACIONES
  // -------------------------------------------------------------------------
  for (const p of faker.helpers.arrayElements(people, 10)) {
    await prisma.task.create({
      data: {
        personId: p.id,
        type: pick(["LLAMAR", "WHATSAPP", "VISITAR", "SEGUIMIENTO", "INVITAR_ENCUENTRO"]) as never,
        status: pick(["PENDIENTE", "EN_PROCESO", "COMPLETADA"]) as never,
        dueDate: daysAgo(-randomInt(1, 14)),
        notes: faker.lorem.sentence(),
      },
    });
  }

  const notificationMessages = [
    "La Célula 69 no presentó su informe.",
    "María cumple 3 meses en el proceso.",
    "José está habilitado para Encuentro.",
    "Pedro tiene 4 ausencias consecutivas.",
    "Ana tiene una meta vencida.",
    "Hay 6 motivos de oración con más de 90 días.",
    "Nueva persona incorporada esta semana.",
  ];
  await prisma.notification.createMany({
    data: notificationMessages.map((message) => ({ userId: admin.id, message, type: "ALERTA" })),
  });
  console.log("✅ Tareas de seguimiento y notificaciones creadas");

  // -------------------------------------------------------------------------
  // 16. AUDITORÍA
  // -------------------------------------------------------------------------
  await prisma.auditLog.createMany({
    data: [
      { userId: admin.id, action: "CREATE", entity: "MacroCell", recordId: macroCells[0].id },
      { userId: admin.id, action: "CREATE", entity: "Cell", recordId: cells[0].id },
      { userId: admin.id, action: "CREATE", entity: "User", recordId: cellLeaders[0].id },
    ],
  });

  console.log("🎉 Datos de demostración creados con éxito.");
  console.log("");
  console.log("Usuario administrador: admin@macrosantidad.org");
  console.log("Contraseña: MacroSantidad2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
