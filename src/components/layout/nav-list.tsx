"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { ICONS } from "@/components/layout/icon-map";
import { cn } from "@/lib/utils";

export function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="scrollbar-thin flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
      {NAV_ITEMS.map((item) => {
        const Icon = ICONS[item.icon];
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.label + item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-brand-600 text-white shadow-sm" : "text-ink-200 hover:bg-ink-800 hover:text-white"
            )}
          >
            {Icon && <Icon className="h-4 w-4 shrink-0" />}
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
