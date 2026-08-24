import { prisma } from "@/lib/prisma";
import { ROLE_LABELS } from "@/lib/permissions";
import { RegisterForm } from "./register-form";

export default async function RegisterPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invite = await prisma.accountInvite.findUnique({ where: { token } });

  const invalid = !invite || invite.status !== "PENDIENTE" || invite.expiresAt < new Date();

  let contextLabel = "";
  if (invite && !invalid) {
    if (invite.cellId) {
      const cell = await prisma.cell.findUnique({ where: { id: invite.cellId }, select: { number: true, name: true } });
      if (cell) contextLabel = `Célula ${cell.number} · ${cell.name}`;
    } else if (invite.macroCellId) {
      const macroCell = await prisma.macroCell.findUnique({ where: { id: invite.macroCellId }, select: { name: true } });
      if (macroCell) contextLabel = macroCell.name;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="font-display text-3xl font-bold tracking-wide text-white">
            MACRO <span className="text-brand-500">SANTIDAD</span>
          </div>
          <div className="mt-1 text-xs font-semibold tracking-[0.3em] text-gold-400 uppercase">
            Ganar · Consolidar · Entrenar · Enviar
          </div>
        </div>

        <div className="rounded-2xl border border-ink-800 bg-ink-900 p-6 shadow-xl">
          {invalid || !invite ? (
            <>
              <h1 className="font-display mb-1 text-lg font-semibold text-white">Link no válido</h1>
              <p className="text-sm text-ink-400">
                Este link de invitación ya no está disponible — puede que haya expirado, ya se
                haya usado o haya sido revocado. Pide un nuevo link a quien te invitó.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display mb-1 text-lg font-semibold text-white">Crear tu cuenta</h1>
              <p className="mb-5 text-sm text-ink-400">
                Te invitaron como <span className="text-ink-200">{ROLE_LABELS[invite.roleKey]}</span>
                {contextLabel && (
                  <>
                    {" "}
                    · <span className="text-ink-200">{contextLabel}</span>
                  </>
                )}
                . Elige tu correo y contraseña para ingresar.
              </p>
              <RegisterForm token={token} />
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-ink-500">
          Plataforma de liderazgo, discipulado y multiplicación.
        </p>
      </div>
    </div>
  );
}
