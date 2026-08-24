import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { fullName, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Church, CheckCircle2, XCircle } from "lucide-react";

export default async function IglesiaPage() {
  const records = await prisma.churchAttendance.findMany({
    include: { person: true },
    orderBy: { updatedAt: "desc" },
  });

  const attending = records.filter((r) => r.attends).length;
  const notAttending = records.length - attending;

  return (
    <div>
      <PageHeader title="Iglesia" subtitle="Integración a la congregación local." />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Asisten a iglesia" value={attending} icon={CheckCircle2} accent="green" />
        <StatCard label="No asisten" value={notAttending} icon={XCircle} accent="brand" />
        <StatCard label="Registros" value={records.length} icon={Church} accent="ink" />
      </div>

      {records.length === 0 ? (
        <EmptyState title="Sin registros de integración a iglesia" />
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {records.map((r) => (
            <Link key={r.id} href={`/personas/${r.person.id}`} className="rounded-xl border border-ink-100 bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium text-ink-800">{fullName(r.person)}</span>
                <Badge variant={r.attends ? "green" : "red"}>{r.attends ? "Asiste" : "No asiste"}</Badge>
              </div>
              <p className="text-xs text-ink-400">
                {r.churchName ?? "—"} {r.frequency && `· ${r.frequency}`} {r.lastAttendance && `· última: ${formatDate(r.lastAttendance)}`}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
