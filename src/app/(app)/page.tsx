import { getGeneralDashboardStats } from "@/lib/dashboard";
import { PageHeader } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PILLARS } from "@/lib/constants";
import Link from "next/link";
import {
  Users,
  CircleDot,
  Crown,
  Sparkles,
  CalendarCheck,
  Sunrise,
  Droplet,
  AlertTriangle,
  HandHeart,
  CheckCircle2,
} from "lucide-react";

export default async function DashboardPage() {
  const stats = await getGeneralDashboardStats();

  return (
    <div>
      <PageHeader
        title="Dashboard General"
        subtitle="Visión completa de la Macro Santidad: personas, células y su proceso de crecimiento."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Personas" value={stats.peopleCount} icon={Users} accent="brand" href="/personas" />
        <StatCard label="Células" value={stats.cellsCount} icon={CircleDot} accent="ink" href="/celulas" />
        <StatCard label="Líderes" value={stats.leadersCount} icon={Crown} accent="gold" href="/lideres" />
        <StatCard label="Nuevos (mes)" value={stats.newPeopleThisMonth} icon={Sunrise} accent="green" href="/personas?nuevos=1" />
        <StatCard label="Asistencia" value={`${stats.avgAttendance}%`} icon={CalendarCheck} accent="brand" href="/asistencia" />
        <StatCard
          label="Habilitados p/ Encuentro"
          value={stats.habilitadosParaEncuentro}
          icon={Sparkles}
          accent="gold"
          href="/pre-encuentro"
        />
        <StatCard label="Encuentros" value={stats.encountersAttended} icon={Sparkles} accent="ink" href="/encuentros" />
        <StatCard label="Bautismos" value={stats.baptismsCount} icon={Droplet} accent="brand" href="/bautismos" />
        <StatCard label="Células en alerta" value={stats.cellsEnAlerta} icon={AlertTriangle} accent="brand" href="/celulas?alerta=1" />
        <StatCard label="Motivos activos" value={stats.prayerActiveCount} icon={HandHeart} accent="gold" href="/oracion" />
        <StatCard
          label="Resueltos (mes)"
          value={stats.prayerResolvedThisMonth}
          icon={CheckCircle2}
          accent="green"
          href="/oracion?estado=RESUELTO"
        />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {PILLARS.map((p) => (
          <Link key={p.key} href={p.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-brand-700">{p.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-ink-500">{p.subtitle}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
