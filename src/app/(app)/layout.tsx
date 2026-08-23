import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const notificationCount = await prisma.notification.count({
    where: { userId: session.user.id, read: false },
  });

  return (
    <AppShell
      userName={session.user.name}
      roleLabel={session.user.roleLabel}
      notificationCount={notificationCount}
    >
      {children}
    </AppShell>
  );
}
