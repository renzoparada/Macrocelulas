"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key)?.toString().trim();
  return v ? v : undefined;
}

export async function createRetreat(formData: FormData) {
  let retreatType = await prisma.retreatType.findUnique({ where: { name: str(formData, "retreatTypeName") ?? "Otro" } });
  if (!retreatType) {
    retreatType = await prisma.retreatType.create({ data: { name: str(formData, "retreatTypeName") ?? "Otro" } });
  }

  const retreat = await prisma.retreat.create({
    data: {
      retreatTypeId: retreatType.id,
      name: str(formData, "name") ?? "",
      date: new Date(str(formData, "date") ?? new Date().toISOString()),
      place: str(formData, "place"),
    },
  });

  revalidatePath("/retiros");
  redirect(`/retiros/${retreat.id}`);
}

export async function addRetreatParticipant(retreatId: string, formData: FormData) {
  const personId = str(formData, "personId");
  if (!personId) return;
  await prisma.retreatParticipant.upsert({
    where: { retreatId_personId: { retreatId, personId } },
    create: { retreatId, personId, notes: str(formData, "notes") },
    update: { notes: str(formData, "notes") },
  });
  revalidatePath(`/retiros/${retreatId}`);
}

export async function createCongress(formData: FormData) {
  const congress = await prisma.congress.create({
    data: {
      name: str(formData, "name") ?? "",
      date: new Date(str(formData, "date") ?? new Date().toISOString()),
      place: str(formData, "place"),
    },
  });

  revalidatePath("/congresos");
  redirect(`/congresos/${congress.id}`);
}

export async function addCongressParticipant(congressId: string, formData: FormData) {
  const personId = str(formData, "personId");
  if (!personId) return;
  await prisma.congressParticipant.upsert({
    where: { congressId_personId: { congressId, personId } },
    create: {
      congressId,
      personId,
      inscription: true,
      participationType: str(formData, "participationType"),
    },
    update: {},
  });
  revalidatePath(`/congresos/${congressId}`);
}
