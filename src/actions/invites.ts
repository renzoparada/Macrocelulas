"use server";

import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { auth, signIn } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { RoleKey } from "@/generated/prisma/client";

const INVITE_VALID_DAYS = 7;

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key)?.toString().trim();
  return v ? v : undefined;
}

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") throw new Error("No autorizado");
  return session;
}

export async function createInvite(formData: FormData) {
  const session = await requireAdmin();

  const roleKey = str(formData, "roleKey") as RoleKey | undefined;
  if (!roleKey) throw new Error("Selecciona un rol");

  const cellId = roleKey === "LIDER_CELULA" || roleKey === "CO_LIDER" ? str(formData, "cellId") : undefined;
  const macroCellId = roleKey === "LIDER_MACRO" ? str(formData, "macroCellId") : undefined;

  const token = crypto.randomBytes(24).toString("base64url");
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + INVITE_VALID_DAYS);

  await prisma.accountInvite.create({
    data: {
      token,
      roleKey,
      cellId,
      macroCellId,
      expiresAt,
      createdById: session.user.id,
    },
  });

  await logAudit({ userId: session.user.id, action: "CREATE", entity: "AccountInvite", recordId: token });

  revalidatePath("/usuarios/invitaciones");
  redirect("/usuarios/invitaciones");
}

export async function revokeInvite(id: string) {
  await requireAdmin();
  await prisma.accountInvite.update({ where: { id }, data: { status: "REVOCADA" } });
  revalidatePath("/usuarios/invitaciones");
}

export async function registerWithInvite(
  token: string,
  _prevState: { error?: string } | null,
  formData: FormData
): Promise<{ error?: string } | null> {
  const invite = await prisma.accountInvite.findUnique({ where: { token } });
  if (!invite) return { error: "Este link de invitación no es válido." };

  if (invite.status === "PENDIENTE" && invite.expiresAt < new Date()) {
    await prisma.accountInvite.update({ where: { id: invite.id }, data: { status: "EXPIRADA" } });
    return { error: "Este link de invitación expiró. Pide uno nuevo a quien te invitó." };
  }
  if (invite.status !== "PENDIENTE") {
    return { error: "Este link de invitación ya no está disponible (ya fue usado, expiró o fue revocado)." };
  }

  const name = str(formData, "name");
  const email = str(formData, "email")?.toLowerCase();
  const password = str(formData, "password");
  if (!name || !email || !password) return { error: "Completa todos los campos." };
  if (password.length < 8) return { error: "La contraseña debe tener al menos 8 caracteres." };

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return { error: "Ya existe una cuenta con ese correo. Intenta iniciar sesión." };

  const role = await prisma.role.findUnique({ where: { key: invite.roleKey } });
  if (!role) return { error: "El rol de esta invitación ya no existe. Avisa a quien te invitó." };

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      roleId: role.id,
      macroCellId: invite.macroCellId ?? undefined,
    },
  });

  if (invite.cellId && invite.roleKey === "LIDER_CELULA") {
    await prisma.cell.update({ where: { id: invite.cellId }, data: { leaderId: user.id } });
  } else if (invite.cellId && invite.roleKey === "CO_LIDER") {
    await prisma.cell.update({ where: { id: invite.cellId }, data: { coLeaderId: user.id } });
  }

  await prisma.accountInvite.update({
    where: { id: invite.id },
    data: { status: "USADA", usedAt: new Date(), usedByUserId: user.id },
  });

  await logAudit({ userId: user.id, action: "CREATE", entity: "User", recordId: user.id });

  await signIn("credentials", { email, password, redirectTo: "/" });
  return null;
}
