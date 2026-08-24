import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/lib/permissions";
import Link from "next/link";
import { Crown } from "lucide-react";

export default async function LideresPage() {
  const users = await prisma.user.findMany({
    where: { role: { key: { in: ["ADMIN", "LIDER_MACRO", "LIDER_CELULA", "CO_LIDER", "LIDER_FORMACION", "SUPERVISOR"] } } },
    include: {
      role: true,
      ledCells: { select: { id: true, number: true, name: true } },
      coLedCells: { select: { id: true, number: true, name: true } },
      macroCell: { select: { name: true } },
      person: { select: { id: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <PageHeader title="Líderes" subtitle={`${users.length} líder(es) registrados en el sistema`} />

      {users.length === 0 ? (
        <EmptyState title="Sin líderes registrados" />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {users.map((u) => (
            <div key={u.id} className="rounded-2xl border border-ink-100 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100 text-gold-700">
                  <Crown className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-ink-900">
                    {u.person ? <Link href={`/personas/${u.person.id}`} className="hover:text-brand-700">{u.name}</Link> : u.name}
                  </p>
                  <p className="truncate text-xs text-ink-400">{u.email}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1">
                <Badge variant="brand">{ROLE_LABELS[u.role.key]}</Badge>
                {!u.active && <Badge variant="red">Inactivo</Badge>}
              </div>
              {u.macroCell && <p className="mt-2 text-xs text-ink-500">Macro Célula: {u.macroCell.name}</p>}
              {u.ledCells.length > 0 && (
                <p className="mt-1 text-xs text-ink-500">
                  Lidera: {u.ledCells.map((c) => `C${c.number}`).join(", ")}
                </p>
              )}
              {u.coLedCells.length > 0 && (
                <p className="mt-1 text-xs text-ink-500">
                  Co-lidera: {u.coLedCells.map((c) => `C${c.number}`).join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
