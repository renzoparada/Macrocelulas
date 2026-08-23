import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addCongressParticipant } from "@/actions/retreats";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PeoplePicker } from "@/components/people-picker";
import { formatDate, fullName } from "@/lib/utils";
import Link from "next/link";

export default async function CongressDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const congress = await prisma.congress.findUnique({
    where: { id },
    include: { participants: { include: { person: true } } },
  });
  if (!congress) notFound();

  const addParticipant = addCongressParticipant.bind(null, id);

  return (
    <div>
      <PageHeader title={congress.name} subtitle={`${formatDate(congress.date)} · ${congress.place ?? ""}`} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Participantes ({congress.participants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {congress.participants.length === 0 ? (
              <EmptyState title="Sin participantes registrados" />
            ) : (
              <ul className="space-y-2">
                {congress.participants.map((p) => (
                  <li key={p.id} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                    <Link href={`/personas/${p.person.id}`} className="font-medium text-ink-800 hover:text-brand-700">
                      {fullName(p.person)}
                    </Link>
                    <Badge variant={p.attendance ? "green" : "default"}>{p.attendance ? "Asistió" : "Inscrito"}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agregar participante</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={addParticipant} className="space-y-4">
              <PeoplePicker name="personId" placeholder="Buscar persona..." />
              <Button type="submit" className="w-full">
                Agregar
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
