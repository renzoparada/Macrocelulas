"use client";

import { useState } from "react";
import { createInvite } from "@/actions/invites";
import { Field, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ROLE_LABELS } from "@/lib/permissions";
import type { RoleKey } from "@/generated/prisma/client";

const ROLE_KEYS = Object.keys(ROLE_LABELS) as RoleKey[];

export function InviteForm({
  cells,
  macroCells,
}: {
  cells: { id: string; number: string; name: string }[];
  macroCells: { id: string; name: string }[];
}) {
  const [roleKey, setRoleKey] = useState<RoleKey | "">("");

  return (
    <form action={createInvite} className="space-y-4">
      <Field label="Rol de la invitación" required>
        <Select
          name="roleKey"
          required
          value={roleKey}
          onChange={(e) => setRoleKey(e.target.value as RoleKey)}
        >
          <option value="" disabled>
            Seleccionar...
          </option>
          {ROLE_KEYS.map((k) => (
            <option key={k} value={k}>
              {ROLE_LABELS[k]}
            </option>
          ))}
        </Select>
      </Field>

      {(roleKey === "LIDER_CELULA" || roleKey === "CO_LIDER") && (
        <Field label="Célula que va a liderar" required hint="Al registrarse quedará asignado automáticamente como líder de esta célula.">
          <Select name="cellId" required defaultValue="">
            <option value="" disabled>
              Seleccionar célula...
            </option>
            {cells.map((c) => (
              <option key={c.id} value={c.id}>
                {c.number} · {c.name}
              </option>
            ))}
          </Select>
        </Field>
      )}

      {roleKey === "LIDER_MACRO" && (
        <Field label="Macro célula que va a liderar" required>
          <Select name="macroCellId" required defaultValue="">
            <option value="" disabled>
              Seleccionar macro célula...
            </option>
            {macroCells.map((mc) => (
              <option key={mc.id} value={mc.id}>
                {mc.name}
              </option>
            ))}
          </Select>
        </Field>
      )}

      <p className="rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-500">
        Se genera un link válido por 7 días. La persona invitada elige su propio correo y
        contraseña al abrirlo — tú no necesitas crearle credenciales.
      </p>

      <Button type="submit" disabled={!roleKey} className="w-full">
        Generar link de invitación
      </Button>
    </form>
  );
}
