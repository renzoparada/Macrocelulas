"use server";

import { prisma } from "@/lib/prisma";
import { addTimelineEvent } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key)?.toString().trim();
  return v ? v : undefined;
}

export async function createEncounter(formData: FormData) {
  const encounter = await prisma.encounter.create({
    data: {
      type: (str(formData, "type") as never) ?? "ENCUENTRO",
      name: str(formData, "name") ?? "",
      date: new Date(str(formData, "date") ?? new Date().toISOString()),
      place: str(formData, "place"),
      capacity: str(formData, "capacity") ? Number(str(formData, "capacity")) : undefined,
      responsibleName: str(formData, "responsibleName"),
      requirements: str(formData, "requirements"),
    },
  });

  revalidatePath("/encuentros");
  redirect(`/encuentros/${encounter.id}`);
}

export async function registerForEncounter(encounterId: string, formData: FormData) {
  const personId = str(formData, "personId");
  if (!personId) return;

  await prisma.encounterRegistration.upsert({
    where: { encounterId_personId: { encounterId, personId } },
    create: { encounterId, personId, cellId: str(formData, "cellId") },
    update: {},
  });

  revalidatePath(`/encuentros/${encounterId}`);
}

export async function markEncounterAttendance(encounterId: string, personId: string, attended: boolean) {
  await prisma.encounterRegistration.update({
    where: { encounterId_personId: { encounterId, personId } },
    data: { attended, confirmed: attended ? true : undefined },
  });

  if (attended) {
    const encounter = await prisma.encounter.findUnique({ where: { id: encounterId } });
    const stage = await prisma.processStage.findUnique({ where: { key: "ENCUENTRO" } });
    if (stage) await prisma.person.update({ where: { id: personId }, data: { currentStageId: stage.id } });

    await addTimelineEvent({
      personId,
      type: "ENCUENTRO",
      title: `Asistió a ${encounter?.name ?? "Encuentro"}`,
      icon: "Sparkles",
    });
  }

  revalidatePath(`/encuentros/${encounterId}`);
}

export async function toggleEncounterConfirmation(encounterId: string, personId: string, confirmed: boolean) {
  await prisma.encounterRegistration.update({ where: { encounterId_personId: { encounterId, personId } }, data: { confirmed } });
  revalidatePath(`/encuentros/${encounterId}`);
}
