import { prisma } from "@/lib/prisma";
import { fullName, formatDate } from "@/lib/utils";

export default async function DailyPrayerListPage() {
  const requests = await prisma.prayerRequest.findMany({
    where: { status: "ACTIVO", isPrivate: false },
    include: { person: true },
    orderBy: [{ priority: "asc" }, { startDate: "asc" }],
  });

  return (
    <div className="mx-auto max-w-lg">
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold tracking-wide text-ink-900 uppercase">Lista de Oración</h1>
        <p className="text-sm text-ink-400">Macro Santidad · Abrir → Leer → Orar → Siguiente</p>
      </div>

      <div className="space-y-4">
        {requests.map((r) => (
          <div key={r.id} className="rounded-2xl border-2 border-brand-100 bg-white p-5 text-center shadow-sm">
            <p className="font-display text-lg font-bold tracking-wide text-ink-900 uppercase">{fullName(r.person)}</p>
            <p className="mt-2 text-ink-700">{r.motivo}</p>
            <p className="mt-2 text-xs text-ink-400">Desde: {formatDate(r.startDate)}</p>
          </div>
        ))}
        {requests.length === 0 && <p className="text-center text-ink-400">No hay motivos activos por ahora. 🙏</p>}
      </div>
    </div>
  );
}
