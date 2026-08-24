import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function InformesPage() {
  const reports = await prisma.attendanceReport.findMany({
    include: { cell: { select: { id: true, number: true, name: true, leader: { select: { name: true } } } } },
    orderBy: { date: "desc" },
    take: 100,
  });

  return (
    <div>
      <PageHeader title="Informes de Célula" subtitle="Historial de informes semanales enviados por cada célula." />

      {reports.length === 0 ? (
        <EmptyState title="Sin informes registrados" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white shadow-sm">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-ink-50 text-left text-xs tracking-wide text-ink-500 uppercase">
              <tr>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Célula</th>
                <th className="px-4 py-2">Líder</th>
                <th className="px-4 py-2">Miembros</th>
                <th className="px-4 py-2">Asistentes</th>
                <th className="px-4 py-2">Nuevos</th>
                <th className="px-4 py-2">Invitados</th>
                <th className="px-4 py-2">% Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-t border-ink-100 hover:bg-ink-50/50">
                  <td className="px-4 py-2">{formatDate(r.date)}</td>
                  <td className="px-4 py-2">
                    <Link href={`/celulas/${r.cell.id}`} className="font-medium text-brand-700 hover:underline">
                      C{r.cell.number} — {r.cell.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{r.cell.leader?.name ?? "—"}</td>
                  <td className="px-4 py-2">{r.membersCount}</td>
                  <td className="px-4 py-2">{r.attendeesCount}</td>
                  <td className="px-4 py-2">{r.newCount}</td>
                  <td className="px-4 py-2">{r.guestsCount}</td>
                  <td className="px-4 py-2 font-semibold text-brand-700">{r.attendancePercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
