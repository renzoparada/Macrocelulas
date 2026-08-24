import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, PartyPopper } from "lucide-react";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    include: { _count: { select: { participants: true } }, cell: { select: { number: true } } },
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Eventos"
        subtitle="Cosechas, ayunos, evangelismo, liberación, sanidad interior..."
        actions={
          <LinkButton href="/eventos/nuevo">
            <Plus className="h-4 w-4" /> Nuevo evento
          </LinkButton>
        }
      />

      {events.length === 0 ? (
        <EmptyState title="Sin eventos registrados" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((e) => (
            <Link key={e.id} href={`/eventos/${e.id}`} className="rounded-xl border border-ink-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2 text-brand-600">
                <PartyPopper className="h-4 w-4" />
                <span className="text-xs font-semibold tracking-wide uppercase">{e.type}</span>
              </div>
              <p className="mt-1 font-display font-bold text-ink-900">{e.name}</p>
              <p className="text-xs text-ink-400">
                {formatDate(e.date)} {e.cell && `· C${e.cell.number}`}
              </p>
              <p className="mt-2 text-sm text-ink-600">{e._count.participants} participantes</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
