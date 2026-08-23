"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type CardexTab = {
  key: string;
  label: string;
  content: React.ReactNode;
};

export function CardexTabs({ tabs }: { tabs: CardexTab[] }) {
  const [active, setActive] = useState(tabs[0]?.key);

  return (
    <div>
      <div className="scrollbar-thin mb-5 flex gap-1 overflow-x-auto border-b border-ink-100 pb-px">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActive(t.key)}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors",
              active === t.key
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-ink-500 hover:text-ink-800"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.key} className={active === t.key ? "block" : "hidden"}>
          {t.content}
        </div>
      ))}
    </div>
  );
}
