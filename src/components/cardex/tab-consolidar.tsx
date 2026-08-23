import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Textarea, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClassToggleGroup } from "@/components/cardex/class-toggle-group";
import { registerBaptism, updateChurchAttendance, togglePreEncounterClass, togglePostEncounterClass } from "@/actions/cardex";
import { getEncounterEligibility } from "@/lib/business";
import { formatDate } from "@/lib/utils";
import type { CardexPerson } from "@/lib/cardex-query";
import { CheckCircle2, XCircle } from "lucide-react";

export async function TabConsolidar({ person }: { person: CardexPerson }) {
  const eligibility = await getEncounterEligibility(person.id);
  const preMap = Object.fromEntries(person.preEncounterClasses.map((c) => [c.classNumber, c.completed]));
  const postMap = Object.fromEntries(person.postEncounterClasses.map((c) => [c.classNumber, c.completed]));

  const togglePre = togglePreEncounterClass.bind(null, person.id);
  const togglePost = togglePostEncounterClass.bind(null, person.id);
  const baptismAction = registerBaptism.bind(null, person.id);
  const churchAction = updateChurchAttendance.bind(null, person.id);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Motor de requisitos — Encuentro</CardTitle>
          {eligibility.cumple ? (
            <Badge variant="green">
              <CheckCircle2 className="h-3 w-3" /> CUMPLE
            </Badge>
          ) : (
            <Badge variant="red">
              <XCircle className="h-3 w-3" /> NO CUMPLE
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p className="text-ink-600">
            Antigüedad: <strong>{eligibility.antiguedadMeses} meses</strong> {eligibility.cumpleAntiguedad ? "✅" : "❌"}
          </p>
          <p className="text-ink-600">
            Pre-Encuentro: <strong>{eligibility.preEncounterCompletadas}/4</strong> {eligibility.cumplePreEncuentro ? "✅" : "❌"}
          </p>
          <p className="text-ink-600">
            Asistencia (90 días): <strong>{eligibility.attendancePercent}%</strong> {eligibility.cumpleAsistencia ? "✅" : "❌"}
          </p>
          <p className="text-ink-600">Estado: {eligibility.cumpleEstado ? "✅ Activo" : "❌ No activo"}</p>
          {!eligibility.cumple && (
            <ul className="mt-2 list-inside list-disc text-brand-700">
              {eligibility.faltantes.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pre-Encuentro</CardTitle>
        </CardHeader>
        <CardContent>
          <ClassToggleGroup completedMap={preMap} onToggle={togglePre} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Encuentros</CardTitle>
        </CardHeader>
        <CardContent>
          {person.encounterRegs.length === 0 ? (
            <p className="text-sm text-ink-400">Sin inscripciones a Encuentros.</p>
          ) : (
            <ul className="space-y-2">
              {person.encounterRegs.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-lg border border-ink-100 px-3 py-2 text-sm">
                  <span className="font-medium text-ink-800">{r.encounter.name}</span>
                  <Badge variant={r.attended ? "green" : r.confirmed ? "yellow" : "default"}>
                    {r.attended ? "Asistió" : r.confirmed ? "Confirmado" : "Inscrito"}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Post-Encuentro</CardTitle>
        </CardHeader>
        <CardContent>
          <ClassToggleGroup completedMap={postMap} onToggle={togglePost} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Bautismo</CardTitle>
          {person.baptism && <Badge variant="green"><CheckCircle2 className="h-3 w-3" /> Bautizado</Badge>}
        </CardHeader>
        <CardContent>
          <form action={baptismAction} className="space-y-4">
            <Field label="Fecha" required>
              <Input name="date" type="date" required defaultValue={person.baptism ? new Date(person.baptism.date).toISOString().slice(0, 10) : ""} />
            </Field>
            <Field label="Lugar">
              <Input name="place" defaultValue={person.baptism?.place ?? ""} />
            </Field>
            <Field label="Responsable">
              <Input name="responsibleName" defaultValue={person.baptism?.responsibleName ?? ""} />
            </Field>
            <Field label="Observaciones">
              <Textarea name="notes" defaultValue={person.baptism?.notes ?? ""} />
            </Field>
            <Button type="submit" className="w-full">
              Guardar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Iglesia</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={churchAction} className="space-y-4">
            <label className="flex items-center gap-2 text-sm text-ink-700">
              <input type="checkbox" name="attends" defaultChecked={person.churchAttendance?.attends ?? true} className="rounded" />
              ¿Asiste a la iglesia?
            </label>
            <Field label="Iglesia">
              <Input name="churchName" defaultValue={person.churchAttendance?.churchName ?? ""} />
            </Field>
            <Field label="Congregación">
              <Input name="congregation" defaultValue={person.churchAttendance?.congregation ?? ""} />
            </Field>
            <Field label="Frecuencia">
              <Select name="frequency" defaultValue={person.churchAttendance?.frequency ?? ""}>
                <option value="">Seleccionar...</option>
                <option value="Semanal">Semanal</option>
                <option value="Quincenal">Quincenal</option>
                <option value="Mensual">Mensual</option>
                <option value="Ocasional">Ocasional</option>
              </Select>
            </Field>
            <Field label="Última asistencia">
              <Input
                name="lastAttendance"
                type="date"
                defaultValue={person.churchAttendance?.lastAttendance ? new Date(person.churchAttendance.lastAttendance).toISOString().slice(0, 10) : ""}
              />
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

// Helper preserved for potential reuse
export function formatEncounterDate(d: Date) {
  return formatDate(d);
}
