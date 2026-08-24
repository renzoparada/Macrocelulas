import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { fullName } from "@/lib/utils";
import Link from "next/link";
import { Home } from "lucide-react";

const RELATION_LABELS: Record<string, string> = {
  CONYUGE: "Cónyuge",
  HIJO: "Hijo/a",
  PADRE: "Padre",
  MADRE: "Madre",
  HERMANO: "Hermano/a",
  OTRO: "Otro",
};

export default async function FamiliasPage() {
  const families = await prisma.family.findMany({
    include: {
      relationships: {
        include: { person: { select: { id: true, firstName: true, lastNamePaternal: true, lastNameMaternal: true, photoUrl: true } } },
      },
    },
    orderBy: { name: "asc" },
  });

  const uniqueFamilies = families.filter((f) => f.relationships.length > 0);

  return (
    <div>
      <PageHeader
        title="Familias"
        subtitle="Registra relaciones familiares desde la pestaña Familia en el Cardex de cada persona."
      />

      {uniqueFamilies.length === 0 ? (
        <EmptyState title="Sin familias registradas" description="Agrega familiares desde el Cardex de cada persona." />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {uniqueFamilies.map((f) => {
            const seen = new Set<string>();
            const members = f.relationships.filter((r) => (seen.has(r.person.id) ? false : (seen.add(r.person.id), true)));
            return (
              <div key={f.id} className="rounded-2xl border border-ink-100 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                  <Home className="h-4 w-4 text-brand-600" />
                  <h3 className="font-display font-semibold text-ink-900">{f.name}</h3>
                </div>
                <ul className="space-y-1">
                  {members.map((r) => (
                    <li key={r.id} className="flex items-center justify-between text-sm">
                      <Link href={`/personas/${r.person.id}`} className="font-medium text-ink-800 hover:text-brand-700">
                        {fullName(r.person)}
                      </Link>
                      <span className="text-xs text-ink-400">{RELATION_LABELS[r.relationType]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
