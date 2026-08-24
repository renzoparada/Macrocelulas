import "server-only";
import { auth } from "@/lib/auth";
import { roleHasPermission, type PermissionKey } from "@/lib/permissions";

/**
 * Obliga a que exista una sesión autenticada. Úsalo al inicio de cualquier
 * Server Action que escriba datos — nunca confíes solo en el middleware,
 * que protege rutas de página pero no invocaciones directas de acciones.
 */
export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("No autenticado. Inicia sesión para continuar.");
  }
  return session;
}

/**
 * Obliga a que la sesión activa tenga un permiso específico según su rol
 * (ver lib/permissions.ts). Lanza un error legible que Next.js muestra en
 * el boundary de error más cercano si la persona no está autorizada.
 */
export async function requirePermission(permission: PermissionKey) {
  const session = await requireSession();
  if (!roleHasPermission(session.user.role, permission)) {
    throw new Error("No tienes permiso para realizar esta acción.");
  }
  return session;
}
