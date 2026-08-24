import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { addRetreatParticipant } from "@/actions/retreats";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PeoplePicker } from "@/components/people-picker";
import { formatDate, fullName } from "@/lib/utils";
import Link from "next/link";

export default async function RetreatDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const retreat = await prisma.retreat.findUnique({
    where: { id },
    include: { retreatType: true, participants: { include: { person: true } } },
  });
  if (!retreat) notFound();

  const addParticipant = addRetreatParticipant.bind(null, id);

  return (
    <div>
      <PageHeader title={retreat.name} subtitle={`${retreat.retreatType.name} · ${formatDate(retreat.date)} · ${retreat.place ?? ""}`} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Participantes ({retreat.participants.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {retreat.participants.length === 0 ? (
              <EmptyState title="Sin participantes registrados" />
            ) : (
              <ul className="space-y-2">
                {retreat.participants.map((p) => (
                  <li key={p.id} className="rounded-lg border border-ink-100 p-3">
                    <Link href={`/personas/${p.person.id}`} className="font-medium text-ink-800 hover:text-brand-700">
                      {fullName(p.person)}
                    </Link>
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
