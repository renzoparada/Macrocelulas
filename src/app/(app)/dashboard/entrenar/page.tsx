import { getEntrenarDashboard } from "@/lib/dashboard";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, ListChecks, CheckCircle2, Crown, Target } from "lucide-react";

export default async function EntrenarDashboardPage() {
  const d = await getEntrenarDashboard();

  return (
    <div>
      <PageHeader title="Dashboard · Entrenar" subtitle="Desarrollar a la persona espiritual, personal y como líder." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Sesiones de discipulado" value={d.discipulados} icon={BookOpen} accent="brand" />
        <StatCard label="Planes en proceso" value={d.planesActivos} icon={ListChecks} accent="gold" />
        <StatCard label="Planes completados" value={d.planesCompletados} icon={CheckCircle2} accent="green" />
        <StatCard label="Líderes en formación" value={d.lideresEnFormacion} icon={Crown} accent="ink" />
        <StatCard label="Metas cumplidas" value={d.metasCumplidas} icon={Target} accent="brand" />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Herramientas cristianas más utilizadas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {d.topTools.length === 0 && <p className="text-sm text-ink-400">Sin datos todavía.</p>}
          {d.topTools.map((t, i) =>
            t.tool ? (
              <div key={t.tool.id} className="flex items-center justify-between rounded-lg px-2 py-1.5">
                <span className="text-sm font-medium text-ink-800">
                  {i + 1}. {t.tool.name} <span className="text-ink-400">· {t.tool.category}</span>
                </span>
                <span className="font-display text-sm font-bold text-brand-600">{t.count}</span>
              </div>
            ) : null
          )}
        </CardContent>
      </Card>
    </div>
  );
}
