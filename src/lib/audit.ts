import { prisma } from "@/lib/prisma";

export async function logAudit(params: {
  userId?: string | null;
  action: string;
  entity: string;
  recordId?: string;
  oldValue?: unknown;
  newValue?: unknown;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId ?? null,
        action: params.action,
        entity: params.entity,
        recordId: params.recordId,
        oldValue: params.oldValue as never,
        newValue: params.newValue as never,
      },
    });
  } catch {
    // Auditoría nunca debe romper la operación principal.
  }
}

export async function addTimelineEvent(params: {
  personId: string;
  type: string;
  title: string;
  description?: string;
  icon?: string;
  isPrivate?: boolean;
  relatedId?: string;
  date?: Date;
}) {
  await prisma.personTimeline.create({
    data: {
      personId: params.personId,
      type: params.type,
      title: params.title,
      description: params.description,
      icon: params.icon,
      isPrivate: params.isPrivate ?? false,
      relatedId: params.relatedId,
      date: params.date ?? new Date(),
    },
  });
}
