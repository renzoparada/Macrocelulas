import { prisma } from "@/lib/prisma";
import { createPerson } from "@/actions/people";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PeoplePicker } from "@/components/people-picker";
import { HOW_ARRIVED_OPTIONS } from "@/lib/constants";

export default async function NewPersonPage() {
  const cells = await prisma.cell.findMany({ orderBy: { number: "asc" }, select: { id: true, number: true, name: true } });

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Nueva persona" subtitle="Registrar la ficha personal — el primer paso de GANAR." />

      <form action={createPerson} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Identidad</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nombre" required>
              <Input name="firstName" required />
            </Field>
            <Field label="Apellido paterno" required>
              <Input name="lastNamePaternal" required />
            </Field>
            <Field label="Apellido materno">
              <Input name="lastNameMaternal" />
            </Field>
            <Field label="Fecha de nacimiento">
              <Input name="birthDate" type="date" />
            </Field>
            <Field label="Sexo">
              <Select name="sex" defaultValue="">
                <option value="">Seleccionar...</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
              </Select>
            </Field>
            <Field label="Documento">
              <Input name="documentId" />
            </Field>
            <Field label="Foto (URL)">
              <Input name="photoUrl" placeholder="https://..." />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Teléfono">
              <Input name="phone" />
            </Field>
            <Field label="WhatsApp">
              <Input name="whatsapp" />
            </Field>
            <Field label="Email">
              <Input name="email" type="email" />
            </Field>
            <Field label="Redes sociales">
              <Input name="socialMedia" />
            </Field>
            <Field label="Dirección" className="sm:col-span-2">
              <Textarea name="address" rows={2} />
            </Field>
            <Field label="Ciudad">
              <Input name="city" />
            </Field>
            <Field label="Zona">
              <Input name="zone" />
            </Field>
            <Field label="Ocupación">
              <Input name="occupation" />
            </Field>
            <Field label="Empresa">
              <Input name="company" />
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Origen — ¿Cómo llegó?</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="¿Cómo llegó?">
              <Select name="howArrived" defaultValue="">
                <option value="">Seleccionar...</option>
                {HOW_ARRIVED_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Detalle de origen" hint="Ej: nombre del evento o campaña">
              <Input name="originDetail" />
            </Field>
            <div className="sm:col-span-2">
              <PeoplePicker name="invitedById" label="¿Quién lo invitó?" placeholder="Buscar persona que invitó..." />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Célula</CardTitle>
          </CardHeader>
          <CardContent>
            <Field label="Asignar a célula">
              <Select name="currentCellId" defaultValue="">
                <option value="">Sin asignar todavía</option>
                {cells.map((c) => (
                  <option key={c.id} value={c.id}>
                    C{c.number} — {c.name}
                  </option>
                ))}
              </Select>
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="submit" size="lg">
            Guardar persona
          </Button>
        </div>
      </form>
    </div>
  );
}
