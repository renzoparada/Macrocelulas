import { createPrayerRequest } from "@/actions/prayer";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Textarea, Select, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PeoplePicker } from "@/components/people-picker";
import { PRAYER_CATEGORIES } from "@/lib/constants";

export default function NewPrayerRequestPage() {
  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Nuevo motivo de oración" />
      <Card>
        <CardContent>
          <form action={createPrayerRequest} className="space-y-4">
            <PeoplePicker name="personId" label="Persona" placeholder="Buscar persona..." />
            <Field label="Motivo" required>
              <Textarea name="motivo" required />
            </Field>
            <Field label="Categoría">
              <Select name="category" defaultValue="Otro">
                {PRAYER_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Prioridad">
              <Select name="priority" defaultValue="NORMAL">
                <option value="URGENTE">🔴 Urgente</option>
                <option value="IMPORTANTE">🟡 Importante</option>
                <option value="NORMAL">⚪ Normal</option>
              </Select>
            </Field>
            <Field label="Responsable">
              <Input name="responsibleName" />
            </Field>
            <Field label="Observaciones">
              <Textarea name="notes" />
            </Field>
            <label className="flex items-center gap-2 text-sm text-ink-600">
              <input type="checkbox" name="isPrivate" className="rounded" />
              Motivo privado (solo usuarios autorizados)
            </label>
            <Button type="submit" variant="gold" size="lg" className="w-full">
              Registrar motivo
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
