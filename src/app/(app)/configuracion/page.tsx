import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getEncounterRequirements } from "@/lib/business";
import { updateSystemSetting } from "@/actions/users";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

async function saveRequirements(formData: FormData) {
  "use server";
  await updateSystemSetting("encounter_requirements", {
    minMonths: Number(formData.get("minMonths")),
    minPreEncounterClasses: Number(formData.get("minPreEncounterClasses")),
    minAttendancePercent: Number(formData.get("minAttendancePercent")),
  });
}

export default async function ConfiguracionPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/");

  const [requirements, stages] = await Promise.all([getEncounterRequirements(), prisma.processStage.findMany({ orderBy: { order: "asc" } })]);

  return (
    <div className="space-y-6">
      <PageHeader title="Configuración" subtitle="Motor de requisitos, etapas del proceso y parámetros del sistema." />

      <Card>
        <CardHeader>
          <CardTitle>Motor de requisitos — Encuentro</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveRequirements} className="grid gap-4 sm:grid-cols-3">
            <Field label="Antigüedad mínima (meses)">
              <Input name="minMonths" type="number" defaultValue={requirements.minMonths} />
            </Field>
            <Field label="Clases de Pre-Encuentro">
              <Input name="minPreEncounterClasses" type="number" defaultValue={requirements.minPreEncounterClasses} />
            </Field>
            <Field label="% Asistencia mínima">
              <Input name="minAttendancePercent" type="number" defaultValue={requirements.minAttendancePercent} />
            </Field>
            <div className="sm:col-span-3">
              <Button type="submit">Guardar requisitos</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Etapas del proceso (Timeline)</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-1">
            {stages.map((s) => (
              <li key={s.id} className="flex items-center gap-2 text-sm text-ink-700">
                <span className="font-display font-bold text-brand-600">{s.order}.</span> {s.name}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
