"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, LogOut, Bell } from "lucide-react";
import { NavList } from "@/components/layout/nav-list";
import { PillarsBar } from "@/components/layout/pillars-bar";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  userName,
  roleLabel,
  notificationCount,
}: {
  children: React.ReactNode;
  userName: string;
  roleLabel: string;
  notificationCount: number;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 shrink-0 flex-col bg-ink-950 md:flex">
        <SidebarBrand />
        <NavList />
        <SidebarFooter userName={userName} roleLabel={roleLabel} />
      </aside>

      {/* Sidebar mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex w-72 flex-col bg-ink-950">
            <div className="flex items-center justify-between px-4 pt-4">
              <SidebarBrand compact />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-ink-300 hover:bg-ink-800"
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavList onNavigate={() => setMobileOpen(false)} />
            <SidebarFooter userName={userName} roleLabel={roleLabel} />
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/95 backdrop-blur">
          <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-ink-600 hover:bg-ink-100 md:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1" />
            <Link
              href="/notificaciones"
              className="relative rounded-lg p-2 text-ink-600 hover:bg-ink-100"
              aria-label="Notificaciones"
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">
                  {notificationCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-ink-600 hover:bg-ink-100"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
          <div className="border-t border-ink-100 bg-ink-50/50">
            <PillarsBar />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

function SidebarBrand({ compact }: { compact?: boolean }) {
  return (
    <div className={cn("px-5", compact ? "py-0" : "py-5")}>
      <div className="font-display text-lg leading-tight font-bold tracking-wide text-white">
        MACRO <span className="text-brand-500">SANTIDAD</span>
      </div>
      <div className="text-[11px] font-medium tracking-[0.2em] text-gold-400 uppercase">CRM Celular</div>
    </div>
  );
}

function SidebarFooter({ userName, roleLabel }: { userName: string; roleLabel: string }) {
  return (
    <div className="border-t border-ink-800 px-4 py-3">
      <div className="truncate text-sm font-semibold text-white">{userName}</div>
      <div className="truncate text-xs text-ink-400">{roleLabel}</div>
    </div>
  );
}
