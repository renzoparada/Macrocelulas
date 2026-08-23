import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createUser } from "@/actions/users";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/lib/permissions";
import type { RoleKey } from "@/generated/prisma/client";

export default async function NewUserPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/");

  const macroCells = await prisma.macroCell.findMany({ select: { id: true, name: true } });

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="Nuevo usuario" />
      <Card>
        <CardContent>
          <form action={createUser} className="space-y-4">
            <Field label="Nombre completo" required>
              <Input name="name" required />
            </Field>
            <Field label="Correo electrónico" required>
              <Input name="email" type="email" required />
            </Field>
            <Field label="Contraseña" required>
              <Input name="password" type="password" required minLength={8} />
            </Field>
            <Field label="Rol" required>
              <Select name="roleKey" required defaultValue="">
                <option value="" disabled>
                  Seleccionar...
                </option>
                {(Object.keys(ROLE_LABELS) as RoleKey[]).map((k) => (
                  <option key={k} value={k}>
                    {ROLE_LABELS[k]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Macro Célula (para Líder Macro)">
              <Select name="macroCellId" defaultValue="">
                <option value="">Ninguna</option>
                {macroCells.map((mc) => (
                  <option key={mc.id} value={mc.id}>
                    {mc.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Button type="submit" className="w-full">
              Crear usuario
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
