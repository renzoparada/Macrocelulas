import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/page-header";
import { createTask, updateTaskStatus } from "@/actions/tasks";
import { TASK_TYPES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { CardexPerson } from "@/lib/cardex-query";

const STATUS_VARIANT: Record<string, "default" | "yellow" | "green" | "red"> = {
  PENDIENTE: "yellow",
  EN_PROCESO: "default",
  COMPLETADA: "green",
  CANCELADA: "red",
};

export function TabSeguimiento({ person }: { person: CardexPerson }) {
  const addTask = createTask.bind(null, person.id);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Tareas de seguimiento</CardTitle>
        </CardHeader>
        <CardContent>
          {person.tasks.length === 0 ? (
            <EmptyState title="Sin tareas registradas" />
          ) : (
            <ul className="space-y-2">
              {person.tasks.map((t) => (
                <li key={t.id} className="rounded-lg border border-ink-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink-800">{TASK_TYPES.find((x) => x.value === t.type)?.label ?? t.type}</span>
                    <Badge variant={STATUS_VARIANT[t.status]}>{t.status.replaceAll("_", " ")}</Badge>
                  </div>
                  {t.dueDate && <p className="text-xs text-ink-400">Vence: {formatDate(t.dueDate)}</p>}
                  {t.notes && <p className="mt-1 text-sm text-ink-600">{t.notes}</p>}
                  {t.status !== "COMPLETADA" && (
                    <form action={updateTaskStatus.bind(null, t.id, person.id, "COMPLETADA")} className="mt-2">
                      <Button type="submit" size="sm" variant="outline">
                        Marcar como completada
                      </Button>
                    </form>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nueva tarea</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addTask} className="space-y-4">
            <Field label="Tipo">
              <Select name="type" defaultValue="SEGUIMIENTO">
                {TASK_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Fecha límite">
              <Input name="dueDate" type="date" />
            </Field>
            <Field label="Notas">
              <Textarea name="notes" />
            </Field>
            <Button type="submit" className="w-full">
              Registrar tarea
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
