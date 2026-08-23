import Link from "next/link";
import { PILLARS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const PILLAR_STYLES: Record<string, string> = {
  GANAR: "bg-brand-600 hover:bg-brand-700",
  CONSOLIDAR: "bg-ink-900 hover:bg-ink-800",
  ENTRENAR: "bg-brand-800 hover:bg-brand-900",
  ENVIAR: "bg-gold-500 hover:bg-gold-600 text-ink-900",
};

export function PillarsBar() {
  return (
    <div className="scrollbar-thin flex gap-2 overflow-x-auto px-4 py-2 sm:px-6">
      {PILLARS.map((p) => (
        <Link
          key={p.key}
          href={p.href}
          className={cn(
            "group flex min-w-[150px] shrink-0 flex-col rounded-xl px-4 py-2 text-white transition-colors sm:min-w-[190px]",
            PILLAR_STYLES[p.key]
          )}
        >
          <span className="font-display text-sm font-bold tracking-widest">{p.title}</span>
          <span className={cn("truncate text-[11px] opacity-80", p.key === "ENVIAR" && "text-ink-800")}>
            {p.subtitle}
          </span>
        </Link>
      ))}
    </div>
  );
}
