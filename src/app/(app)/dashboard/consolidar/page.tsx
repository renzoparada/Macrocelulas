import { getConsolidarDashboard } from "@/lib/dashboard";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { CalendarCheck, ListChecks, Sparkles, Droplet, AlertTriangle, TrendingDown } from "lucide-react";

export default async function ConsolidarDashboardPage() {
  const d = await getConsolidarDashboard();

  return (
    <div>
      <PageHeader title="Dashboard · Consolidar" subtitle="Lograr que la persona permanezca, se integre y avance." />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Asistencia promedio" value={`${d.avgAttendance}%`} icon={CalendarCheck} accent="brand" />
        <StatCard label="En Pre-Encuentro" value={d.preEncuentroActivos} icon={ListChecks} accent="gold" />
        <StatCard label="Encuentro asistidos" value={d.encuentroAsistidos} icon={Sparkles} accent="ink" />
        <StatCard label="Post-Encuentro completo" value={d.postEncuentroCompletos} icon={ListChecks} accent="brand" />
        <StatCard label="Bautismos" value={d.bautismos} icon={Droplet} accent="gold" />
        <StatCard label="En riesgo" value={d.enRiesgo} icon={AlertTriangle} accent="brand" />
        <StatCard label="Inactivos" value={d.inactivos} icon={TrendingDown} accent="ink" />
      </div>
    </div>
  );
}
