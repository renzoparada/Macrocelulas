import { cn } from "@/lib/utils";

export function ProgressBar({
  value,
  label,
  colorClassName = "bg-brand-600",
  size = "md",
}: {
  value: number;
  label?: string;
  colorClassName?: string;
  size?: "sm" | "md";
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full">
      {label && (
        <div className="mb-1 flex items-center justify-between text-xs font-medium text-ink-600">
          <span>{label}</span>
          <span className="font-display font-semibold text-ink-900">{clamped}%</span>
        </div>
      )}
      <div className={cn("w-full overflow-hidden rounded-full bg-ink-100", size === "sm" ? "h-1.5" : "h-2.5")}>
        <div
          className={cn("h-full rounded-full transition-all", colorClassName)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
