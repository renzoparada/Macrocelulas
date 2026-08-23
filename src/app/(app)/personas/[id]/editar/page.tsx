import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { updatePerson, changePersonCell } from "@/actions/people";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export default async function EditPersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [person, cells] = await Promise.all([
    prisma.person.findUnique({ where: { id } }),
    prisma.cell.findMany({ orderBy: { number: "asc" }, select: { id: true, number: true, name: true } }),
  ]);
  if (!person) notFound();

  const action = updatePerson.bind(null, id);
  const cellAction = changePersonCell.bind(null, id);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader title="Editar persona" subtitle={`${person.firstName} ${person.lastNamePaternal}`} />

      <form action={action} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Identidad</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nombre" required>
              <Input name="firstName" defaultValue={person.firstName} required />
            </Field>
            <Field label="Apellido paterno" required>
              <Input name="lastNamePaternal" defaultValue={person.lastNamePaternal} required />
            </Field>
            <Field label="Apellido materno">
              <Input name="lastNameMaternal" defaultValue={person.lastNameMaternal ?? ""} />
            </Field>
            <Field label="Fecha de nacimiento">
              <Input name="birthDate" type="date" defaultValue={person.birthDate ? new Date(person.birthDate).toISOString().slice(0, 10) : ""} />
            </Field>
            <Field label="Sexo">
              <Select name="sex" defaultValue={person.sex ?? ""}>
                <option value="">Seleccionar...</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMENINO">Femenino</option>
              </Select>
            </Field>
            <Field label="Documento">
              <Input name="documentId" defaultValue={person.documentId ?? ""} />
            </Field>
            <Field label="Foto (URL)">
              <Input name="photoUrl" defaultValue={person.photoUrl ?? ""} />
            </Field>
            <Field label="Estado">
              <Select name="status" defaultValue={person.status}>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
                <option value="EN_RIESGO">En riesgo</option>
                <option value="RETIRADO">Retirado</option>
              </Select>
            </Field>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contacto</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Teléfono">
              <Input name="phone" defaultValue={person.phone ?? ""} />
            </Field>
            <Field label="WhatsApp">
              <Input name="whatsapp" defaultValue={person.whatsapp ?? ""} />
            </Field>
            <Field label="Email">
              <Input name="email" defaultValue={person.email ?? ""} />
            </Field>
            <Field label="Redes sociales">
              <Input name="socialMedia" defaultValue={person.socialMedia ?? ""} />
            </Field>
            <Field label="Dirección" className="sm:col-span-2">
              <Textarea name="address" defaultValue={person.address ?? ""} rows={2} />
            </Field>
            <Field label="Ciudad">
              <Input name="city" defaultValue={person.city ?? ""} />
            </Field>
            <Field label="Zona">
              <Input name="zone" defaultValue={person.zone ?? ""} />
            </Field>
            <Field label="Ocupación">
              <Input name="occupation" defaultValue={person.occupation ?? ""} />
            </Field>
            <Field label="Empresa">
              <Input name="company" defaultValue={person.company ?? ""} />
            </Field>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" size="lg">
            Guardar cambios
          </Button>
        </div>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Cambiar de célula</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={cellAction} className="grid gap-4 sm:grid-cols-2">
            <Field label="Nueva célula">
              <Select name="cellId" defaultValue="" required>
                <option value="">Seleccionar célula...</option>
                {cells
                  .filter((c) => c.id !== person.currentCellId)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      C{c.number} — {c.name}
                    </option>
                  ))}
              </Select>
            </Field>
            <Field label="Motivo del cambio">
              <Input name="reason" />
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit" variant="outline">
                Registrar cambio de célula
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
