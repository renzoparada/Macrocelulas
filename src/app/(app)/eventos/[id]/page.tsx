import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addEventParticipant, updateEventResults } from "@/actions/events";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PeoplePicker } from "@/components/people-picker";
import { Select, Textarea } from "@/components/ui/form";
import { formatDate, fullName } from "@/lib/utils";
import Link from "next/link";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { participants: { include: { person: true } } },
  });
  if (!event) notFound();

  const addParticipant = addEventParticipant.bind(null, id);
  const saveResults = updateEventResults.bind(null, id);

  const newCount = event.participants.filter((p) => p.role === "NUEVO").length;
  const guestCount = event.participants.filter((p) => p.role === "INVITADO").length;

  return (
    <div>
      <PageHeader title={event.name} subtitle={`${event.type} · ${formatDate(event.date)}`} />

      <div className="mb-4 flex gap-3 text-sm text-ink-500">
        <span>{event.participants.length} participantes</span>
        <span>· {guestCount} invitados</span>
        <span>· {newCount} nuevos</span>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            {event.participants.length === 0 ? (
              <EmptyState title="Sin participantes registrados" />
            ) : (
              <ul className="space-y-2">
                {event.participants.map((p) => (
                  <li key={p.id} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                    <Link href={`/personas/${p.person.id}`} className="font-medium text-ink-800 hover:text-brand-700">
                      {fullName(p.person)}
                    </Link>
                    <Badge variant={p.role === "NUEVO" ? "green" : p.role === "INVITADO" ? "gold" : "default"}>{p.role}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Agregar participante</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={addParticipant} className="space-y-4">
                <PeoplePicker name="personId" placeholder="Buscar persona..." />
                <Select name="role" defaultValue="PARTICIPANTE">
                  <option value="PARTICIPANTE">Participante</option>
                  <option value="INVITADO">Invitado</option>
                  <option value="NUEVO">Nuevo</option>
                </Select>
                <Button type="submit" className="w-full">
                  Agregar
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={saveResults} className="space-y-3">
                <Textarea name="results" defaultValue={event.results ?? ""} placeholder="¿Qué resultados tuvo este evento?" />
                <Button type="submit" variant="outline" className="w-full">
                  Guardar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
