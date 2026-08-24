import { fullName, initials, formatDate, monthsBetween } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { HEALTH_COLORS, HEALTH_LABELS, type HealthLevel } from "@/lib/business";
import type { CardexPerson } from "@/lib/cardex-query";
import { Pencil, Dot } from "lucide-react";

const STATUS_VARIANT: Record<string, "green" | "yellow" | "red" | "default"> = {
  ACTIVO: "green",
  INACTIVO: "default",
  EN_RIESGO: "yellow",
  RETIRADO: "red",
};

export function CardexHeader({ person, health }: { person: CardexPerson; health: HealthLevel }) {
  const months = monthsBetween(person.registeredAt);

  return (
    <div className="mb-6 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start gap-4">
        <div className="relative">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-100 font-display text-2xl font-bold text-brand-700">
            {person.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={person.photoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              initials(person)
            )}
          </div>
          <span
            className={`absolute -right-1 -bottom-1 h-5 w-5 rounded-full border-2 border-white ${HEALTH_COLORS[health]}`}
            title={HEALTH_LABELS[health]}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-display text-xl font-bold text-ink-900">{fullName(person)}</h1>
            <Badge variant={STATUS_VARIANT[person.status] ?? "default"}>
              <Dot className="h-3 w-3" /> {person.status}
            </Badge>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-ink-500 sm:grid-cols-4">
            <div>
              <span className="block text-xs text-ink-400 uppercase">Célula</span>
              <span className="font-medium text-ink-800">
                {person.currentCell ? `C${person.currentCell.number} — ${person.currentCell.name}` : "Sin asignar"}
              </span>
            </div>
            <div>
              <span className="block text-xs text-ink-400 uppercase">Líder</span>
              <span className="font-medium text-ink-800">{person.currentCell?.leader?.name ?? "—"}</span>
            </div>
            <div>
              <span className="block text-xs text-ink-400 uppercase">Macro Célula</span>
              <span className="font-medium text-ink-800">{person.currentCell?.macroCell?.name ?? "—"}</span>
            </div>
            <div>
              <span className="block text-xs text-ink-400 uppercase">Etapa actual</span>
              <span className="font-medium text-brand-700">{person.currentStage?.name ?? "Sin etapa"}</span>
            </div>
            <div>
              <span className="block text-xs text-ink-400 uppercase">Fecha de ingreso</span>
              <span className="font-medium text-ink-800">{formatDate(person.registeredAt)}</span>
            </div>
            <div>
              <span className="block text-xs text-ink-400 uppercase">Tiempo en proceso</span>
              <span className="font-medium text-ink-800">{months} mes(es)</span>
            </div>
          </div>
        </div>

        <LinkButton href={`/personas/${person.id}/editar`} variant="outline" size="sm">
          <Pencil className="h-4 w-4" /> Editar
        </LinkButton>
      </div>
    </div>
  );
}
