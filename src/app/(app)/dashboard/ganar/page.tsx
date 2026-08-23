import { getGanarDashboard } from "@/lib/dashboard";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fullName } from "@/lib/utils";
import { Users, UserPlus, Sparkles, DoorOpen } from "lucide-react";
import Link from "next/link";

export default async function GanarDashboardPage() {
  const d = await getGanarDashboard();

  return (
    <div>
      <PageHeader title="Dashboard · Ganar" subtitle="Captar y recibir nuevas personas — este mes." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Invitados" value={d.invitados} icon={UserPlus} accent="brand" />
        <StatCard label="Nuevos" value={d.nuevos} icon={Users} accent="gold" />
        <StatCard label="Aceptaron a Jesús" value={d.aceptaronJesus} icon={Sparkles} accent="brand" />
        <StatCard label="Primeras asistencias" value={d.primerasAsistencias} icon={DoorOpen} accent="ink" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quién invitó a más personas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {d.topInviters.length === 0 && <p className="text-sm text-ink-400">Sin datos todavía.</p>}
            {d.topInviters.map((t, i) =>
              t.person ? (
                <Link
                  key={t.person.id}
                  href={`/personas/${t.person.id}`}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-ink-50"
                >
                  <span className="text-sm font-medium text-ink-800">
                    {i + 1}. {fullName(t.person)}
                  </span>
                  <span className="font-display text-sm font-bold text-brand-600">{t.count}</span>
                </Link>
              ) : null
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Nuevos por célula</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {d.newByCell.length === 0 && <p className="text-sm text-ink-400">Sin datos todavía.</p>}
            {d.newByCell.map((c) =>
              c.cell ? (
                <Link
                  key={c.cell.id}
                  href={`/celulas/${c.cell.id}`}
                  className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-ink-50"
                >
                  <span className="text-sm font-medium text-ink-800">
                    C{c.cell.number} — {c.cell.name}
                  </span>
                  <span className="font-display text-sm font-bold text-brand-600">{c.count}</span>
                </Link>
              ) : null
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
