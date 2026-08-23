import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/form";
import { PRAYER_CATEGORIES } from "@/lib/constants";
import { fullName, formatDate, daysBetween } from "@/lib/utils";
import Link from "next/link";
import { Plus, ListChecks, GitBranch } from "lucide-react";
import type { Prisma } from "@/generated/prisma/client";

const PRIORITY_ICON: Record<string, string> = { URGENTE: "🔴", IMPORTANTE: "🟡", NORMAL: "⚪" };

export default async function OracionPage({
  searchParams,
}: {
  searchParams: Promise<{ celula?: string; categoria?: string; prioridad?: string; estado?: string; antiguedad?: string }>;
}) {
  const sp = await searchParams;

  const where: Prisma.PrayerRequestWhereInput = {};
  if (sp.categoria) where.category = sp.categoria;
  if (sp.prioridad) where.priority = sp.prioridad as never;
  where.status = (sp.estado as never) ?? "ACTIVO";
  if (sp.celula) where.person = { currentCellId: sp.celula };

  if (sp.antiguedad === "90") {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 90);
    where.startDate = { lte: cutoff };
  }

  const [requests, cells] = await Promise.all([
    prisma.prayerRequest.findMany({
      where,
      include: { person: { select: { id: true, firstName: true, lastNamePaternal: true, currentCell: { select: { number: true } } } } },
      orderBy: [{ priority: "asc" }, { startDate: "asc" }],
      take: 100,
    }),
    prisma.cell.findMany({ select: { id: true, number: true, name: true }, orderBy: { number: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="🙏 Motivos de Oración"
        subtitle="El corazón de acompañamiento del sistema."
        actions={
          <>
            <LinkButton href="/oracion/lista-diaria" variant="outline">
              <ListChecks className="h-4 w-4" /> Lista diaria
            </LinkButton>
            <LinkButton href="/oracion/macro" variant="outline">
              <GitBranch className="h-4 w-4" /> Lista Macro
            </LinkButton>
            <LinkButton href="/oracion/nuevo">
              <Plus className="h-4 w-4" /> Nuevo motivo
            </LinkButton>
          </>
        }
      />

      <form className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-5">
        <Select name="estado" defaultValue={sp.estado ?? "ACTIVO"}>
          <option value="ACTIVO">🟢 Activos</option>
          <option value="RESUELTO">⚪ Resueltos</option>
          <option value="DESACTIVADO">⚫ Desactivados</option>
        </Select>
        <Select name="celula" defaultValue={sp.celula ?? ""}>
          <option value="">Todas las células</option>
          {cells.map((c) => (
            <option key={c.id} value={c.id}>
              C{c.number} — {c.name}
            </option>
          ))}
        </Select>
        <Select name="categoria" defaultValue={sp.categoria ?? ""}>
          <option value="">Todas las categorías</option>
          {PRAYER_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
        <Select name="prioridad" defaultValue={sp.prioridad ?? ""}>
          <option value="">Toda prioridad</option>
          <option value="URGENTE">🔴 Urgente</option>
          <option value="IMPORTANTE">🟡 Importante</option>
          <option value="NORMAL">⚪ Normal</option>
        </Select>
        <Select name="antiguedad" defaultValue={sp.antiguedad ?? ""}>
          <option value="">Cualquier antigüedad</option>
          <option value="90">Más de 90 días</option>
        </Select>
      </form>

      {requests.length === 0 ? (
        <EmptyState title="Sin motivos de oración" />
      ) : (
        <div className="space-y-2">
          {requests.map((r) => (
            <Link
              key={r.id}
              href={`/oracion/${r.id}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-ink-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink-900">
                  {PRIORITY_ICON[r.priority]} {fullName(r.person)}
                  {r.person.currentCell && <span className="ml-1 text-xs text-ink-400">(C{r.person.currentCell.number})</span>}
                </p>
                <p className="truncate text-sm text-ink-600">{r.motivo}</p>
                <p className="text-xs text-ink-400">
                  {r.category} · Desde {formatDate(r.startDate)} ({daysBetween(r.startDate)} días)
                </p>
              </div>
              {r.isPrivate && <Badge variant="dark">Privado</Badge>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
