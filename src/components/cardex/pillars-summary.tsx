import { ProgressBar } from "@/components/ui/progress-bar";
import type { PillarProgress } from "@/lib/business";

const PILLAR_META = [
  { key: "ganar" as const, label: "GANAR", color: "bg-brand-600" },
  { key: "consolidar" as const, label: "CONSOLIDAR", color: "bg-ink-800" },
  { key: "entrenar" as const, label: "ENTRENAR", color: "bg-brand-800" },
  { key: "enviar" as const, label: "ENVIAR", color: "bg-gold-500" },
];

export function PillarsSummary({ progress }: { progress: PillarProgress }) {
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm sm:grid-cols-4">
      {PILLAR_META.map((p) => (
        <ProgressBar key={p.key} value={progress[p.key]} label={p.label} colorClassName={p.color} />
      ))}
    </div>
  );
}
