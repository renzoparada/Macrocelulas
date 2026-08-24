import { createRetreat } from "@/actions/retreats";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { RETREAT_TYPES } from "@/lib/constants";

export default function NewRetreatPage() {
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Nuevo retiro" />
      <Card>
        <CardContent>
          <form action={createRetreat} className="space-y-4">
            <Field label="Tipo">
              <Select name="retreatTypeName" defaultValue={RETREAT_TYPES[0]}>
                {RETREAT_TYPES.map((t) => (
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
            <Field label="Lugar">
              <Input name="place" />
            </Field>
            <Button type="submit" className="w-full">
              Crear retiro
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
