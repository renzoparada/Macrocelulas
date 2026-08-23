import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Textarea, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/page-header";
import { createPrayerRequest } from "@/actions/prayer";
import { PRAYER_CATEGORIES } from "@/lib/constants";
import { formatDate, daysBetween } from "@/lib/utils";
import type { CardexPerson } from "@/lib/cardex-query";
import Link from "next/link";

const PRIORITY_VARIANT: Record<string, "red" | "yellow" | "default"> = {
  URGENTE: "red",
  IMPORTANTE: "yellow",
  NORMAL: "default",
};

export function TabOracion({ person }: { person: CardexPerson }) {
  const active = person.prayerRequests.filter((p) => p.status === "ACTIVO");
  const resolved = person.prayerRequests.filter((p) => p.status === "RESUELTO");

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>🙏 Motivos activos ({active.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {active.length === 0 ? (
            <EmptyState title="Sin motivos activos" />
          ) : (
            <ul className="space-y-2">
              {active.map((p) => (
                <li key={p.id} className="rounded-lg border border-ink-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink-800">{p.motivo}</span>
                    <Badge variant={PRIORITY_VARIANT[p.priority]}>{p.priority}</Badge>
                  </div>
                  <p className="text-xs text-ink-400">
                    {p.category} · Desde {formatDate(p.startDate)} ({daysBetween(p.startDate)} días)
                  </p>
                  <Link href={`/oracion/${p.id}`} className="mt-1 inline-block text-xs font-semibold text-brand-700 hover:underline">
                    Ver detalle →
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Nuevo motivo de oración</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPrayerRequest} className="space-y-4">
            <input type="hidden" name="personId" value={person.id} />
            <input type="hidden" name="backTo" value={`/personas/${person.id}`} />
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
            <label className="flex items-center gap-2 text-sm text-ink-600">
              <input type="checkbox" name="isPrivate" className="rounded" />
              Motivo privado (solo usuarios autorizados)
            </label>
            <Button type="submit" variant="gold" className="w-full">
              Registrar motivo
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Motivos resueltos ({resolved.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {resolved.length === 0 ? (
            <EmptyState title="Sin motivos resueltos todavía" />
          ) : (
            <ul className="space-y-2">
              {resolved.map((p) => (
                <li key={p.id} className="rounded-lg border border-emerald-100 bg-emerald-50/40 p-3">
                  <span className="text-sm font-semibold text-ink-800">✨ {p.motivo}</span>
                  <p className="text-xs text-ink-400">Resuelto: {formatDate(p.resolvedDate)}</p>
                  {p.resolution && <p className="mt-1 text-sm text-ink-600">{p.resolution.response}</p>}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
