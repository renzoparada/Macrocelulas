"use server";

import { prisma } from "@/lib/prisma";
import { addTimelineEvent } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key)?.toString().trim();
  return v ? v : undefined;
}

const STAGE_KEY_BY_MULT_STAGE: Record<string, string> = {
  LIDER_EN_FORMACION: "LIDER_EN_FORMACION",
  CO_LIDER: "CO_LIDER",
  LIDER: "LIDER",
  NUEVA_CELULA: "MULTIPLICACION",
};

export async function registerMultiplicationStep(formData: FormData) {
  const leaderId = str(formData, "leaderId");
  const discipleId = str(formData, "discipleId");
  const stage = str(formData, "stage") ?? "LIDER_EN_FORMACION";
  if (!leaderId || !discipleId) throw new Error("Selecciona líder y discípulo");

  const record = await prisma.leadershipMultiplication.create({
    data: {
      leaderId,
      discipleId,
      stage: stage as never,
      notes: str(formData, "notes"),
    },
  });

  const stageKey = STAGE_KEY_BY_MULT_STAGE[stage];
  if (stageKey) {
    const stageRow = await prisma.processStage.findUnique({ where: { key: stageKey } });
    if (stageRow) await prisma.person.update({ where: { id: discipleId }, data: { currentStageId: stageRow.id } });
  }

  await addTimelineEvent({
    personId: discipleId,
    type: "MULTIPLICACION",
    title: `Avanzó a: ${stage.replaceAll("_", " ")}`,
    icon: "GitBranch",
    relatedId: record.id,
  });

  revalidatePath("/multiplicacion");
  revalidatePath(`/personas/${discipleId}`);
  redirect("/multiplicacion");
}

export async function registerNewCell(formData: FormData) {
  const parentCellId = str(formData, "parentCellId");
  const newLeaderId = str(formData, "newLeaderId");

  const macroCell = parentCellId
    ? (await prisma.cell.findUnique({ where: { id: parentCellId } }))?.macroCellId
    : str(formData, "macroCellId");

  if (!macroCell) throw new Error("Selecciona una macro célula");

  const cell = await prisma.cell.create({
    data: {
      number: str(formData, "number") ?? "",
      name: str(formData, "name") ?? "",
      macroCellId: macroCell,
      leaderId: str(formData, "leaderUserId") || undefined,
      parentCellId: parentCellId || undefined,
      foundedAt: new Date(),
    },
  });

  if (newLeaderId) {
    const stageRow = await prisma.processStage.findUnique({ where: { key: "LIDER" } });
    if (stageRow) await prisma.person.update({ where: { id: newLeaderId }, data: { currentStageId: stageRow.id, currentCellId: cell.id } });

    await addTimelineEvent({
      personId: newLeaderId,
      type: "MULTIPLICACION",
      title: `Multiplicó y abrió la célula ${cell.name}`,
      icon: "GitBranch",
      relatedId: cell.id,
    });
  }

  revalidatePath("/multiplicacion");
  revalidatePath("/celulas");
  redirect(`/celulas/${cell.id}`);
}

export async function updateLeadershipDevelopment(personId: string, formData: FormData) {
  await prisma.leadershipDevelopment.upsert({
    where: { personId },
    create: {
      personId,
      startDate: str(formData, "startDate") ? new Date(str(formData, "startDate")!) : new Date(),
      strengths: str(formData, "strengths"),
      growthAreas: str(formData, "growthAreas"),
      notes: str(formData, "notes"),
    },
    update: {
      strengths: str(formData, "strengths"),
      growthAreas: str(formData, "growthAreas"),
      notes: str(formData, "notes"),
    },
  });

  revalidatePath(`/personas/${personId}`);
  redirect(`/personas/${personId}`);
}
