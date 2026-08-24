import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { registerAcceptedJesus, registerFirstCellVisit } from "@/actions/cardex";
import { formatDate, fullName } from "@/lib/utils";
import Link from "next/link";
import type { CardexPerson } from "@/lib/cardex-query";
import { CheckCircle2 } from "lucide-react";

export function TabGanar({ person }: { person: CardexPerson }) {
  const acceptAction = registerAcceptedJesus.bind(null, person.id);
  const firstVisitAction = registerFirstCellVisit.bind(null, person.id);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>¿Cuándo aceptó a Jesús?</CardTitle>
          {person.acceptedJesus && <Badge variant="green"><CheckCircle2 className="h-3 w-3" /> Registrado</Badge>}
        </CardHeader>
        <CardContent>
          <form action={acceptAction} className="space-y-4">
            <Field label="Fecha" required>
              <Input
                name="date"
                type="date"
                required
                defaultValue={person.acceptedJesus ? new Date(person.acceptedJesus.date).toISOString().slice(0, 10) : ""}
              />
            </Field>
            <Field label="Lugar">
              <Input name="place" defaultValue={person.acceptedJesus?.place ?? ""} />
            </Field>
            <Field label="Quién acompañó">
              <Input name="accompaniedBy" defaultValue={person.acceptedJesus?.accompaniedBy ?? ""} />
            </Field>
            <Field label="Testimonio (opcional)">
              <Textarea name="testimony" defaultValue={person.acceptedJesus?.testimony ?? ""} />
            </Field>
            <Field label="Observaciones">
              <Textarea name="notes" defaultValue={person.acceptedJesus?.notes ?? ""} />
            </Field>
            {!person.acceptedJesus && (
              <label className="flex items-center gap-2 text-sm text-ink-600">
                <input type="checkbox" name="moveStage" value="yes" defaultChecked className="rounded" />
                Mover etapa actual a &quot;Aceptó a Jesús&quot;
              </label>
            )}
            <Button type="submit" className="w-full">
              Guardar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Primera vez en célula</CardTitle>
          {person.firstCellVisit && <Badge variant="green"><CheckCircle2 className="h-3 w-3" /> Registrado</Badge>}
        </CardHeader>
        <CardContent>
          <form action={firstVisitAction} className="space-y-4">
            <Field label="Fecha" required>
              <Input
                name="date"
                type="date"
                required
                defaultValue={person.firstCellVisit ? new Date(person.firstCellVisit.date).toISOString().slice(0, 10) : ""}
              />
            </Field>
            <Field label="Célula">
              <Input name="cellName" defaultValue={person.firstCellVisit?.cellName ?? person.currentCell?.name ?? ""} />
            </Field>
            <Field label="Líder">
              <Input name="leaderName" defaultValue={person.firstCellVisit?.leaderName ?? ""} />
            </Field>
            <Field label="Quién lo llevó">
              <Input name="broughtBy" defaultValue={person.firstCellVisit?.broughtBy ?? ""} />
            </Field>
            <Field label="Observaciones">
              <Textarea name="notes" defaultValue={person.firstCellVisit?.notes ?? ""} />
            </Field>
            <Button type="submit" className="w-full">
              Guardar
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quién lo invitó</CardTitle>
        </CardHeader>
        <CardContent>
          {person.invitedBy ? (
            <Link href={`/personas/${person.invitedBy.id}`} className="font-medium text-brand-700 hover:underline">
              {fullName(person.invitedBy)}
            </Link>
          ) : (
            <p className="text-sm text-ink-400">No se registró quién lo invitó.</p>
          )}
          {person.howArrived && <p className="mt-2 text-sm text-ink-500">Cómo llegó: {person.howArrived.replaceAll("_", " ")}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personas que ha invitado ({person.invitedPeople.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {person.invitedPeople.length === 0 ? (
            <p className="text-sm text-ink-400">Todavía no ha invitado a nadie.</p>
          ) : (
            <ul className="space-y-2">
              {person.invitedPeople.map((p) => (
                <li key={p.id} className="flex items-center justify-between">
                  <Link href={`/personas/${p.id}`} className="font-medium text-ink-800 hover:text-brand-700">
                    {fullName(p)}
                  </Link>
                  <span className="text-xs text-ink-400">{formatDate(p.registeredAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
