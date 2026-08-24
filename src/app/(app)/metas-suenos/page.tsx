import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { fullName } from "@/lib/utils";
import Link from "next/link";

const HORIZON_LABELS: Record<string, string> = {
  CORTO_PLAZO: "Corto plazo",
  MEDIANO_PLAZO: "Mediano plazo",
  LARGO_PLAZO: "Largo plazo",
};

export default async function GoalsAndDreamsPage() {
  const [goals, dreams] = await Promise.all([
    prisma.personalGoal.findMany({ include: { person: true }, orderBy: { date: "desc" }, take: 60 }),
    prisma.dream.findMany({ include: { person: true }, orderBy: { date: "desc" }, take: 60 }),
  ]);

  return (
    <div>
      <PageHeader title="Metas y Sueños" subtitle="Lo que cada persona quiere alcanzar y lo que sueña." />

      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <h2 className="mb-2 font-display text-sm font-bold tracking-wide text-ink-500 uppercase">Metas</h2>
          {goals.length === 0 ? (
            <EmptyState title="Sin metas registradas" />
          ) : (
            <div className="space-y-2">
              {goals.map((g) => (
                <Link key={g.id} href={`/personas/${g.person.id}`} className="block rounded-xl border border-ink-100 bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink-800">{g.goal}</span>
                    <Badge variant="brand">{g.category}</Badge>
                  </div>
                  <p className="mb-1 text-xs text-ink-400">{fullName(g.person)}</p>
                  <ProgressBar value={g.progress} size="sm" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-2 font-display text-sm font-bold tracking-wide text-ink-500 uppercase">Sueños</h2>
          {dreams.length === 0 ? (
            <EmptyState title="Sin sueños registrados" />
          ) : (
            <div className="space-y-2">
              {dreams.map((d) => (
                <Link key={d.id} href={`/personas/${d.person.id}`} className="block rounded-xl border border-ink-100 bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-ink-800">⭐ {d.dream}</span>
                    <Badge variant="gold">{HORIZON_LABELS[d.horizon]}</Badge>
                  </div>
                  <p className="text-xs text-ink-400">{fullName(d.person)}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
