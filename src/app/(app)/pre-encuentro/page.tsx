import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { fullName } from "@/lib/utils";
import Link from "next/link";

export default async function PreEncounterPage() {
  const people = await prisma.person.findMany({
    where: { status: "ACTIVO", preEncounterClasses: { some: {} } },
    include: { preEncounterClasses: true, currentCell: { select: { number: true } } },
    orderBy: { firstName: "asc" },
  });

  const active = people.filter((p) => p.preEncounterClasses.filter((c) => c.completed).length < 4);
  const completed = people.filter((p) => p.preEncounterClasses.filter((c) => c.completed).length === 4);

  return (
    <div>
      <PageHeader title="Pre-Encuentro" subtitle="Cuatro clases previas al Encuentro." />

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 font-display text-sm font-bold tracking-wide text-ink-500 uppercase">En proceso ({active.length})</h2>
          {active.length === 0 ? (
            <EmptyState title="Nadie en Pre-Encuentro actualmente" />
          ) : (
            <div className="space-y-2">
              {active.map((p) => {
                const done = p.preEncounterClasses.filter((c) => c.completed).length;
                return (
                  <Link key={p.id} href={`/personas/${p.id}`} className="block rounded-xl border border-ink-100 bg-white p-3 shadow-sm">
                    <div className="mb-1 flex items-center justify-between text-sm font-medium text-ink-800">
                      <span>{fullName(p)} {p.currentCell && <span className="text-xs text-ink-400">C{p.currentCell.number}</span>}</span>
                      <span>{done}/4</span>
                    </div>
                    <ProgressBar value={(done / 4) * 100} size="sm" colorClassName="bg-gold-500" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-2 font-display text-sm font-bold tracking-wide text-ink-500 uppercase">Habilitados ({completed.length})</h2>
          {completed.length === 0 ? (
            <EmptyState title="Nadie ha completado Pre-Encuentro todavía" />
          ) : (
            <div className="space-y-2">
              {completed.map((p) => (
                <Link key={p.id} href={`/personas/${p.id}`} className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50/40 p-3">
                  <span className="text-sm font-medium text-ink-800">{fullName(p)}</span>
                  <Badge variant="green">🟢 Habilitado para Encuentro</Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
