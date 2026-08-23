import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";

export default async function ProcesoPage() {
  const stages = await prisma.processStage.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { people: true } } },
  });

  const max = Math.max(1, ...stages.map((s) => s._count.people));

  return (
    <div>
      <PageHeader title="Embudo / Proceso" subtitle="Cuántas personas hay en cada etapa del camino GANAR → ENVIAR." />

      <div className="space-y-2">
        {stages.map((s) => {
          const width = Math.max(6, Math.round((s._count.people / max) * 100));
          return (
            <Link
              key={s.id}
              href={`/personas?etapa=${s.key}`}
              className="block rounded-xl border border-ink-100 bg-white p-3 transition-shadow hover:shadow-md"
            >
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-semibold text-ink-800">
                  {s.order}. {s.name}
                </span>
                <span className="font-display font-bold text-brand-700">{s._count.people}</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-ink-100">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-gold-400" style={{ width: `${width}%` }} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
