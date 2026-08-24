import { prisma } from "@/lib/prisma";
import { createDiscipleshipSession } from "@/actions/discipleship";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PeoplePicker } from "@/components/people-picker";
import { fullName } from "@/lib/utils";

export default async function NewDiscipleshipSessionPage({
  searchParams,
}: {
  searchParams: Promise<{ discipleId?: string; backTo?: string }>;
}) {
  const sp = await searchParams;
  const [tools, disciple] = await Promise.all([
    prisma.discipleshipTool.findMany({ where: { active: true }, orderBy: [{ category: "asc" }, { name: "asc" }] }),
    sp.discipleId ? prisma.person.findUnique({ where: { id: sp.discipleId } }) : null,
  ]);

  const grouped = tools.reduce<Record<string, typeof tools>>((acc, t) => {
    (acc[t.category] ??= []).push(t);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Nueva sesión de discipulado" />

      <Card>
        <CardContent>
          <form action={createDiscipleshipSession} className="space-y-4">
            {sp.backTo && <input type="hidden" name="backTo" value={sp.backTo} />}
            <PeoplePicker
              name="discipleId"
              label="Discípulo"
              initial={disciple ? { id: disciple.id, name: fullName(disciple), photoUrl: disciple.photoUrl } : null}
            />
            <PeoplePicker name="mentorId" label="Líder / Mentor" placeholder="Buscar mentor..." />
            <Field label="Tema" required>
              <Input name="topic" required />
            </Field>
            <Field label="Situación">
              <Textarea name="situation" />
            </Field>
            <Field label="Objetivo">
              <Input name="objective" />
            </Field>
            <Field label="Conversación">
              <Textarea name="conversation" />
            </Field>
            <Field label="Compromisos">
              <Textarea name="commitments" />
            </Field>
            <Field label="Próximo paso">
              <Input name="nextStep" />
            </Field>
            <Field label="Fecha de seguimiento">
              <Input name="followUpDate" type="date" />
            </Field>
            <Field label="Observaciones privadas">
              <Textarea name="privateNotes" />
            </Field>

            <div>
              <span className="mb-2 block text-sm font-medium text-ink-700">Herramientas cristianas utilizadas</span>
              <div className="max-h-64 space-y-3 overflow-y-auto rounded-xl border border-ink-100 p-3">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <p className="mb-1 text-xs font-semibold tracking-wide text-ink-500 uppercase">{category}</p>
                    <div className="grid grid-cols-2 gap-1">
                      {items.map((t) => (
                        <label key={t.id} className="flex items-center gap-2 text-sm text-ink-700">
                          <input type="checkbox" name="toolIds" value={t.id} className="rounded" />
                          {t.name}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full">
              Guardar sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
