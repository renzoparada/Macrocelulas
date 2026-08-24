import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Textarea, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/page-header";
import { addDevelopmentPlan } from "@/actions/discipleship";
import { updateLeadershipDevelopment } from "@/actions/leadership";
import type { CardexPerson } from "@/lib/cardex-query";

export function TabEntrenar({ person }: { person: CardexPerson }) {
  const addPlan = addDevelopmentPlan.bind(null, person.id);
  const updateLeadership = updateLeadershipDevelopment.bind(null, person.id);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Clases, cursos y formación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 space-y-2">
            {person.developmentPlans.length === 0 ? (
              <EmptyState title="Sin planes registrados" />
            ) : (
              person.developmentPlans.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-ink-100 px-3 py-2">
                  <div>
                    <p className="text-sm font-medium text-ink-800">{p.title}</p>
                    <p className="text-xs text-ink-400">{p.category}</p>
                  </div>
                  <Badge variant={p.status === "COMPLETADO" ? "green" : "yellow"}>{p.status.replaceAll("_", " ")}</Badge>
                </div>
              ))
            )}
          </div>
          <form action={addPlan} className="space-y-3 border-t border-ink-100 pt-4">
            <Field label="Título" required>
              <Input name="title" required />
            </Field>
            <Field label="Categoría">
              <Select name="category" defaultValue="Formación">
                <option value="Clase">Clase</option>
                <option value="Curso">Curso</option>
                <option value="Formación">Formación</option>
                <option value="Liderazgo">Liderazgo</option>
              </Select>
            </Field>
            <Field label="Notas">
              <Textarea name="notes" />
            </Field>
            <Button type="submit" className="w-full">
              Registrar plan
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Desarrollo de liderazgo</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateLeadership} className="space-y-4">
            <Field label="Fecha de inicio como líder">
              <Input
                name="startDate"
                type="date"
                defaultValue={person.leadershipDevelopment?.startDate ? new Date(person.leadershipDevelopment.startDate).toISOString().slice(0, 10) : ""}
              />
            </Field>
            <Field label="Fortalezas de liderazgo">
              <Textarea name="strengths" defaultValue={person.leadershipDevelopment?.strengths ?? ""} />
            </Field>
            <Field label="Áreas de crecimiento">
              <Textarea name="growthAreas" defaultValue={person.leadershipDevelopment?.growthAreas ?? ""} />
            </Field>
            <Field label="Notas">
              <Textarea name="notes" defaultValue={person.leadershipDevelopment?.notes ?? ""} />
            </Field>
            <Button type="submit" className="w-full">
              Guardar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
