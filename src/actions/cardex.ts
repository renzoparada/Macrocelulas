"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logAudit, addTimelineEvent } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key)?.toString().trim();
  return v ? v : undefined;
}

function backTo(personId: string) {
  revalidatePath(`/personas/${personId}`);
  redirect(`/personas/${personId}`);
}

// ---------------------------------------------------------------------------
// GANAR
// ---------------------------------------------------------------------------

export async function registerAcceptedJesus(personId: string, formData: FormData) {
  const date = str(formData, "date") ?? new Date().toISOString();
  const place = str(formData, "place");
  const accompaniedBy = str(formData, "accompaniedBy");
  const notes = str(formData, "notes");
  const testimony = str(formData, "testimony");
  const stage = str(formData, "moveStage");

  await prisma.acceptedJesus.upsert({
    where: { personId },
    create: { personId, date: new Date(date), place, accompaniedBy, notes, testimony },
    update: { date: new Date(date), place, accompaniedBy, notes, testimony },
  });

  if (stage === "yes") {
    const stageRow = await prisma.processStage.findUnique({ where: { key: "ACEPTO_JESUS" } });
    if (stageRow) {
      await prisma.person.update({ where: { id: personId }, data: { currentStageId: stageRow.id } });
      await prisma.personProcess.create({ data: { personId, stageId: stageRow.id, achievedAt: new Date(date) } });
    }
  }

  await addTimelineEvent({
    personId,
    type: "ACEPTO_JESUS",
    title: "Aceptó a Jesús",
    description: place ? `Lugar: ${place}` : undefined,
    icon: "Sparkles",
    date: new Date(date),
  });

  const session = await auth();
  await logAudit({ userId: session?.user.id, action: "CREATE", entity: "AcceptedJesus", recordId: personId });

  backTo(personId);
}

export async function registerFirstCellVisit(personId: string, formData: FormData) {
  const date = str(formData, "date") ?? new Date().toISOString();
  const cellName = str(formData, "cellName");
  const leaderName = str(formData, "leaderName");
  const broughtBy = str(formData, "broughtBy");
  const notes = str(formData, "notes");

  await prisma.firstCellVisit.upsert({
    where: { personId },
    create: { personId, date: new Date(date), cellName, leaderName, broughtBy, notes },
    update: { date: new Date(date), cellName, leaderName, broughtBy, notes },
  });

  await addTimelineEvent({
    personId,
    type: "PRIMERA_CELULA",
    title: "Primera vez en célula",
    description: cellName,
    icon: "Home",
    date: new Date(date),
  });

  backTo(personId);
}

// ---------------------------------------------------------------------------
// CONSOLIDAR
// ---------------------------------------------------------------------------

export async function togglePreEncounterClass(personId: string, classNumber: number, completed: boolean) {
  await prisma.preEncounterClass.upsert({
    where: { personId_classNumber: { personId, classNumber } },
    create: { personId, classNumber, completed, date: completed ? new Date() : undefined },
    update: { completed, date: completed ? new Date() : undefined },
  });

  const allDone = await prisma.preEncounterClass.count({ where: { personId, completed: true } });
  if (allDone === 4) {
    await addTimelineEvent({
      personId,
      type: "PRE_ENCUENTRO",
      title: "Completó las 4 clases de Pre-Encuentro",
      icon: "ListChecks",
    });
    const stage = await prisma.processStage.findUnique({ where: { key: "PRE_ENCUENTRO" } });
    if (stage) await prisma.person.update({ where: { id: personId }, data: { currentStageId: stage.id } });
  }

  revalidatePath(`/personas/${personId}`);
}

export async function togglePostEncounterClass(personId: string, classNumber: number, completed: boolean) {
  await prisma.postEncounterClass.upsert({
    where: { personId_classNumber: { personId, classNumber } },
    create: { personId, classNumber, completed, date: completed ? new Date() : undefined },
    update: { completed, date: completed ? new Date() : undefined },
  });

  const allDone = await prisma.postEncounterClass.count({ where: { personId, completed: true } });
  if (allDone === 4) {
    await addTimelineEvent({
      personId,
      type: "POST_ENCUENTRO",
      title: "Completó Post-Encuentro",
      icon: "ListChecks",
    });
  }

  revalidatePath(`/personas/${personId}`);
}

export async function registerBaptism(personId: string, formData: FormData) {
  const date = str(formData, "date") ?? new Date().toISOString();
  const place = str(formData, "place");
  const responsibleName = str(formData, "responsibleName");
  const notes = str(formData, "notes");

  await prisma.baptism.upsert({
    where: { personId },
    create: { personId, date: new Date(date), place, responsibleName, notes },
    update: { date: new Date(date), place, responsibleName, notes },
  });

  const stage = await prisma.processStage.findUnique({ where: { key: "BAUTISMO" } });
  if (stage) await prisma.person.update({ where: { id: personId }, data: { currentStageId: stage.id } });

  await addTimelineEvent({ personId, type: "BAUTISMO", title: "Bautismo", description: place, icon: "Droplet", date: new Date(date) });

  backTo(personId);
}

export async function createBaptismStandalone(formData: FormData) {
  const personId = str(formData, "personId");
  if (!personId) throw new Error("Selecciona una persona");
  await registerBaptism(personId, formData);
}

export async function updateChurchAttendance(personId: string, formData: FormData) {
  const attends = formData.get("attends") === "on";
  const churchName = str(formData, "churchName");
  const congregation = str(formData, "congregation");
  const frequency = str(formData, "frequency");
  const lastAttendance = str(formData, "lastAttendance");

  await prisma.churchAttendance.upsert({
    where: { personId },
    create: { personId, attends, churchName, congregation, frequency, lastAttendance: lastAttendance ? new Date(lastAttendance) : undefined },
    update: { attends, churchName, congregation, frequency, lastAttendance: lastAttendance ? new Date(lastAttendance) : undefined },
  });

  backTo(personId);
}

// ---------------------------------------------------------------------------
// VIDA — historia, desafíos, metas, sueños, logros
// ---------------------------------------------------------------------------

export async function updateLifeHistory(personId: string, formData: FormData) {
  const data = {
    history: str(formData, "history"),
    background: str(formData, "background"),
    currentSituation: str(formData, "currentSituation"),
    strengths: str(formData, "strengths"),
    developmentAreas: str(formData, "developmentAreas"),
    gifts: str(formData, "gifts"),
    talents: str(formData, "talents"),
    skills: str(formData, "skills"),
    purpose: str(formData, "purpose"),
  };

  await prisma.lifeHistory.upsert({
    where: { personId },
    create: { personId, ...data },
    update: data,
  });

  backTo(personId);
}

export async function addChallenge(personId: string, formData: FormData) {
  await prisma.personalChallenge.create({
    data: {
      personId,
      problem: str(formData, "problem") ?? "",
      category: str(formData, "category") ?? "Otro",
      description: str(formData, "description"),
      priority: str(formData, "priority") ?? "MEDIA",
      responsibleName: str(formData, "responsibleName"),
      status: (str(formData, "status") as never) ?? "ABIERTO",
    },
  });

  await addTimelineEvent({ personId, type: "DESAFIO", title: "Nuevo desafío registrado", isPrivate: true, icon: "AlertTriangle" });
  backTo(personId);
}

export async function addGoal(personId: string, formData: FormData) {
  await prisma.personalGoal.create({
    data: {
      personId,
      goal: str(formData, "goal") ?? "",
      category: str(formData, "category") ?? "Otra",
      description: str(formData, "description"),
      targetDate: str(formData, "targetDate") ? new Date(str(formData, "targetDate")!) : undefined,
      priority: str(formData, "priority") ?? "MEDIA",
      responsibleName: str(formData, "responsibleName"),
    },
  });

  await addTimelineEvent({ personId, type: "META", title: `Nueva meta: ${str(formData, "goal")}`, icon: "Target" });
  backTo(personId);
}

export async function addDream(personId: string, formData: FormData) {
  await prisma.dream.create({
    data: {
      personId,
      dream: str(formData, "dream") ?? "",
      description: str(formData, "description"),
      horizon: (str(formData, "horizon") as never) ?? "CORTO_PLAZO",
      nextStep: str(formData, "nextStep"),
    },
  });

  await addTimelineEvent({ personId, type: "SUENO", title: `Nuevo sueño: ${str(formData, "dream")}`, icon: "Star" });
  backTo(personId);
}

export async function addAchievement(personId: string, formData: FormData) {
  await prisma.achievement.create({
    data: {
      personId,
      achievement: str(formData, "achievement") ?? "",
      category: str(formData, "category"),
      description: str(formData, "description"),
      evidenceUrl: str(formData, "evidenceUrl"),
      comment: str(formData, "comment"),
    },
  });

  await addTimelineEvent({ personId, type: "LOGRO", title: `Logro: ${str(formData, "achievement")}`, icon: "Trophy" });
  backTo(personId);
}

export async function addTestimonial(personId: string, formData: FormData) {
  await prisma.testimonial.create({
    data: {
      personId,
      before: str(formData, "before"),
      process: str(formData, "process"),
      after: str(formData, "after"),
      whatGodDid: str(formData, "whatGodDid"),
      isPublic: formData.get("isPublic") === "on",
      authorizedToShare: formData.get("authorizedToShare") === "on",
    },
  });

  await addTimelineEvent({ personId, type: "TESTIMONIO", title: "Nuevo testimonio registrado", icon: "Quote" });
  backTo(personId);
}

// ---------------------------------------------------------------------------
// FAMILIA
// ---------------------------------------------------------------------------

export async function addFamilyRelationship(personId: string, formData: FormData) {
  const relatedPersonId = str(formData, "relatedPersonId");
  const relationType = str(formData, "relationType") ?? "OTRO";
  if (!relatedPersonId) return;

  let family = await prisma.family.findFirst({
    where: { relationships: { some: { OR: [{ personId }, { personId: relatedPersonId }] } } },
  });
  if (!family) {
    const person = await prisma.person.findUniqueOrThrow({ where: { id: personId } });
    family = await prisma.family.create({ data: { name: `Familia ${person.lastNamePaternal}` } });
  }

  await prisma.familyRelationship.create({
    data: { familyId: family.id, personId, relatedPersonId, relationType: relationType as never },
  });

  const inverseMap: Record<string, string> = { CONYUGE: "CONYUGE", HIJO: "PADRE", PADRE: "HIJO", MADRE: "HIJO", HERMANO: "HERMANO", OTRO: "OTRO" };
  await prisma.familyRelationship.create({
    data: {
      familyId: family.id,
      personId: relatedPersonId,
      relatedPersonId: personId,
      relationType: (inverseMap[relationType] ?? "OTRO") as never,
    },
  });

  backTo(personId);
}

// ---------------------------------------------------------------------------
// PRIVACIDAD
// ---------------------------------------------------------------------------

export async function setPersonStatus(personId: string, status: string) {
  await prisma.person.update({ where: { id: personId }, data: { status: status as never } });
  revalidatePath(`/personas/${personId}`);
}
