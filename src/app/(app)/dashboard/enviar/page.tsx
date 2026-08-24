import { getEnviarDashboard } from "@/lib/dashboard";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { fullName } from "@/lib/utils";
import { Crown, Users, GitBranch, CircleDot, Send } from "lucide-react";
import Link from "next/link";

export default async function EnviarDashboardPage() {
  const d = await getEnviarDashboard();

  return (
    <div>
      <PageHeader title="Dashboard · Enviar" subtitle="Convertir personas desarrolladas en personas que sirven, lideran y multiplican." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Líderes en formación" value={d.lideresEnFormacion} icon={Users} accent="gold" />
        <StatCard label="Co-líderes" value={d.coLideres} icon={Crown} accent="ink" />
        <StatCard label="Líderes" value={d.lideres} icon={Crown} accent="brand" />
        <StatCard label="Nuevas células" value={d.nuevasCelulas} icon={CircleDot} accent="green" />
        <StatCard label="Multiplicaciones" value={d.multiplicaciones} icon={GitBranch} accent="brand" />
        <StatCard label="Personas enviadas" value={d.personasEnviadas} icon={Send} accent="gold" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Líderes formando más líderes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {d.topLeaders.length === 0 && <p className="text-sm text-ink-400">Sin datos todavía.</p>}
          {d.topLeaders.map((t, i) =>
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
    </div>
  );
}
