import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { formatDateTime } from "@/lib/utils";

export default async function AuditPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/");

  const logs = await prisma.auditLog.findMany({
    include: { user: { select: { name: true } } },
    orderBy: { date: "desc" },
    take: 200,
  });

  return (
    <div>
      <PageHeader title="Auditoría" subtitle="Registro de todas las acciones realizadas en el sistema." />

      {logs.length === 0 ? (
        <EmptyState title="Sin registros de auditoría" />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white shadow-sm">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-ink-50 text-left text-xs tracking-wide text-ink-500 uppercase">
              <tr>
                <th className="px-4 py-2">Fecha</th>
                <th className="px-4 py-2">Usuario</th>
                <th className="px-4 py-2">Acción</th>
                <th className="px-4 py-2">Entidad</th>
                <th className="px-4 py-2">Registro</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-t border-ink-100">
                  <td className="px-4 py-2 text-ink-500">{formatDateTime(l.date)}</td>
                  <td className="px-4 py-2">{l.user?.name ?? "Sistema"}</td>
                  <td className="px-4 py-2 font-medium text-brand-700">{l.action}</td>
                  <td className="px-4 py-2">{l.entity}</td>
                  <td className="px-4 py-2 text-xs text-ink-400">{l.recordId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
