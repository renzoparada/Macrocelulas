import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { markNotificationRead, markAllNotificationsRead } from "@/actions/tasks";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

export default async function NotificationsPage() {
  const session = await auth();
  const notifications = await prisma.notification.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const markAll = markAllNotificationsRead;

  return (
    <div>
      <PageHeader
        title="Notificaciones"
        subtitle={`${notifications.filter((n) => !n.read).length} sin leer`}
        actions={
          <form action={markAll}>
            <Button type="submit" variant="outline" size="sm">
              Marcar todas como leídas
            </Button>
          </form>
        }
      />

      {notifications.length === 0 ? (
        <EmptyState title="Sin notificaciones" />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <form key={n.id} action={markNotificationRead.bind(null, n.id)}>
              <button
                type="submit"
                className={`flex w-full items-start justify-between gap-3 rounded-xl border p-3 text-left transition-colors ${
                  n.read ? "border-ink-100 bg-white" : "border-brand-200 bg-brand-50/40"
                }`}
              >
                <div>
                  <p className="text-sm font-medium text-ink-800">{n.message}</p>
                  <p className="text-xs text-ink-400">{formatDateTime(n.createdAt)}</p>
                </div>
                {!n.read && <Badge variant="brand">Nueva</Badge>}
              </button>
            </form>
          ))}
        </div>
      )}
    </div>
  );
}
