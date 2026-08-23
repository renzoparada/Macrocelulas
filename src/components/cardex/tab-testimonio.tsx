import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/page-header";
import { addTestimonial } from "@/actions/cardex";
import { formatDate } from "@/lib/utils";
import type { CardexPerson } from "@/lib/cardex-query";

export function TabTestimonio({ person }: { person: CardexPerson }) {
  const action = addTestimonial.bind(null, person.id);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Testimonios registrados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {person.testimonials.length === 0 ? (
            <EmptyState title="Sin testimonios registrados" />
          ) : (
            person.testimonials.map((t) => (
              <div key={t.id} className="rounded-lg border border-ink-100 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink-400">{formatDate(t.date)}</span>
                  <div className="flex gap-1">
                    {t.authorizedToShare ? (
                      <Badge variant="green">Autorizado para publicar</Badge>
                    ) : (
                      <Badge variant="default">Privado</Badge>
                    )}
                  </div>
                </div>
                {t.before && <p className="mt-2 text-sm"><strong>Antes:</strong> {t.before}</p>}
                {t.process && <p className="text-sm"><strong>Proceso:</strong> {t.process}</p>}
                {t.after && <p className="text-sm"><strong>Después:</strong> {t.after}</p>}
                {t.whatGodDid && <p className="mt-1 text-sm text-brand-700"><strong>Lo que Dios hizo:</strong> {t.whatGodDid}</p>}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mi testimonio</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <Field label="Antes — ¿Qué estaba viviendo?">
              <Textarea name="before" />
            </Field>
            <Field label="Proceso — ¿Qué ocurrió?">
              <Textarea name="process" />
            </Field>
            <Field label="Después — ¿Qué cambió?">
              <Textarea name="after" />
            </Field>
            <Field label="Lo que Dios hizo">
              <Textarea name="whatGodDid" />
            </Field>
            <label className="flex items-center gap-2 text-sm text-ink-600">
              <input type="checkbox" name="isPublic" className="rounded" />
              Testimonio público
            </label>
            <label className="flex items-center gap-2 text-sm text-ink-600">
              <input type="checkbox" name="authorizedToShare" className="rounded" />
              Autorización para compartir
            </label>
            <p className="text-xs text-ink-400">No se publica automáticamente.</p>
            <Button type="submit" className="w-full">
              Guardar testimonio
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
