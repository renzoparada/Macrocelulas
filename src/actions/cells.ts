"use server";

import { prisma } from "@/lib/prisma";
import { requirePermission, requireSession } from "@/lib/auth-guard";
import { roleHasPermission } from "@/lib/permissions";
import { getScope, isCellIdInScope } from "@/lib/scope";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key)?.toString().trim();
  return v ? v : undefined;
}

export async function createMacroCell(formData: FormData) {
  const session = await requirePermission("macrocells.manage");
  const macroCell = await prisma.macroCell.create({
    data: {
      name: str(formData, "name") ?? "",
      description: str(formData, "description"),
      leaderId: str(formData, "leaderId") || undefined,
    },
  });

  await logAudit({ userId: session.user.id, action: "CREATE", entity: "MacroCell", recordId: macroCell.id });
  revalidatePath("/celulas");
  redirect("/celulas");
}

export async function createCell(formData: FormData) {
  const session = await requirePermission("cells.manage");
  const cell = await prisma.cell.create({
    data: {
      number: str(formData, "number") ?? "",
      name: str(formData, "name") ?? "",
      macroCellId: str(formData, "macroCellId") ?? "",
      leaderId: str(formData, "leaderId") || undefined,
      coLeaderId: str(formData, "coLeaderId") || undefined,
      foundedAt: str(formData, "foundedAt") ? new Date(str(formData, "foundedAt")!) : new Date(),
      meetingDay: str(formData, "meetingDay"),
      meetingTime: str(formData, "meetingTime"),
      address: str(formData, "address"),
      location: str(formData, "location"),
      parentCellId: str(formData, "parentCellId") || undefined,
    },
  });

  await logAudit({ userId: session.user.id, action: "CREATE", entity: "Cell", recordId: cell.id });
  revalidatePath("/celulas");
  redirect(`/celulas/${cell.id}`);
}

export async function updateCell(cellId: string, formData: FormData) {
  // Editar los datos de una célula no exige el permiso global "cells.manage"
  // (eso queda para crear/borrar células) — alcanza con que la célula esté
  // dentro del alcance del líder: la suya (o co-liderada), o cualquiera de
  // su macro célula si es Líder de Macro Célula. El Admin, con scope "all",
  // siempre pasa este chequeo.
  const session = await requireSession();

  const existing = await prisma.cell.findUniqueOrThrow({ where: { id: cellId } });
  const scope = getScope(session);
  const isLeaderRole =
    session.user.role === "LIDER_MACRO" || session.user.role === "LIDER_CELULA" || session.user.role === "CO_LIDER";
  const authorized =
    roleHasPermission(session.user.role, "cells.manage") ||
    (isLeaderRole && isCellIdInScope(scope, existing.id, existing.macroCellId));
  if (!authorized) {
    throw new Error("No tienes permiso para editar esta célula.");
  }

  await prisma.cell.update({
    where: { id: cellId },
    data: {
      name: str(formData, "name") ?? "",
      leaderId: str(formData, "leaderId") || undefined,
      coLeaderId: str(formData, "coLeaderId") || undefined,
      meetingDay: str(formData, "meetingDay"),
      meetingTime: str(formData, "meetingTime"),
      address: str(formData, "address"),
      status: str(formData, "status") as never,
    },
  });

  revalidatePath(`/celulas/${cellId}`);
  redirect(`/celulas/${cellId}`);
}
