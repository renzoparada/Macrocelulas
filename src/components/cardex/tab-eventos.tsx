import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/page-header";
import { formatDate } from "@/lib/utils";
import type { CardexPerson } from "@/lib/cardex-query";

export function TabEventos({ person }: { person: CardexPerson }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Eventos y actividades</CardTitle>
        </CardHeader>
        <CardContent>
          {person.eventParticipations.length === 0 ? (
            <EmptyState title="Sin eventos registrados" />
          ) : (
            <ul className="space-y-2">
              {person.eventParticipations.map((ep) => (
                <li key={ep.id} className="rounded-lg border border-ink-100 px-3 py-2">
                  <p className="text-sm font-semibold text-ink-800">{ep.event.name}</p>
                  <p className="text-xs text-ink-400">{ep.event.type} · {formatDate(ep.event.date)}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Retiros</CardTitle>
        </CardHeader>
        <CardContent>
          {person.retreatParticipations.length === 0 ? (
            <EmptyState title="Sin retiros registrados" />
          ) : (
            <ul className="space-y-2">
              {person.retreatParticipations.map((rp) => (
                <li key={rp.id} className="rounded-lg border border-ink-100 px-3 py-2">
                  <p className="text-sm font-semibold text-ink-800">{rp.retreat.name}</p>
                  <p className="text-xs text-ink-400">{rp.retreat.retreatType.name} · {formatDate(rp.retreat.date)}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Congresos</CardTitle>
        </CardHeader>
        <CardContent>
          {person.congressParticipations.length === 0 ? (
            <EmptyState title="Sin congresos registrados" />
          ) : (
            <ul className="space-y-2">
              {person.congressParticipations.map((cp) => (
                <li key={cp.id} className="rounded-lg border border-ink-100 px-3 py-2">
                  <p className="text-sm font-semibold text-ink-800">{cp.congress.name}</p>
                  <p className="text-xs text-ink-400">{formatDate(cp.congress.date)} · {cp.attendance ? "Asistió" : "Inscrito"}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ayunos</CardTitle>
        </CardHeader>
        <CardContent>
          {person.fastingRecords.length === 0 ? (
            <EmptyState title="Sin ayunos registrados" />
          ) : (
            <ul className="space-y-2">
              {person.fastingRecords.map((f) => (
                <li key={f.id} className="rounded-lg border border-ink-100 px-3 py-2 text-sm">
                  {f.type ?? "Ayuno"} · {formatDate(f.startDate)} {f.endDate && `— ${formatDate(f.endDate)}`}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
