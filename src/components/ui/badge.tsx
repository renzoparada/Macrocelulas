import { cn } from "@/lib/utils";

const variants = {
  default: "bg-ink-100 text-ink-700",
  brand: "bg-brand-600 text-white",
  gold: "bg-gold-400 text-ink-900",
  green: "bg-emerald-100 text-emerald-700",
  yellow: "bg-gold-100 text-gold-800",
  red: "bg-brand-100 text-brand-700",
  outline: "border border-ink-200 text-ink-600",
  dark: "bg-ink-900 text-white",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Dot({ className }: { className?: string }) {
  return <span className={cn("inline-block h-2 w-2 rounded-full", className)} />;
}
