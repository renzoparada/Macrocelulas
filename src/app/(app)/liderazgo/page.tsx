import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { fullName } from "@/lib/utils";
import Link from "next/link";

export default async function LiderazgoPage() {
  const people = await prisma.person.findMany({
    where: { currentStage: { key: { in: ["LIDER_EN_FORMACION", "CO_LIDER", "LIDER", "MULTIPLICACION", "ENVIO"] } } },
    include: {
      currentStage: true,
      currentCell: { select: { number: true, name: true } },
      multiplicationsAsLeader: { select: { id: true } },
      discipleshipAsMentor: { select: { id: true } },
    },
    orderBy: { firstName: "asc" },
  });

  return (
    <div>
      <PageHeader title="Liderazgo" subtitle="Personas en camino de liderazgo, formando discípulos y multiplicando." />

      {people.length === 0 ? (
        <EmptyState title="Sin líderes en formación registrados" />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((p) => (
            <Link key={p.id} href={`/personas/${p.id}`} className="rounded-xl border border-ink-100 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink-900">{fullName(p)}</span>
                <Badge variant="brand">{p.currentStage?.name}</Badge>
              </div>
              <p className="mt-1 text-xs text-ink-500">
                {p.currentCell ? `C${p.currentCell.number} — ${p.currentCell.name}` : "Sin célula"}
              </p>
              <p className="mt-2 text-xs text-ink-400">
                {p.discipleshipAsMentor.length} sesiones de discipulado dadas · {p.multiplicationsAsLeader.length} discípulos formando
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
