"use client";

import { ClassToggle } from "@/components/cardex/class-toggle";

export function ClassToggleGroup({
  completedMap,
  onToggle,
}: {
  completedMap: Record<number, boolean>;
  onToggle: (classNumber: number, completed: boolean) => Promise<void>;
}) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {[1, 2, 3, 4].map((n) => (
        <ClassToggle key={n} classNumber={n} completed={!!completedMap[n]} onToggle={onToggle} />
      ))}
    </div>
  );
}
