import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getScope, isCellIdInScope } from "@/lib/scope";
import { getCellHealth, HEALTH_COLORS, HEALTH_LABELS } from "@/lib/business";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PersonRow } from "@/components/person-row";
import { formatDate } from "@/lib/utils";
import { CalendarCheck, Pencil } from "lucide-react";

export default async function CellDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;

  const cell = await prisma.cell.findUnique({
    where: { id },
    include: {
      macroCell: true,
      leader: { select: { name: true } },
      coLeader: { select: { name: true } },
      people: { include: { currentCell: { select: { number: true, name: true } }, currentStage: { select: { name: true } } } },
      attendanceReports: { orderBy: { date: "desc" }, take: 8 },
      parentCell: { select: { id: true, name: true, number: true } },
      childCells: { select: { id: true, name: true, number: true } },
    },
  });
  if (!cell) notFound();

  const scope = getScope(session);
  if (!isCellIdInScope(scope, cell.id, cell.macroCellId)) notFound();

  const health = await getCellHealth(id);

  return (
    <div>
      <PageHeader
        title={`Célula ${cell.number} — ${cell.name}`}
        subtitle={`${cell.macroCell.name} · ${cell.people.length} miembro(s)`}
        actions={
          <>
            <LinkButton href={`/asistencia/${cell.id}`} variant="outline">
              <CalendarCheck className="h-4 w-4" /> Asistencia
            </LinkButton>
            <LinkButton href={`/celulas/${cell.id}/editar`}>
              <Pencil className="h-4 w-4" /> Editar
            </LinkButton>
          </>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <span className="text-xs text-ink-400 uppercase">Salud de la célula</span>
            <p className="mt-1 flex items-center gap-2 font-display text-lg font-bold text-ink-900">
              <span className={`h-3 w-3 rounded-full ${HEALTH_COLORS[health.level]}`} /> {HEALTH_LABELS[health.level]}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="text-xs text-ink-400 uppercase">Líder / Co-líder</span>
            <p className="mt-1 font-medium text-ink-800">{cell.leader?.name ?? "—"}</p>
            <p className="text-xs text-ink-500">{cell.coLeader?.name}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="text-xs text-ink-400 uppercase">Reunión</span>
            <p className="mt-1 font-medium text-ink-800">{cell.meetingDay ?? "—"} {cell.meetingTime}</p>
            <p className="text-xs text-ink-500">{cell.address}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <span className="text-xs text-ink-400 uppercase">Asistencia promedio</span>
            <p className="mt-1 font-display text-lg font-bold text-brand-700">{health.attendancePercent}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Miembros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {cell.people.length === 0 ? <EmptyState title="Sin miembros" /> : cell.people.map((p) => <PersonRow key={p.id} person={p} />)}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos informes de célula</CardTitle>
          </CardHeader>
          <CardContent>
            {cell.attendanceReports.length === 0 ? (
              <EmptyState title="Sin informes registrados" />
            ) : (
              <ul className="space-y-2">
                {cell.attendanceReports.map((r) => (
                  <li key={r.id} className="flex items-center justify-between rounded-lg border border-ink-100 px-3 py-2 text-sm">
                    <span>{formatDate(r.date)}</span>
                    <span className="text-ink-500">
                      {r.attendeesCount}/{r.membersCount} · {r.attendancePercent}%
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {(cell.parentCell || cell.childCells.length > 0) && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Multiplicación</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-ink-600">
              {cell.parentCell && <p>Nació de: C{cell.parentCell.number} — {cell.parentCell.name}</p>}
              {cell.childCells.length > 0 && (
                <p>
                  Multiplicó en: {cell.childCells.map((c) => `C${c.number} — ${c.name}`).join(", ")}
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
