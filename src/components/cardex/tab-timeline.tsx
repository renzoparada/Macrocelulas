import { EmptyState } from "@/components/ui/page-header";
import { formatDateTime } from "@/lib/utils";
import type { CardexPerson } from "@/lib/cardex-query";

const TYPE_ICON: Record<string, string> = {
  REGISTRO: "📝",
  ACEPTO_JESUS: "✨",
  PRIMERA_CELULA: "🏠",
  CAMBIO_CELULA: "🔁",
  PRE_ENCUENTRO: "✅",
  ENCUENTRO: "🌟",
  POST_ENCUENTRO: "✅",
  BAUTISMO: "💧",
  DISCIPULADO: "📖",
  META: "🎯",
  SUENO: "⭐",
  LOGRO: "🏆",
  DESAFIO: "⚠️",
  ORACION: "🙏",
  ORACION_SEGUIMIENTO: "🙏",
  ORACION_RESUELTA: "✨",
  TESTIMONIO: "💬",
  MULTIPLICACION: "🌿",
};

export function TabTimeline({ person }: { person: CardexPerson }) {
  if (person.timeline.length === 0) {
    return <EmptyState title="Sin eventos en la línea de tiempo" description="Los hitos de esta persona aparecerán aquí en orden cronológico." />;
  }

  return (
    <div className="relative border-l-2 border-ink-100 pl-6">
      {person.timeline.map((event) => (
        <div key={event.id} className="relative mb-6 last:mb-0">
          <span className="absolute top-0.5 -left-[31px] flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm ring-2 ring-brand-200">
            {TYPE_ICON[event.type] ?? "•"}
          </span>
          <p className="text-xs text-ink-400">{formatDateTime(event.date)}</p>
          <p className="font-semibold text-ink-800">
            {event.title} {event.isPrivate && <span className="text-xs text-ink-400">(privado)</span>}
          </p>
          {event.description && <p className="text-sm text-ink-500">{event.description}</p>}
        </div>
      ))}
    </div>
  );
}
