import { createCongress } from "@/actions/retreats";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default function NewCongressPage() {
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Nuevo congreso" />
      <Card>
        <CardContent>
          <form action={createCongress} className="space-y-4">
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
              Crear congreso
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
