import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { fullName } from "@/lib/utils";

const PRIORITY_ORDER = ["URGENTE", "IMPORTANTE", "NORMAL"];
const PRIORITY_LABEL: Record<string, string> = { URGENTE: "🔴 URGENTE", IMPORTANTE: "🟡 IMPORTANTE", NORMAL: "⚪ NORMAL" };

export default async function MacroPrayerListPage({ searchParams }: { searchParams: Promise<{ macroCellId?: string }> }) {
  const sp = await searchParams;

  const requests = await prisma.prayerRequest.findMany({
    where: {
      status: "ACTIVO",
      isPrivate: false,
      ...(sp.macroCellId ? { person: { currentCell: { macroCellId: sp.macroCellId } } } : {}),
    },
    include: { person: { include: { currentCell: true } } },
  });

  const grouped = PRIORITY_ORDER.map((priority) => ({
    priority,
    items: requests.filter((r) => r.priority === priority),
  }));

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Lista de Oración — Macro Célula" subtitle="Priorizada para el líder de Macro Célula." />

      <div className="space-y-6 print:space-y-4">
        {grouped.map((g) => (
          <div key={g.priority}>
            <h2 className="mb-2 font-display text-sm font-bold tracking-wide text-ink-700">{PRIORITY_LABEL[g.priority]}</h2>
            {g.items.length === 0 ? (
              <p className="text-sm text-ink-400">Sin motivos.</p>
            ) : (
              <div className="space-y-2">
                {g.items.map((r) => (
                  <div key={r.id} className="rounded-xl border border-ink-100 bg-white p-3">
                    <p className="text-sm font-semibold text-ink-900">
                      {r.person.currentCell ? `C${r.person.currentCell.number} — ` : ""}
                      {fullName(r.person)}
                    </p>
                    <p className="text-sm text-ink-600">{r.motivo}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
