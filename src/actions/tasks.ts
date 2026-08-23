"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key)?.toString().trim();
  return v ? v : undefined;
}

export async function createTask(personId: string, formData: FormData) {
  const session = await requireSession();

  await prisma.task.create({
    data: {
      personId,
      type: (str(formData, "type") as never) ?? "SEGUIMIENTO",
      dueDate: str(formData, "dueDate") ? new Date(str(formData, "dueDate")!) : undefined,
      notes: str(formData, "notes"),
      createdById: session.user.id,
      assignedToId: session.user.id,
    },
  });

  revalidatePath(`/personas/${personId}`);
}

export async function updateTaskStatus(taskId: string, personId: string, status: string) {
  await requireSession();
  await prisma.task.update({
    where: { id: taskId },
    data: { status: status as never, completedAt: status === "COMPLETADA" ? new Date() : null },
  });
  revalidatePath(`/personas/${personId}`);
}

export async function markNotificationRead(notificationId: string) {
  const session = await requireSession();
  await prisma.notification.updateMany({ where: { id: notificationId, userId: session.user.id }, data: { read: true } });
  revalidatePath("/notificaciones");
}

export async function markAllNotificationsRead() {
  const session = await requireSession();
  await prisma.notification.updateMany({ where: { userId: session.user.id, read: false }, data: { read: true } });
  revalidatePath("/notificaciones");
}
