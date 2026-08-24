"use client";

import { useRef } from "react";
import { Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { fullName, initials } from "@/lib/utils";

type Member = {
  id: string;
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal: string | null;
  photoUrl: string | null;
};

type ExistingAttendance = { personId: string; attended: boolean; isGuest: boolean; absenceReason: string | null };

export function AttendanceForm({
  action,
  members,
  existing,
  notes,
}: {
  action: (formData: FormData) => void;
  members: Member[];
  existing: ExistingAttendance[];
  notes?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const existingMap = Object.fromEntries(existing.map((e) => [e.personId, e]));

  function setAll(checked: boolean) {
    containerRef.current?.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-role="attended"]').forEach((el) => {
      el.checked = checked;
    });
  }

  return (
    <form action={action} className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => setAll(true)}>
          Marcar todos
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => setAll(false)}>
          Desmarcar todos
        </Button>
      </div>

      <div ref={containerRef} className="space-y-2">
        {members.map((m) => {
          const prev = existingMap[m.id];
          return (
            <div key={m.id} className="flex items-center gap-3 rounded-xl border border-ink-100 p-3">
              <input type="hidden" name="personId" value={m.id} />
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                {initials(m)}
              </div>
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink-800">{fullName(m)}</span>
              <label className="flex items-center gap-1 text-xs text-ink-500">
                <input
                  type="checkbox"
                  data-role="attended"
                  name={`attended_${m.id}`}
                  defaultChecked={prev?.attended ?? false}
                  className="h-5 w-5 rounded"
                />
                Asistió
              </label>
              <label className="hidden items-center gap-1 text-xs text-ink-500 sm:flex">
                <input type="checkbox" name={`guest_${m.id}`} defaultChecked={prev?.isGuest ?? false} className="h-4 w-4 rounded" />
                Invitado
              </label>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-dashed border-ink-200 p-3">
        <label className="mb-1 block text-sm font-medium text-ink-700">Agregar nuevo invitado</label>
        <Input name="newGuestName" placeholder="Nombre completo del invitado" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink-700">Observaciones</label>
        <textarea
          name="notes"
          defaultValue={notes}
          rows={2}
          className="w-full rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none"
        />
      </div>

      <Button type="submit" size="lg" className="w-full">
        Guardar asistencia
      </Button>
    </form>
  );
}
