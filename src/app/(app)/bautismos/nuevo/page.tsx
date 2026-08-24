import { createBaptismStandalone } from "@/actions/cardex";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PeoplePicker } from "@/components/people-picker";

export default function NewBaptismPage() {
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Registrar bautismo" />
      <Card>
        <CardContent>
          <form action={createBaptismStandalone} className="space-y-4">
            <PeoplePicker name="personId" label="Persona" placeholder="Buscar persona..." />
            <Field label="Fecha" required>
              <Input name="date" type="date" required />
            </Field>
            <Field label="Lugar">
              <Input name="place" />
            </Field>
            <Field label="Responsable">
              <Input name="responsibleName" />
            </Field>
            <Field label="Observaciones">
              <Textarea name="notes" />
            </Field>
            <Button type="submit" className="w-full">
              Guardar bautismo
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
