"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth-guard";
import { addTimelineEvent, logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key)?.toString().trim();
  return v ? v : undefined;
}

export async function createPrayerRequest(formData: FormData) {
  const session = await requirePermission("prayer.register");
  const personId = str(formData, "personId");
  if (!personId) throw new Error("Selecciona una persona");

  const request = await prisma.prayerRequest.create({
    data: {
      personId,
      motivo: str(formData, "motivo") ?? "",
      category: str(formData, "category") ?? "Otro",
      priority: (str(formData, "priority") as never) ?? "NORMAL",
      responsibleName: str(formData, "responsibleName"),
      notes: str(formData, "notes"),
      isPrivate: formData.get("isPrivate") === "on",
      createdById: session?.user.id,
    },
  });

  await addTimelineEvent({
    personId,
    type: "ORACION",
    title: "Motivo de oración registrado",
    description: request.motivo,
    icon: "HandHeart",
    isPrivate: request.isPrivate,
    relatedId: request.id,
  });

  await logAudit({ userId: session?.user.id, action: "CREATE", entity: "PrayerRequest", recordId: request.id });

  revalidatePath("/oracion");
  const backTo = str(formData, "backTo");
  redirect(backTo ?? "/oracion");
}

export async function addPrayerUpdate(prayerRequestId: string, formData: FormData) {
  await requirePermission("prayer.register");
  const note = str(formData, "note");
  if (!note) return;

  const prayer = await prisma.prayerRequestUpdate.create({
    data: { prayerRequestId, note, authorName: str(formData, "authorName") },
    include: { prayerRequest: true },
  });

  await addTimelineEvent({
    personId: prayer.prayerRequest.personId,
    type: "ORACION_SEGUIMIENTO",
    title: "Seguimiento de oración",
    description: note,
    icon: "HandHeart",
    isPrivate: prayer.prayerRequest.isPrivate,
    relatedId: prayerRequestId,
  });

  revalidatePath("/oracion");
  revalidatePath(`/oracion/${prayerRequestId}`);
}

export async function resolvePrayerRequest(prayerRequestId: string, formData: FormData) {
  await requirePermission("prayer.register");
  const response = str(formData, "response") ?? "";
  const testimony = str(formData, "testimony");
  const becameTestimonial = formData.get("becameTestimonial") === "on";

  const prayer = await prisma.prayerRequest.update({
    where: { id: prayerRequestId },
    data: { status: "RESUELTO", resolvedDate: new Date() },
  });

  await prisma.prayerRequestResolution.create({
    data: { prayerRequestId, response, testimony, becameTestimonial },
  });

  if (becameTestimonial && testimony) {
    await prisma.testimonial.create({
      data: {
        personId: prayer.personId,
        whatGodDid: testimony,
        after: response,
        isPublic: false,
        authorizedToShare: false,
      },
    });
  }

  await addTimelineEvent({
    personId: prayer.personId,
    type: "ORACION_RESUELTA",
    title: "Motivo de oración resuelto",
    description: response,
    icon: "Sparkles",
    isPrivate: prayer.isPrivate,
    relatedId: prayerRequestId,
  });

  revalidatePath("/oracion");
  redirect("/oracion");
}

export async function deactivatePrayerRequest(prayerRequestId: string) {
  await requirePermission("prayer.register");
  await prisma.prayerRequest.update({
    where: { id: prayerRequestId },
    data: { status: "DESACTIVADO", deactivatedDate: new Date() },
  });
  revalidatePath("/oracion");
}
