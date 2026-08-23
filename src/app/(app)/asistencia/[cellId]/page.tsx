import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { saveAttendance } from "@/actions/attendance";
import { PageHeader } from "@/components/ui/page-header";
import { AttendanceForm } from "@/components/attendance/attendance-form";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default async function AttendancePage({
  params,
  searchParams,
}: {
  params: Promise<{ cellId: string }>;
  searchParams: Promise<{ date?: string; saved?: string }>;
}) {
  const { cellId } = await params;
  const sp = await searchParams;
  const date = sp.date ?? todayISO();

  const cell = await prisma.cell.findUnique({ where: { id: cellId } });
  if (!cell) notFound();

  const [memberships, existing, report] = await Promise.all([
    prisma.cellMembership.findMany({
      where: { cellId, isCurrent: true },
      include: { person: { select: { id: true, firstName: true, lastNamePaternal: true, lastNameMaternal: true, photoUrl: true } } },
      orderBy: { person: { firstName: "asc" } },
    }),
    prisma.attendance.findMany({ where: { cellId, date: new Date(date) } }),
    prisma.attendanceReport.findUnique({ where: { cellId_date: { cellId, date: new Date(date) } } }),
  ]);

  const action = saveAttendance.bind(null, cellId, date);

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title={`Asistencia — C${cell.number}`} subtitle={cell.name} />

      {sp.saved && (
        <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
          ✅ Asistencia guardada correctamente.
        </div>
      )}

      <form method="get" className="mb-4 flex items-end gap-2">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium text-ink-700">Fecha</label>
          <Input name="date" type="date" defaultValue={date} />
        </div>
        <Button type="submit" variant="outline">
          Cambiar fecha
        </Button>
      </form>

      <AttendanceForm
        action={action}
        members={memberships.map((m) => m.person)}
        existing={existing.map((a) => ({ personId: a.personId, attended: a.attended, isGuest: a.isGuest, absenceReason: a.absenceReason }))}
        notes={report?.notes ?? undefined}
      />
    </div>
  );
}
