import type { Session } from "next-auth";
import type { Prisma } from "@/generated/prisma/client";
import { roleHasPermission } from "@/lib/permissions";
import { getScope, isCellIdInScope } from "@/lib/scope";

/**
 * Privacidad de motivos de oración (sección 39 del prompt maestro):
 * "Si está activo [MOTIVO PRIVADO], solamente usuarios autorizados podrán
 * verlo." Autorizado = quien lo registró, o un rol con "prayer.view_private"
 * (Admin, Líder Macro, Líder Célula) siempre que la persona esté dentro de
 * su alcance organizacional.
 */
export function prayerVisibilityWhere(session: Session): Prisma.PrayerRequestWhereInput {
  const scope = getScope(session);
  const scopeCond: Prisma.PrayerRequestWhereInput =
    scope.type === "all"
      ? {}
      : scope.type === "macroCell"
        ? { person: { currentCell: { macroCellId: scope.macroCellId } } }
        : { person: { currentCellId: { in: scope.cellIds } } };

  if (roleHasPermission(session.user.role, "prayer.view_private")) {
    return scopeCond;
  }

  return { AND: [scopeCond, { OR: [{ isPrivate: false }, { createdById: session.user.id }] }] };
}

export function canViewPrayerRequest(
  session: Session,
  request: {
    isPrivate: boolean;
    createdById: string | null;
    person: { currentCellId: string | null; currentCell?: { macroCellId: string } | null };
  }
): boolean {
  if (!request.isPrivate) return true;
  if (request.createdById === session.user.id) return true;
  if (!roleHasPermission(session.user.role, "prayer.view_private")) return false;

  const scope = getScope(session);
  return isCellIdInScope(scope, request.person.currentCellId, request.person.currentCell?.macroCellId);
}
