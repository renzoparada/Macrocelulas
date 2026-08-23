import { cn } from "@/lib/utils";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "brand",
  href,
  hint,
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  accent?: "brand" | "gold" | "ink" | "green";
  href?: string;
  hint?: string;
}) {
  const accentClasses = {
    brand: "text-brand-600 bg-brand-50",
    gold: "text-gold-700 bg-gold-50",
    ink: "text-ink-700 bg-ink-100",
    green: "text-emerald-700 bg-emerald-50",
  };

  const content = (
    <div className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {Icon && (
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", accentClasses[accent])}>
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="min-w-0">
        <div className="font-display text-2xl leading-none font-bold text-ink-900 tabular-nums">{value}</div>
        <div className="mt-1 truncate text-xs font-medium tracking-wide text-ink-500 uppercase">{label}</div>
        {hint && <div className="mt-0.5 text-xs text-ink-400">{hint}</div>}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}
