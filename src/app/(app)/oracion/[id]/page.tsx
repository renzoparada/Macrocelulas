import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { canViewPrayerRequest } from "@/lib/prayer-access";
import { addPrayerUpdate, resolvePrayerRequest, deactivatePrayerRequest } from "@/actions/prayer";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fullName, formatDate, formatDateTime, daysBetween } from "@/lib/utils";
import Link from "next/link";

export default async function PrayerRequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;
  const request = await prisma.prayerRequest.findUnique({
    where: { id },
    include: {
      person: { include: { currentCell: { select: { macroCellId: true } } } },
      updates: { orderBy: { date: "desc" } },
      resolution: true,
    },
  });
  if (!request) notFound();
  if (!canViewPrayerRequest(session, request)) notFound();

  const addUpdate = addPrayerUpdate.bind(null, id);
  const resolve = resolvePrayerRequest.bind(null, id);
  const deactivate = deactivatePrayerRequest.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <PageHeader
        title="Motivo de oración"
        subtitle={
          <>
            <Link href={`/personas/${request.person.id}`} className="text-brand-700 hover:underline">
              {fullName(request.person)}
            </Link>{" "}
            · {request.category}
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{request.motivo}</CardTitle>
          <Badge variant={request.status === "ACTIVO" ? "green" : request.status === "RESUELTO" ? "default" : "dark"}>
            {request.status}
          </Badge>
        </CardHeader>
        <CardContent className="text-sm text-ink-600">
          <p>Desde: {formatDate(request.startDate)} ({daysBetween(request.startDate)} días)</p>
          {request.notes && <p className="mt-1">{request.notes}</p>}
          {request.isPrivate && <Badge variant="dark" className="mt-2">Privado</Badge>}
        </CardContent>
      </Card>

      {request.status === "ACTIVO" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Agregar seguimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={addUpdate} className="space-y-3">
                <Textarea name="note" placeholder="¿Qué ocurrió en este seguimiento?" required />
                <Input name="authorName" placeholder="Tu nombre (opcional)" />
                <Button type="submit" className="w-full">
                  Guardar seguimiento
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>¿Qué ocurrió? — Resolver</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={resolve} className="space-y-3">
                <Field label="Respuesta" required>
                  <Textarea name="response" required />
                </Field>
                <Field label="Testimonio (opcional)">
                  <Textarea name="testimony" />
                </Field>
                <label className="flex items-center gap-2 text-sm text-ink-600">
                  <input type="checkbox" name="becameTestimonial" className="rounded" />
                  ¿Deseas registrar esto como testimonio?
                </label>
                <Button type="submit" variant="gold" className="w-full">
                  Marcar como resuelto
                </Button>
              </form>
            </CardContent>
          </Card>

          <form action={deactivate}>
            <Button type="submit" variant="outline" size="sm">
              Desactivar (sin eliminar historial)
            </Button>
          </form>
        </>
      )}

      {request.resolution && (
        <Card>
          <CardHeader>
            <CardTitle>✨ Resolución</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-ink-600">
            <p>{request.resolution.response}</p>
            {request.resolution.testimony && <p className="mt-1 text-brand-700">{request.resolution.testimony}</p>}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Historial de seguimiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {request.updates.length === 0 && <p className="text-sm text-ink-400">Sin seguimientos todavía.</p>}
          {request.updates.map((u) => (
            <div key={u.id} className="rounded-lg border border-ink-100 p-3 text-sm">
              <p className="text-xs text-ink-400">{formatDateTime(u.date)} {u.authorName && `· ${u.authorName}`}</p>
              <p className="text-ink-700">{u.note}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
