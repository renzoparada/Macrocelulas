import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/page-header";
import { Field, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PeoplePicker } from "@/components/people-picker";
import { addFamilyRelationship } from "@/actions/cardex";
import Link from "next/link";
import { fullName } from "@/lib/utils";
import type { CardexPerson } from "@/lib/cardex-query";

const RELATION_LABELS: Record<string, string> = {
  CONYUGE: "Cónyuge",
  HIJO: "Hijo/a",
  PADRE: "Padre",
  MADRE: "Madre",
  HERMANO: "Hermano/a",
  OTRO: "Otro",
};

export function TabFamilia({ person }: { person: CardexPerson }) {
  const addRelation = addFamilyRelationship.bind(null, person.id);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Familia registrada</CardTitle>
        </CardHeader>
        <CardContent>
          {person.familyMemberships.length === 0 ? (
            <EmptyState title="Sin familiares registrados" />
          ) : (
            <ul className="space-y-2">
              {person.familyMemberships.map((rel) => (
                <li key={rel.id} className="flex items-center justify-between rounded-lg border border-ink-100 px-3 py-2">
                  <Link href={`/personas/${rel.relatedPerson.id}`} className="font-medium text-ink-800 hover:text-brand-700">
                    {fullName(rel.relatedPerson)}
                  </Link>
                  <span className="text-xs text-ink-400 uppercase">{RELATION_LABELS[rel.relationType] ?? rel.relationType}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agregar familiar</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={addRelation} className="space-y-4">
            <PeoplePicker name="relatedPersonId" label="Familiar" placeholder="Buscar persona..." />
            <Field label="Relación">
              <Select name="relationType" defaultValue="CONYUGE">
                {Object.entries(RELATION_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </Select>
            </Field>
            <Button type="submit" className="w-full">
              Guardar relación
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
