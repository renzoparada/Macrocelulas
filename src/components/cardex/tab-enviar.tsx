import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { fullName } from "@/lib/utils";
import type { CardexPerson } from "@/lib/cardex-query";
import { GitBranch } from "lucide-react";

export function TabEnviar({ person }: { person: CardexPerson }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Camino de multiplicación</CardTitle>
          <LinkButton href={`/multiplicacion/nuevo?discipleId=${person.id}`} size="sm" variant="outline">
            <GitBranch className="h-4 w-4" /> Registrar paso
          </LinkButton>
        </CardHeader>
        <CardContent>
          <div className="mb-3">
            <span className="text-xs text-ink-400 uppercase">Etapa actual</span>
            <p className="font-display text-lg font-bold text-brand-700">{person.currentStage?.name ?? "Sin etapa"}</p>
          </div>
          {person.multiplicationsAsDisciple.length === 0 ? (
            <EmptyState title="Sin pasos de multiplicación registrados" />
          ) : (
            <ul className="space-y-2">
              {person.multiplicationsAsDisciple.map((m) => (
                <li key={m.id} className="rounded-lg border border-ink-100 px-3 py-2 text-sm">
                  <Badge variant="brand">{m.stage.replaceAll("_", " ")}</Badge>{" "}
                  <span className="text-ink-500">
                    con {m.leader.firstName} {m.leader.lastNamePaternal}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Discípulos que está formando ({person.multiplicationsAsLeader.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {person.multiplicationsAsLeader.length === 0 ? (
            <EmptyState title="Aún no está formando líderes" />
          ) : (
            <ul className="space-y-2">
              {person.multiplicationsAsLeader.map((m) => (
                <li key={m.id} className="rounded-lg border border-ink-100 px-3 py-2 text-sm">
                  <span className="font-medium text-ink-800">{fullName(m.disciple)}</span>{" "}
                  <Badge variant="gold">{m.stage.replaceAll("_", " ")}</Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
