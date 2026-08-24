import { registerMultiplicationStep } from "@/actions/leadership";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PeoplePicker } from "@/components/people-picker";
import { prisma } from "@/lib/prisma";
import { fullName } from "@/lib/utils";

export default async function NewMultiplicationStepPage({ searchParams }: { searchParams: Promise<{ discipleId?: string }> }) {
  const sp = await searchParams;
  const disciple = sp.discipleId ? await prisma.person.findUnique({ where: { id: sp.discipleId } }) : null;

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Registrar paso de multiplicación" />
      <Card>
        <CardContent>
          <form action={registerMultiplicationStep} className="space-y-4">
            <PeoplePicker
              name="discipleId"
              label="Discípulo que avanza"
              initial={disciple ? { id: disciple.id, name: fullName(disciple), photoUrl: disciple.photoUrl } : null}
            />
            <PeoplePicker name="leaderId" label="Líder que lo formó" />
            <Field label="Nueva etapa">
              <Select name="stage" defaultValue="LIDER_EN_FORMACION">
                <option value="LIDER_EN_FORMACION">Líder en formación</option>
                <option value="CO_LIDER">Co-líder</option>
                <option value="LIDER">Líder</option>
                <option value="NUEVA_CELULA">Multiplicación / Nueva célula</option>
              </Select>
            </Field>
            <Field label="Notas">
              <Textarea name="notes" />
            </Field>
            <Button type="submit" className="w-full">
              Registrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
