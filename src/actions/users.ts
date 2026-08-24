"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key)?.toString().trim();
  return v ? v : undefined;
}

export async function createUser(formData: FormData) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") throw new Error("No autorizado");

  const email = str(formData, "email")?.toLowerCase();
  const password = str(formData, "password");
  const roleKey = str(formData, "roleKey");
  if (!email || !password || !roleKey) throw new Error("Faltan campos obligatorios");

  const role = await prisma.role.findUniqueOrThrow({ where: { key: roleKey as never } });
  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: str(formData, "name") ?? email,
      roleId: role.id,
      macroCellId: str(formData, "macroCellId") || undefined,
      personId: str(formData, "personId") || undefined,
    },
  });

  await logAudit({ userId: session?.user.id, action: "CREATE", entity: "User", recordId: user.id });

  revalidatePath("/usuarios");
  redirect("/usuarios");
}

export async function toggleUserActive(userId: string, active: boolean) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") throw new Error("No autorizado");

  await prisma.user.update({ where: { id: userId }, data: { active } });
  await logAudit({ userId: session.user.id, action: active ? "ACTIVATE" : "DEACTIVATE", entity: "User", recordId: userId });
  revalidatePath("/usuarios");
}

export async function updateSystemSetting(key: string, value: unknown) {
  const session = await auth();
  if (session?.user.role !== "ADMIN") throw new Error("No autorizado");

  await prisma.systemSetting.upsert({
    where: { key },
    create: { key, value: value as never },
    update: { value: value as never },
  });
  revalidatePath("/configuracion");
}
