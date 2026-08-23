import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { fullName, formatDate } from "@/lib/utils";
import Link from "next/link";
import { Plus, Droplet } from "lucide-react";

export default async function BaptismsPage() {
  const baptisms = await prisma.baptism.findMany({
    include: { person: { select: { id: true, firstName: true, lastNamePaternal: true, photoUrl: true } } },
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <PageHeader
        title="Bautismos"
        subtitle={`${baptisms.length} bautismo(s) registrados`}
        actions={
          <LinkButton href="/bautismos/nuevo">
            <Plus className="h-4 w-4" /> Registrar bautismo
          </LinkButton>
        }
      />

      {baptisms.length === 0 ? (
        <EmptyState title="Sin bautismos registrados" />
      ) : (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {baptisms.map((b) => (
            <Link key={b.id} href={`/personas/${b.person.id}`} className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-3 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Droplet className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-ink-800">{fullName(b.person)}</p>
                <p className="text-xs text-ink-400">{formatDate(b.date)} · {b.place}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
