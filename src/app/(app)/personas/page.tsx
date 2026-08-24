import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getScope, personScopeWhere, cellScopeWhere } from "@/lib/scope";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { LinkButton } from "@/components/ui/button";
import { PersonRow } from "@/components/person-row";
import { Select, Input } from "@/components/ui/form";
import { Plus } from "lucide-react";
import type { Prisma } from "@/generated/prisma/client";

export default async function PersonasPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; celula?: string; etapa?: string; estado?: string; nuevos?: string }>;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  const scope = getScope(session);
  const params = await searchParams;

  const where: Prisma.PersonWhereInput = { AND: [personScopeWhere(scope)] };
  if (params.q) {
    where.OR = [
      { firstName: { contains: params.q, mode: "insensitive" } },
      { lastNamePaternal: { contains: params.q, mode: "insensitive" } },
      { lastNameMaternal: { contains: params.q, mode: "insensitive" } },
      { documentId: { contains: params.q, mode: "insensitive" } },
    ];
  }
  if (params.celula) where.currentCellId = params.celula;
  if (params.etapa) where.currentStage = { key: params.etapa };
  if (params.estado) where.status = params.estado as never;
  if (params.nuevos) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    where.registeredAt = { gte: startOfMonth };
  }

  const [people, cells, stages] = await Promise.all([
    prisma.person.findMany({
      where,
      include: { currentCell: { select: { number: true, name: true } }, currentStage: { select: { name: true } } },
      orderBy: { registeredAt: "desc" },
      take: 100,
    }),
    prisma.cell.findMany({ where: cellScopeWhere(scope), orderBy: { number: "asc" }, select: { id: true, number: true, name: true } }),
    prisma.processStage.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <PageHeader
        title="Personas"
        subtitle={`${people.length} persona(s) encontradas`}
        actions={
          <LinkButton href="/personas/nuevo">
            <Plus className="h-4 w-4" /> Nueva persona
          </LinkButton>
        }
      />

      <form className="mb-5 grid grid-cols-1 gap-2 sm:grid-cols-4">
        <Input name="q" placeholder="Buscar por nombre o documento..." defaultValue={params.q} className="sm:col-span-2" />
        <Select name="celula" defaultValue={params.celula ?? ""}>
          <option value="">Todas las células</option>
          {cells.map((c) => (
            <option key={c.id} value={c.id}>
              C{c.number} — {c.name}
            </option>
          ))}
        </Select>
        <Select name="etapa" defaultValue={params.etapa ?? ""}>
          <option value="">Todas las etapas</option>
          {stages.map((s) => (
            <option key={s.id} value={s.key}>
              {s.name}
            </option>
          ))}
        </Select>
      </form>

      {people.length === 0 ? (
        <EmptyState title="Sin personas registradas" description="Empieza registrando la primera persona del sistema." />
      ) : (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {people.map((p) => (
            <PersonRow key={p.id} person={p} />
          ))}
        </div>
      )}
    </div>
  );
}
