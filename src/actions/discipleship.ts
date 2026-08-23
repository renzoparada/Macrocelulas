"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { addTimelineEvent, logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key)?.toString().trim();
  return v ? v : undefined;
}

export async function createDiscipleshipSession(formData: FormData) {
  const session = await auth();
  const discipleId = str(formData, "discipleId");
  const mentorId = str(formData, "mentorId") ?? session?.user.personId;
  if (!discipleId || !mentorId) throw new Error("Selecciona discípulo y mentor");

  const toolIds = formData.getAll("toolIds").map((t) => t.toString());

  const record = await prisma.discipleshipSession.create({
    data: {
      discipleId,
      mentorId,
      topic: str(formData, "topic") ?? "",
      situation: str(formData, "situation"),
      objective: str(formData, "objective"),
      conversation: str(formData, "conversation"),
      commitments: str(formData, "commitments"),
      nextStep: str(formData, "nextStep"),
      followUpDate: str(formData, "followUpDate") ? new Date(str(formData, "followUpDate")!) : undefined,
      result: str(formData, "result"),
      privateNotes: str(formData, "privateNotes"),
      tools: { create: toolIds.map((toolId) => ({ toolId })) },
    },
  });

  const stage = await prisma.processStage.findUnique({ where: { key: "DISCIPULADO" } });
  const person = await prisma.person.findUnique({ where: { id: discipleId } });
  if (stage && person && !person.currentStageId) {
    await prisma.person.update({ where: { id: discipleId }, data: { currentStageId: stage.id } });
  }

  await addTimelineEvent({
    personId: discipleId,
    type: "DISCIPULADO",
    title: `Discipulado: ${record.topic}`,
    description: record.commitments ?? undefined,
    icon: "BookOpen",
    relatedId: record.id,
  });

  await logAudit({ userId: session?.user.id, action: "CREATE", entity: "DiscipleshipSession", recordId: record.id });

  revalidatePath("/discipulado");
  const backTo = str(formData, "backTo");
  redirect(backTo ?? "/discipulado");
}

export async function addDevelopmentPlan(personId: string, formData: FormData) {
  await prisma.developmentPlan.create({
    data: {
      personId,
      title: str(formData, "title") ?? "",
      category: str(formData, "category"),
      status: str(formData, "status") ?? "EN_PROCESO",
      startDate: new Date(),
      notes: str(formData, "notes"),
    },
  });

  revalidatePath(`/personas/${personId}`);
  redirect(`/personas/${personId}`);
}

export async function toggleDevelopmentPlanStatus(planId: string, personId: string, completed: boolean) {
  await prisma.developmentPlan.update({
    where: { id: planId },
    data: { status: completed ? "COMPLETADO" : "EN_PROCESO", completedAt: completed ? new Date() : null },
  });
  revalidatePath(`/personas/${personId}`);
}
