import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;

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
          <h1 className="font-display mb-1 text-lg font-semibold text-white">Iniciar sesión</h1>
          <p className="mb-5 text-sm text-ink-400">Ingresa a tu cuenta del CRM celular.</p>
          <LoginForm callbackUrl={params.callbackUrl} error={params.error} />
        </div>
        <p className="mt-6 text-center text-xs text-ink-500">
          Plataforma de liderazgo, discipulado y multiplicación.
        </p>
      </div>
    </div>
  );
}
