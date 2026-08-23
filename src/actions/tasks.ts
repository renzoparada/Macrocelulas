"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function str(fd: FormData, key: string): string | undefined {
  const v = fd.get(key)?.toString().trim();
  return v ? v : undefined;
}

export async function createTask(personId: string, formData: FormData) {
  const session = await auth();

  await prisma.task.create({
    data: {
      personId,
      type: (str(formData, "type") as never) ?? "SEGUIMIENTO",
      dueDate: str(formData, "dueDate") ? new Date(str(formData, "dueDate")!) : undefined,
      notes: str(formData, "notes"),
      createdById: session?.user.id,
      assignedToId: session?.user.id,
    },
  });

  revalidatePath(`/personas/${personId}`);
}

export async function updateTaskStatus(taskId: string, personId: string, status: string) {
  await prisma.task.update({
    where: { id: taskId },
    data: { status: status as never, completedAt: status === "COMPLETADA" ? new Date() : null },
  });
  revalidatePath(`/personas/${personId}`);
}

export async function markNotificationRead(notificationId: string) {
  await prisma.notification.update({ where: { id: notificationId }, data: { read: true } });
  revalidatePath("/notificaciones");
}

export async function markAllNotificationsRead(userId: string) {
  await prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
  revalidatePath("/notificaciones");
}
