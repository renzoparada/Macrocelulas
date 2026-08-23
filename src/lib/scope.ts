import type { Session } from "next-auth";
import type { Prisma } from "@/generated/prisma/client";

/**
 * Alcance de datos de un usuario según su rol y estructura organizacional:
 * ADMIN y SUPERVISOR ven toda la organización (Supervisor es de solo
 * lectura, ver lib/permissions.ts); un Líder de Macro Célula ve únicamente
 * su Macro Célula; los demás roles ven únicamente las células que lideran
 * o co-lideran.
 */
export type Scope =
  | { type: "all" }
  | { type: "macroCell"; macroCellId: string }
  | { type: "cells"; cellIds: string[] };

export function getScope(session: Session): Scope {
  const { role, macroCellId, scopedCellIds } = session.user;

  if (role === "ADMIN" || role === "SUPERVISOR") return { type: "all" };
  if (role === "LIDER_MACRO" && macroCellId) return { type: "macroCell", macroCellId };
  return { type: "cells", cellIds: scopedCellIds ?? [] };
}

export function personScopeWhere(scope: Scope): Prisma.PersonWhereInput {
  if (scope.type === "all") return {};
  if (scope.type === "macroCell") return { currentCell: { macroCellId: scope.macroCellId } };
  return { currentCellId: { in: scope.cellIds } };
}

export function cellScopeWhere(scope: Scope): Prisma.CellWhereInput {
  if (scope.type === "all") return {};
  if (scope.type === "macroCell") return { macroCellId: scope.macroCellId };
  return { id: { in: scope.cellIds } };
}

export function isCellIdInScope(scope: Scope, cellId: string | null | undefined, macroCellId?: string | null): boolean {
  if (!cellId) return scope.type === "all";
  if (scope.type === "all") return true;
  if (scope.type === "macroCell") return macroCellId === scope.macroCellId;
  return scope.cellIds.includes(cellId);
}
