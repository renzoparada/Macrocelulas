import { createEncounter } from "@/actions/encounters";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default function NewEncounterPage() {
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Nuevo Encuentro" />
      <Card>
        <CardContent>
          <form action={createEncounter} className="space-y-4">
            <Field label="Tipo">
              <Select name="type" defaultValue="ENCUENTRO">
                <option value="ENCUENTRO">Encuentro</option>
                <option value="RE_ENCUENTRO">Re-Encuentro</option>
                <option value="ENCUENTRO_RESCATE">Encuentro de Rescate</option>
                <option value="RETIRO_LIDERAZGO">Retiro de Liderazgo</option>
                <option value="RETIRO_FAMILIAR">Retiro Familiar</option>
                <option value="RETIRO_JUVENIL">Retiro Juvenil</option>
                <option value="OTRO">Otro</option>
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
            <Field label="Cupo">
              <Input name="capacity" type="number" />
            </Field>
            <Field label="Responsable">
              <Input name="responsibleName" />
            </Field>
            <Field label="Requisitos">
              <Textarea name="requirements" />
            </Field>
            <Button type="submit" className="w-full">
              Crear encuentro
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
