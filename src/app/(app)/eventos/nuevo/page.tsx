import { prisma } from "@/lib/prisma";
import { createEvent } from "@/actions/events";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { EVENT_TYPES } from "@/lib/constants";

export default async function NewEventPage() {
  const cells = await prisma.cell.findMany({ orderBy: { number: "asc" }, select: { id: true, number: true, name: true } });

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Nuevo evento" />
      <Card>
        <CardContent>
          <form action={createEvent} className="space-y-4">
            <Field label="Tipo">
              <Select name="type" defaultValue={EVENT_TYPES[0]}>
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Nombre" required>
              <Input name="name" required />
            </Field>
            <Field label="Fecha" required>
              <Input name="date" type="date" required />
            </Field>
            <Field label="Célula (opcional)">
              <Select name="cellId" defaultValue="">
                <option value="">General</option>
                {cells.map((c) => (
                  <option key={c.id} value={c.id}>
                    C{c.number} — {c.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Objetivo">
              <Input name="objective" />
            </Field>
            <Field label="Responsable">
              <Input name="responsibleName" />
            </Field>
            <Button type="submit" className="w-full">
              Crear evento
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
