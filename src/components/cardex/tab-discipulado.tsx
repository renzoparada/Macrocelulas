import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/page-header";
import { formatDate } from "@/lib/utils";
import type { CardexPerson } from "@/lib/cardex-query";
import { Plus } from "lucide-react";

export function TabDiscipulado({ person }: { person: CardexPerson }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sesiones de discipulado</CardTitle>
        <LinkButton href={`/discipulado/nuevo?discipleId=${person.id}`} size="sm" variant="outline">
          <Plus className="h-4 w-4" /> Nueva
        </LinkButton>
      </CardHeader>
      <CardContent>
        {person.discipleshipAsDisciple.length === 0 ? (
          <EmptyState title="Sin sesiones registradas" />
        ) : (
          <ul className="space-y-3">
            {person.discipleshipAsDisciple.map((s) => (
              <li key={s.id} className="rounded-lg border border-ink-100 p-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-ink-800">{s.topic}</span>
                  <span className="text-xs text-ink-400">{formatDate(s.date)}</span>
                </div>
                <p className="mt-1 text-xs text-ink-500">Con {s.mentor.firstName} {s.mentor.lastNamePaternal}</p>
                {s.commitments && <p className="mt-1 text-sm text-ink-600">Compromisos: {s.commitments}</p>}
                {s.tools.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {s.tools.map((t) => (
                      <Badge key={t.id} variant="gold">
                        {t.tool.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
