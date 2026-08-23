"use server";

import { prisma } from "@/lib/prisma";
import { addTimelineEvent } from "@/lib/audit";
import { requirePermission } from "@/lib/auth-guard";
import { getScope, isCellIdInScope } from "@/lib/scope";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function saveAttendance(cellId: string, dateStr: string, formData: FormData) {
  const session = await requirePermission("attendance.register");
  const cell = await prisma.cell.findUniqueOrThrow({ where: { id: cellId } });
  const scope = getScope(session);
  if (!isCellIdInScope(scope, cell.id, cell.macroCellId)) {
    throw new Error("No tienes permiso para registrar asistencia en esta célula.");
  }

  const date = new Date(dateStr);
  const personIds = formData.getAll("personId").map((v) => v.toString());

  let attendeesCount = 0;
  let guestsCount = 0;
  let newCount = 0;

  for (const personId of personIds) {
    const attended = formData.get(`attended_${personId}`) === "on";
    const isGuest = formData.get(`guest_${personId}`) === "on";
    const absenceReason = formData.get(`reason_${personId}`)?.toString() || undefined;

    await prisma.attendance.upsert({
      where: { cellId_personId_date: { cellId, personId, date } },
      create: { cellId, personId, date, attended, isGuest, absenceReason },
      update: { attended, isGuest, absenceReason },
    });

    if (attended) attendeesCount++;
    if (isGuest) guestsCount++;
  }

  const newGuestName = formData.get("newGuestName")?.toString().trim();
  if (newGuestName) {
    const [firstName, ...rest] = newGuestName.split(" ");
    const person = await prisma.person.create({
      data: {
        firstName,
        lastNamePaternal: rest.join(" ") || "—",
        currentCellId: cellId,
        howArrived: "INVITACION_MIEMBRO",
      },
    });
    await prisma.attendance.create({ data: { cellId, personId: person.id, date, attended: true, isGuest: true } });
    await prisma.firstCellVisit.create({ data: { personId: person.id, date } });
    await addTimelineEvent({ personId: person.id, type: "PRIMERA_CELULA", title: "Primera vez en célula (invitado)", icon: "Home", date });
    attendeesCount++;
    guestsCount++;
    newCount++;
  }

  const membersCount = await prisma.cellMembership.count({ where: { cellId, isCurrent: true } });
  const attendancePercent = membersCount > 0 ? Math.round((attendeesCount / membersCount) * 100) : 0;

  await prisma.attendanceReport.upsert({
    where: { cellId_date: { cellId, date } },
    create: {
      cellId,
      date,
      membersCount,
      attendeesCount,
      guestsCount,
      newCount,
      absentCount: Math.max(0, membersCount - attendeesCount),
      attendancePercent,
      notes: formData.get("notes")?.toString() || undefined,
    },
    update: {
      membersCount,
      attendeesCount,
      guestsCount,
      newCount,
      absentCount: Math.max(0, membersCount - attendeesCount),
      attendancePercent,
      notes: formData.get("notes")?.toString() || undefined,
    },
  });

  revalidatePath(`/asistencia/${cellId}`);
  revalidatePath("/asistencia");
  redirect(`/asistencia/${cellId}?saved=1`);
}
