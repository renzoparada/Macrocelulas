import { prisma } from "@/lib/prisma";
import { getCellHealth, HEALTH_COLORS, HEALTH_LABELS } from "@/lib/business";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users } from "lucide-react";
import Link from "next/link";

export default async function CelulasPage({ searchParams }: { searchParams: Promise<{ alerta?: string }> }) {
  const params = await searchParams;

  const macroCells = await prisma.macroCell.findMany({
    include: {
      leader: { select: { name: true } },
      cells: {
        include: { leader: { select: { name: true } }, _count: { select: { memberships: { where: { isCurrent: true } } } } },
        orderBy: { number: "asc" },
      },
    },
    orderBy: { name: "asc" },
  });

  const cellsWithHealth = await Promise.all(
    macroCells.map(async (mc) => ({
      ...mc,
      cells: await Promise.all(
        mc.cells.map(async (c) => ({ ...c, health: await getCellHealth(c.id) }))
      ),
    }))
  );

  return (
    <div>
      <PageHeader
        title="Células"
        subtitle="Estructura organizacional: Macro Célula → Célula → Líder → Discípulos"
        actions={
          <>
            <LinkButton href="/celulas/macro-nueva" variant="outline">
              <Plus className="h-4 w-4" /> Macro Célula
            </LinkButton>
            <LinkButton href="/celulas/nueva">
              <Plus className="h-4 w-4" /> Nueva Célula
            </LinkButton>
          </>
        }
      />

      {cellsWithHealth.length === 0 ? (
        <EmptyState title="Sin macro células" description="Crea la primera Macro Célula para comenzar." />
      ) : (
        <div className="space-y-6">
          {cellsWithHealth.map((mc) => (
            <div key={mc.id} className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-lg font-bold text-ink-900">{mc.name}</h2>
                  <p className="text-xs text-ink-400">Líder: {mc.leader?.name ?? "Sin asignar"} · {mc.cells.length} células</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {mc.cells
                  .filter((c) => !params.alerta || c.health.level === "ROJO")
                  .map((c) => (
                    <Link
                      key={c.id}
                      href={`/celulas/${c.id}`}
                      className="rounded-xl border border-ink-100 p-3 transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-ink-800">
                          C{c.number} — {c.name}
                        </span>
                        <span className={`h-2.5 w-2.5 rounded-full ${HEALTH_COLORS[c.health.level]}`} title={HEALTH_LABELS[c.health.level]} />
                      </div>
                      <p className="mt-1 flex items-center gap-1 text-xs text-ink-500">
                        <Users className="h-3 w-3" /> {c._count.memberships} miembros · {c.leader?.name ?? "Sin líder"}
                      </p>
                      <Badge variant={c.status === "ACTIVA" ? "green" : c.status === "EN_ALERTA" ? "red" : "default"} className="mt-2">
                        {c.status.replaceAll("_", " ")}
                      </Badge>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
