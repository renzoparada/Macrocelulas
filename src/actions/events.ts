"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key)?.toString().trim();
  return v ? v : undefined;
}

export async function createEvent(formData: FormData) {
  await requirePermission("events.manage");
  const event = await prisma.event.create({
    data: {
      type: str(formData, "type") ?? "Otro",
      name: str(formData, "name") ?? "",
      date: new Date(str(formData, "date") ?? new Date().toISOString()),
      objective: str(formData, "objective"),
      responsibleName: str(formData, "responsibleName"),
      cellId: str(formData, "cellId") || undefined,
    },
  });

  revalidatePath("/eventos");
  redirect(`/eventos/${event.id}`);
}

export async function addEventParticipant(eventId: string, formData: FormData) {
  await requirePermission("events.manage");
  const personId = str(formData, "personId");
  if (!personId) return;

  await prisma.eventParticipant.upsert({
    where: { eventId_personId: { eventId, personId } },
    create: {
      eventId,
      personId,
      role: (str(formData, "role") as never) ?? "PARTICIPANTE",
    },
    update: {},
  });

  revalidatePath(`/eventos/${eventId}`);
}

export async function updateEventResults(eventId: string, formData: FormData) {
  await requirePermission("events.manage");
  await prisma.event.update({ where: { id: eventId }, data: { results: str(formData, "results") } });
  revalidatePath(`/eventos/${eventId}`);
}
