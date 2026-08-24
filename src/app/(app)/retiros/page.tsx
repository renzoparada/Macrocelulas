import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, Tent } from "lucide-react";

export default async function RetreatsPage() {
  const retreats = await prisma.retreat.findMany({
    include: { retreatType: true, _count: { select: { participants: true } } },
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Retiros"
        subtitle="Encuentro, Re-Encuentro, Retiro de Liderazgo, Retiro Familiar..."
        actions={
          <LinkButton href="/retiros/nuevo">
            <Plus className="h-4 w-4" /> Nuevo retiro
          </LinkButton>
        }
      />

      {retreats.length === 0 ? (
        <EmptyState title="Sin retiros registrados" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {retreats.map((r) => (
            <Link key={r.id} href={`/retiros/${r.id}`} className="rounded-xl border border-ink-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-brand-600">
                <Tent className="h-4 w-4" />
                <span className="text-xs font-semibold tracking-wide uppercase">{r.retreatType.name}</span>
              </div>
              <p className="mt-1 font-display font-bold text-ink-900">{r.name}</p>
              <p className="text-xs text-ink-400">{formatDate(r.date)} · {r.place}</p>
              <p className="mt-2 text-sm text-ink-600">{r._count.participants} participantes</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
