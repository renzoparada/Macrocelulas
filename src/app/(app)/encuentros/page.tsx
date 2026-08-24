import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, Sparkles } from "lucide-react";

export default async function EncountersPage() {
  const encounters = await prisma.encounter.findMany({
    include: { _count: { select: { registrations: true } } },
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Encuentros"
        subtitle="Encuentro, Re-Encuentro, Encuentro de Rescate, Retiros de Liderazgo..."
        actions={
          <LinkButton href="/encuentros/nuevo">
            <Plus className="h-4 w-4" /> Nuevo
          </LinkButton>
        }
      />

      {encounters.length === 0 ? (
        <EmptyState title="Sin encuentros registrados" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {encounters.map((e) => (
            <Link key={e.id} href={`/encuentros/${e.id}`} className="rounded-xl border border-ink-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-2 text-brand-600">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold tracking-wide uppercase">{e.type.replaceAll("_", " ")}</span>
              </div>
              <p className="mt-1 font-display font-bold text-ink-900">{e.name}</p>
              <p className="text-xs text-ink-400">{formatDate(e.date)} · {e.place}</p>
              <p className="mt-2 text-sm text-ink-600">{e._count.registrations} inscritos</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
