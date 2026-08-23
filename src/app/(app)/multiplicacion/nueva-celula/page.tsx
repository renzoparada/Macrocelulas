import { prisma } from "@/lib/prisma";
import { registerNewCell } from "@/actions/leadership";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PeoplePicker } from "@/components/people-picker";

export default async function NewCellFromMultiplicationPage() {
  const [cells, macroCells] = await Promise.all([
    prisma.cell.findMany({ select: { id: true, number: true, name: true }, orderBy: { number: "asc" } }),
    prisma.macroCell.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Registrar nueva célula por multiplicación" />
      <Card>
        <CardContent>
          <form action={registerNewCell} className="space-y-4">
            <Field label="Número" required>
              <Input name="number" required />
            </Field>
            <Field label="Nombre" required>
              <Input name="name" required />
            </Field>
            <Field label="Célula madre (opcional)">
              <Select name="parentCellId" defaultValue="">
                <option value="">Ninguna</option>
                {cells.map((c) => (
                  <option key={c.id} value={c.id}>
                    C{c.number} — {c.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Macro Célula (si no hay célula madre)">
              <Select name="macroCellId" defaultValue="">
                <option value="">Seleccionar...</option>
                {macroCells.map((mc) => (
                  <option key={mc.id} value={mc.id}>
                    {mc.name}
                  </option>
                ))}
              </Select>
            </Field>
            <PeoplePicker name="newLeaderId" label="Nuevo líder que envía" />
            <Button type="submit" className="w-full">
              Crear célula
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
