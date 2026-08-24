import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getScope, isCellIdInScope } from "@/lib/scope";
import { updateCell } from "@/actions/cells";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default async function EditCellPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;
  const [cell, leaders, coLeaders] = await Promise.all([
    prisma.cell.findUnique({ where: { id } }),
    prisma.user.findMany({ where: { role: { key: "LIDER_CELULA" }, active: true }, select: { id: true, name: true } }),
    prisma.user.findMany({ where: { role: { key: "CO_LIDER" }, active: true }, select: { id: true, name: true } }),
  ]);
  if (!cell) notFound();

  const scope = getScope(session);
  if (!isCellIdInScope(scope, cell.id, cell.macroCellId)) notFound();

  const action = updateCell.bind(null, id);

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title={`Editar célula ${cell.number}`} />
      <Card>
        <CardContent>
          <form action={action} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nombre" required className="sm:col-span-2">
              <Input name="name" defaultValue={cell.name} required />
            </Field>
            <Field label="Líder">
              <Select name="leaderId" defaultValue={cell.leaderId ?? ""}>
                <option value="">Sin asignar</option>
                {leaders.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Co-líder">
              <Select name="coLeaderId" defaultValue={cell.coLeaderId ?? ""}>
                <option value="">Sin asignar</option>
                {coLeaders.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Día de reunión">
              <Input name="meetingDay" defaultValue={cell.meetingDay ?? ""} />
            </Field>
            <Field label="Hora">
              <Input name="meetingTime" type="time" defaultValue={cell.meetingTime ?? ""} />
            </Field>
            <Field label="Dirección" className="sm:col-span-2">
              <Input name="address" defaultValue={cell.address ?? ""} />
            </Field>
            <Field label="Estado">
              <Select name="status" defaultValue={cell.status}>
                <option value="ACTIVA">Activa</option>
                <option value="EN_FORMACION">En formación</option>
                <option value="EN_ALERTA">En alerta</option>
                <option value="INACTIVA">Inactiva</option>
                <option value="MULTIPLICADA">Multiplicada</option>
              </Select>
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" className="w-full">
                Guardar cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
