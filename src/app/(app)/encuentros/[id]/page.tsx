import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { registerForEncounter, markEncounterAttendance, toggleEncounterConfirmation } from "@/actions/encounters";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PeoplePicker } from "@/components/people-picker";
import { formatDate, fullName } from "@/lib/utils";
import Link from "next/link";

export default async function EncounterDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const encounter = await prisma.encounter.findUnique({
    where: { id },
    include: { registrations: { include: { person: true }, orderBy: { registeredAt: "asc" } } },
  });
  if (!encounter) notFound();

  const register = registerForEncounter.bind(null, id);

  return (
    <div>
      <PageHeader title={encounter.name} subtitle={`${encounter.type.replaceAll("_", " ")} · ${formatDate(encounter.date)} · ${encounter.place ?? ""}`} />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Inscritos ({encounter.registrations.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {encounter.registrations.length === 0 ? (
              <EmptyState title="Sin inscritos todavía" />
            ) : (
              <div className="space-y-2">
                {encounter.registrations.map((r) => (
                  <div key={r.id} className="flex items-center justify-between rounded-lg border border-ink-100 p-3">
                    <Link href={`/personas/${r.person.id}`} className="text-sm font-medium text-ink-800 hover:text-brand-700">
                      {fullName(r.person)}
                    </Link>
                    <div className="flex items-center gap-2">
                      {r.attended ? (
                        <Badge variant="green">Asistió</Badge>
                      ) : (
                        <>
                          <form action={toggleEncounterConfirmation.bind(null, id, r.person.id, !r.confirmed)}>
                            <Button type="submit" size="sm" variant={r.confirmed ? "outline" : "gold"}>
                              {r.confirmed ? "Confirmado" : "Confirmar"}
                            </Button>
                          </form>
                          <form action={markEncounterAttendance.bind(null, id, r.person.id, true)}>
                            <Button type="submit" size="sm">
                              Marcar asistió
                            </Button>
                          </form>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inscribir persona</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={register} className="space-y-4">
              <PeoplePicker name="personId" placeholder="Buscar persona..." />
              <Button type="submit" className="w-full">
                Inscribir
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
