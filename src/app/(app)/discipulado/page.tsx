import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fullName, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, BookOpen } from "lucide-react";

export default async function DiscipuladoPage() {
  const sessions = await prisma.discipleshipSession.findMany({
    include: { disciple: true, mentor: true, tools: { include: { tool: true } } },
    orderBy: { date: "desc" },
    take: 50,
  });

  return (
    <div>
      <PageHeader
        title="Discipulado"
        subtitle="Seguimiento personal, rendición de cuentas y crecimiento espiritual."
        actions={
          <>
            <LinkButton href="/discipulado/herramientas" variant="outline">
              Herramientas
            </LinkButton>
            <LinkButton href="/discipulado/nuevo">
              <Plus className="h-4 w-4" /> Nueva sesión
            </LinkButton>
          </>
        }
      />

      {sessions.length === 0 ? (
        <EmptyState title="Sin sesiones registradas" />
      ) : (
        <div className="space-y-2">
          {sessions.map((s) => (
            <div key={s.id} className="rounded-xl border border-ink-100 bg-white p-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-brand-600" />
                  <Link href={`/personas/${s.disciple.id}`} className="font-semibold text-ink-900 hover:text-brand-700">
                    {fullName(s.disciple)}
                  </Link>
                  <span className="text-xs text-ink-400">con {fullName(s.mentor)}</span>
                </div>
                <span className="text-xs text-ink-400">{formatDate(s.date)}</span>
              </div>
              <p className="mt-1 text-sm font-medium text-ink-700">{s.topic}</p>
              {s.tools.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {s.tools.map((t) => (
                    <Badge key={t.id} variant="gold">
                      {t.tool.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
