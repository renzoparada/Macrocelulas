import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getScope, cellScopeWhere } from "@/lib/scope";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";

export default async function AsistenciaPage() {
  const session = await auth();
  if (!session) redirect("/login");
  const scope = getScope(session);

  const cells = await prisma.cell.findMany({
    where: { status: { not: "INACTIVA" }, ...cellScopeWhere(scope) },
    include: { macroCell: { select: { name: true } }, leader: { select: { name: true } }, _count: { select: { memberships: { where: { isCurrent: true } } } } },
    orderBy: { number: "asc" },
  });

  return (
    <div>
      <PageHeader title="Asistencia" subtitle="Selecciona una célula para registrar la asistencia semanal." />

      {cells.length === 0 ? (
        <EmptyState title="Sin células registradas" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {cells.map((c) => (
            <Link
              key={c.id}
              href={`/asistencia/${c.id}`}
              className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-semibold text-ink-900">C{c.number} — {c.name}</p>
                <p className="truncate text-xs text-ink-500">{c.leader?.name ?? "Sin líder"} · {c._count.memberships} miembros</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
