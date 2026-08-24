"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export function ClassToggle({
  classNumber,
  completed,
  onToggle,
}: {
  classNumber: number;
  completed: boolean;
  onToggle: (classNumber: number, completed: boolean) => Promise<void>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => onToggle(classNumber, !completed))}
      className={cn(
        "flex flex-col items-center justify-center gap-1 rounded-xl border p-3 text-sm font-semibold transition-colors disabled:opacity-50",
        completed ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-ink-200 text-ink-400 hover:border-ink-300"
      )}
    >
      <span
        className={cn(
          "flex h-6 w-6 items-center justify-center rounded-full border-2",
          completed ? "border-emerald-500 bg-emerald-500 text-white" : "border-ink-300"
        )}
      >
        {completed && <Check className="h-3.5 w-3.5" />}
      </span>
      Clase {classNumber}
    </button>
  );
}
