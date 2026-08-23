import { prisma } from "@/lib/prisma";
import { createCell } from "@/actions/cells";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default async function NewCellPage() {
  const [macroCells, leaders, coLeaders] = await Promise.all([
    prisma.macroCell.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.user.findMany({ where: { role: { key: "LIDER_CELULA" }, active: true }, select: { id: true, name: true } }),
    prisma.user.findMany({ where: { role: { key: "CO_LIDER" }, active: true }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Nueva Célula" />
      <Card>
        <CardContent>
          <form action={createCell} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Número" required>
              <Input name="number" required placeholder="Ej: 69" />
            </Field>
            <Field label="Nombre" required>
              <Input name="name" required />
            </Field>
            <Field label="Macro Célula" required className="sm:col-span-2">
              <Select name="macroCellId" required defaultValue="">
                <option value="" disabled>
                  Seleccionar...
                </option>
                {macroCells.map((mc) => (
                  <option key={mc.id} value={mc.id}>
                    {mc.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Líder">
              <Select name="leaderId" defaultValue="">
                <option value="">Sin asignar</option>
                {leaders.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Co-líder">
              <Select name="coLeaderId" defaultValue="">
                <option value="">Sin asignar</option>
                {coLeaders.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Día de reunión">
              <Select name="meetingDay" defaultValue="">
                <option value="">Seleccionar...</option>
                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Hora">
              <Input name="meetingTime" type="time" />
            </Field>
            <Field label="Dirección" className="sm:col-span-2">
              <Input name="address" />
            </Field>
            <Field label="Fecha de creación">
              <Input name="foundedAt" type="date" />
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" className="w-full">
                Crear célula
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
