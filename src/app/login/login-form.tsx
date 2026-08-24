"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input, Field } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function LoginForm({ callbackUrl, error }: { callbackUrl?: string; error?: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(
    error ? "Correo o contraseña incorrectos." : null
  );

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        setFormError(null);
        startTransition(async () => {
          const res = await signIn("credentials", {
            email: form.get("email"),
            password: form.get("password"),
            redirect: false,
          });
          if (res?.error) {
            setFormError("Correo o contraseña incorrectos.");
          } else {
            router.push(callbackUrl || "/");
            router.refresh();
          }
        });
      }}
    >
      <Field label="Correo electrónico" required>
        <Input name="email" type="email" required placeholder="lider@macrosantidad.org" className="bg-white" />
      </Field>
      <Field label="Contraseña" required>
        <Input name="password" type="password" required placeholder="••••••••" className="bg-white" />
      </Field>
      {formError && (
        <p className="rounded-lg bg-brand-950/40 px-3 py-2 text-sm text-brand-300">{formError}</p>
      )}
      <Button type="submit" disabled={pending} className="w-full" size="lg">
        {pending ? "Ingresando..." : "Ingresar"}
      </Button>
      <div className="rounded-lg bg-ink-800/60 px-3 py-2 text-xs text-ink-400">
        Demo: <span className="text-ink-200">admin@macrosantidad.org</span> /{" "}
        <span className="text-ink-200">MacroSantidad2026</span>
      </div>
    </form>
  );
}
