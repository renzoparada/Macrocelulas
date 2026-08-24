"use client";

import { useActionState } from "react";
import { registerWithInvite } from "@/actions/invites";
import { Input, Field } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function RegisterForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(registerWithInvite.bind(null, token), null);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Nombre completo" required>
        <Input name="name" required placeholder="Tu nombre" className="bg-white" />
      </Field>
      <Field label="Correo electrónico" required>
        <Input name="email" type="email" required placeholder="tucorreo@ejemplo.com" className="bg-white" />
      </Field>
      <Field label="Contraseña" required hint="Al menos 8 caracteres.">
        <Input name="password" type="password" required minLength={8} placeholder="••••••••" className="bg-white" />
      </Field>
      {state?.error && (
        <p className="rounded-lg bg-brand-950/40 px-3 py-2 text-sm text-brand-300">{state.error}</p>
      )}
      <Button type="submit" disabled={pending} className="w-full" size="lg">
        {pending ? "Creando cuenta..." : "Crear cuenta e ingresar"}
      </Button>
    </form>
  );
}
