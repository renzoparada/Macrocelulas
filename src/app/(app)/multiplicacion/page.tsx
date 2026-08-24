import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { fullName } from "@/lib/utils";
import Link from "next/link";
import { Plus, GitBranch } from "lucide-react";

export default async function MultiplicacionPage() {
  const macroCells = await prisma.macroCell.findMany({
    include: {
      cells: {
        include: { people: { select: { id: true, firstName: true, lastNamePaternal: true, lastNameMaternal: true } } },
        orderBy: { number: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Multiplicación"
        subtitle="Líder → Discípulos → Líderes en formación → Nuevos líderes → Nuevas células"
        actions={
          <>
            <LinkButton href="/multiplicacion/nueva-celula" variant="outline">
              <Plus className="h-4 w-4" /> Nueva célula
            </LinkButton>
            <LinkButton href="/multiplicacion/nuevo">
              <GitBranch className="h-4 w-4" /> Registrar paso
            </LinkButton>
          </>
        }
      />

      <div className="space-y-3">
        {macroCells.map((mc) => (
          <details key={mc.id} className="rounded-xl border border-ink-100 bg-white p-4 shadow-sm" open>
            <summary className="cursor-pointer font-display font-bold text-ink-900">{mc.name}</summary>
            <div className="mt-3 space-y-2 pl-4">
              {mc.cells.map((c) => (
                <details key={c.id} className="rounded-lg border border-ink-100 p-3">
                  <summary className="cursor-pointer text-sm font-semibold text-brand-700">
                    C{c.number} — {c.name} ({c.people.length})
                  </summary>
                  {c.people.length === 0 ? (
                    <EmptyState title="Sin miembros" />
                  ) : (
                    <ul className="mt-2 space-y-1 pl-4">
                      {c.people.map((p) => (
                        <li key={p.id}>
                          <Link href={`/personas/${p.id}`} className="text-sm text-ink-700 hover:text-brand-700">
                            {fullName(p)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </details>
              ))}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
