import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, Presentation } from "lucide-react";

export default async function CongressesPage() {
  const congresses = await prisma.congress.findMany({
    include: { _count: { select: { participants: true } } },
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Congresos"
        actions={
          <LinkButton href="/congresos/nuevo">
            <Plus className="h-4 w-4" /> Nuevo congreso
          </LinkButton>
        }
      />

      {congresses.length === 0 ? (
        <EmptyState title="Sin congresos registrados" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {congresses.map((c) => (
            <Link key={c.id} href={`/congresos/${c.id}`} className="rounded-xl border border-ink-100 bg-white p-4 shadow-sm">
              <Presentation className="h-4 w-4 text-brand-600" />
              <p className="mt-1 font-display font-bold text-ink-900">{c.name}</p>
              <p className="text-xs text-ink-400">{formatDate(c.date)} · {c.place}</p>
              <p className="mt-2 text-sm text-ink-600">{c._count.participants} participantes</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
