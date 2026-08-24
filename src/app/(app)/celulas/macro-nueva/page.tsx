import { prisma } from "@/lib/prisma";
import { createMacroCell } from "@/actions/cells";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default async function NewMacroCellPage() {
  const leaders = await prisma.user.findMany({
    where: { role: { key: "LIDER_MACRO" }, active: true },
    select: { id: true, name: true },
  });

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Nueva Macro Célula" />
      <Card>
        <CardContent>
          <form action={createMacroCell} className="space-y-4">
            <Field label="Nombre" required>
              <Input name="name" required />
            </Field>
            <Field label="Líder de Macro Célula">
              <Select name="leaderId" defaultValue="">
                <option value="">Sin asignar</option>
                {leaders.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Descripción">
              <Textarea name="description" />
            </Field>
            <Button type="submit" className="w-full">
              Crear Macro Célula
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
