"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requirePermission, requireSession } from "@/lib/auth-guard";
import { logAudit, addTimelineEvent } from "@/lib/audit";

const personSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  lastNamePaternal: z.string().min(1, "El apellido paterno es obligatorio"),
  lastNameMaternal: z.string().optional(),
  birthDate: z.string().optional(),
  sex: z.enum(["MASCULINO", "FEMENINO"]).optional(),
  documentId: z.string().optional(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zone: z.string().optional(),
  occupation: z.string().optional(),
  company: z.string().optional(),
  socialMedia: z.string().optional(),
  photoUrl: z.string().optional(),
  howArrived: z.string().optional(),
  originDetail: z.string().optional(),
  invitedById: z.string().optional(),
  currentCellId: z.string().optional(),
});

function emptyToUndefined(v: FormDataEntryValue | null): string | undefined {
  const s = v?.toString().trim();
  return s ? s : undefined;
}

export async function createPerson(formData: FormData) {
  const session = await requirePermission("people.create");

  const raw = {
    firstName: formData.get("firstName")?.toString() ?? "",
    lastNamePaternal: formData.get("lastNamePaternal")?.toString() ?? "",
    lastNameMaternal: emptyToUndefined(formData.get("lastNameMaternal")),
    birthDate: emptyToUndefined(formData.get("birthDate")),
    sex: emptyToUndefined(formData.get("sex")),
    documentId: emptyToUndefined(formData.get("documentId")),
    phone: emptyToUndefined(formData.get("phone")),
    whatsapp: emptyToUndefined(formData.get("whatsapp")),
    email: emptyToUndefined(formData.get("email")),
    address: emptyToUndefined(formData.get("address")),
    city: emptyToUndefined(formData.get("city")),
    zone: emptyToUndefined(formData.get("zone")),
    occupation: emptyToUndefined(formData.get("occupation")),
    company: emptyToUndefined(formData.get("company")),
    socialMedia: emptyToUndefined(formData.get("socialMedia")),
    photoUrl: emptyToUndefined(formData.get("photoUrl")),
    howArrived: emptyToUndefined(formData.get("howArrived")),
    originDetail: emptyToUndefined(formData.get("originDetail")),
    invitedById: emptyToUndefined(formData.get("invitedById")),
    currentCellId: emptyToUndefined(formData.get("currentCellId")),
  };

  const parsed = personSchema.parse(raw);

  const defaultStage = await prisma.processStage.findUnique({ where: { key: "NUEVO_MIEMBRO" } });

  const person = await prisma.person.create({
    data: {
      firstName: parsed.firstName,
      lastNamePaternal: parsed.lastNamePaternal,
      lastNameMaternal: parsed.lastNameMaternal,
      birthDate: parsed.birthDate ? new Date(parsed.birthDate) : undefined,
      sex: parsed.sex as "MASCULINO" | "FEMENINO" | undefined,
      documentId: parsed.documentId,
      phone: parsed.phone,
      whatsapp: parsed.whatsapp,
      email: parsed.email,
      address: parsed.address,
      city: parsed.city,
      zone: parsed.zone,
      occupation: parsed.occupation,
      company: parsed.company,
      socialMedia: parsed.socialMedia,
      photoUrl: parsed.photoUrl,
      howArrived: parsed.howArrived as never,
      originDetail: parsed.originDetail,
      invitedById: parsed.invitedById || undefined,
      currentCellId: parsed.currentCellId || undefined,
      currentStageId: parsed.currentCellId ? defaultStage?.id : undefined,
    },
  });

  if (parsed.currentCellId) {
    await prisma.cellMembership.create({
      data: { personId: person.id, cellId: parsed.currentCellId, role: "MIEMBRO" },
    });
  }

  if (parsed.invitedById) {
    await prisma.invitation.create({
      data: {
        inviterId: parsed.invitedById,
        invitedId: person.id,
        howArrived: parsed.howArrived as never,
        eventSource: parsed.originDetail,
        cellId: parsed.currentCellId || undefined,
      },
    });
  }

  await addTimelineEvent({
    personId: person.id,
    type: "REGISTRO",
    title: "Persona registrada en el sistema",
    description: parsed.currentCellId ? "Ingresó asignado a una célula." : undefined,
    icon: "UserPlus",
  });

  await logAudit({
    userId: session?.user.id,
    action: "CREATE",
    entity: "Person",
    recordId: person.id,
    newValue: parsed,
  });

  revalidatePath("/personas");
  redirect(`/personas/${person.id}`);
}

export async function updatePerson(personId: string, formData: FormData) {
  const session = await requirePermission("people.edit");
  const before = await prisma.person.findUnique({ where: { id: personId } });

  const raw = {
    firstName: formData.get("firstName")?.toString() ?? "",
    lastNamePaternal: formData.get("lastNamePaternal")?.toString() ?? "",
    lastNameMaternal: emptyToUndefined(formData.get("lastNameMaternal")),
    birthDate: emptyToUndefined(formData.get("birthDate")),
    sex: emptyToUndefined(formData.get("sex")),
    documentId: emptyToUndefined(formData.get("documentId")),
    phone: emptyToUndefined(formData.get("phone")),
    whatsapp: emptyToUndefined(formData.get("whatsapp")),
    email: emptyToUndefined(formData.get("email")),
    address: emptyToUndefined(formData.get("address")),
    city: emptyToUndefined(formData.get("city")),
    zone: emptyToUndefined(formData.get("zone")),
    occupation: emptyToUndefined(formData.get("occupation")),
    company: emptyToUndefined(formData.get("company")),
    socialMedia: emptyToUndefined(formData.get("socialMedia")),
    photoUrl: emptyToUndefined(formData.get("photoUrl")),
    status: emptyToUndefined(formData.get("status")),
  };

  await prisma.person.update({
    where: { id: personId },
    data: {
      firstName: raw.firstName,
      lastNamePaternal: raw.lastNamePaternal,
      lastNameMaternal: raw.lastNameMaternal,
      birthDate: raw.birthDate ? new Date(raw.birthDate) : undefined,
      sex: raw.sex as "MASCULINO" | "FEMENINO" | undefined,
      documentId: raw.documentId,
      phone: raw.phone,
      whatsapp: raw.whatsapp,
      email: raw.email,
      address: raw.address,
      city: raw.city,
      zone: raw.zone,
      occupation: raw.occupation,
      company: raw.company,
      socialMedia: raw.socialMedia,
      photoUrl: raw.photoUrl,
      status: raw.status as never,
    },
  });

  await logAudit({
    userId: session?.user.id,
    action: "UPDATE",
    entity: "Person",
    recordId: personId,
    oldValue: before,
    newValue: raw,
  });

  revalidatePath(`/personas/${personId}`);
  redirect(`/personas/${personId}`);
}

export async function changePersonCell(personId: string, formData: FormData) {
  await requirePermission("people.edit");

  const newCellId = formData.get("cellId")?.toString();
  if (!newCellId) return;

  const person = await prisma.person.findUniqueOrThrow({ where: { id: personId } });
  const reason = formData.get("reason")?.toString();

  await prisma.$transaction(async (tx) => {
    if (person.currentCellId) {
      await tx.cellMembership.updateMany({
        where: { personId, cellId: person.currentCellId, isCurrent: true },
        data: { isCurrent: false, leftAt: new Date() },
      });
    }

    await tx.cellHistory.create({
      data: {
        personId,
        previousCellId: person.currentCellId,
        newCellId,
        joinedAt: new Date(),
        reason,
      },
    });

    await tx.cellMembership.create({
      data: { personId, cellId: newCellId, role: "MIEMBRO" },
    });

    await tx.person.update({ where: { id: personId }, data: { currentCellId: newCellId } });
  });

  const newCell = await prisma.cell.findUnique({ where: { id: newCellId } });

  await addTimelineEvent({
    personId,
    type: "CAMBIO_CELULA",
    title: `Cambió a la célula ${newCell?.name ?? ""}`,
    description: reason,
    icon: "ArrowRightLeft",
  });

  revalidatePath(`/personas/${personId}`);
}

export async function findDuplicates(params: { documentId?: string; phone?: string; firstName?: string; lastNamePaternal?: string }) {
  await requireSession();

  const orConditions = [];
  if (params.documentId) orConditions.push({ documentId: params.documentId });
  if (params.phone) orConditions.push({ phone: params.phone });
  if (params.firstName && params.lastNamePaternal) {
    orConditions.push({
      firstName: { equals: params.firstName, mode: "insensitive" as const },
      lastNamePaternal: { equals: params.lastNamePaternal, mode: "insensitive" as const },
    });
  }
  if (orConditions.length === 0) return [];

  return prisma.person.findMany({
    where: { OR: orConditions },
    select: { id: true, firstName: true, lastNamePaternal: true, phone: true, documentId: true },
    take: 5,
  });
}
