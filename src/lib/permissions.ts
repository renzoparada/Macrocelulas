import type { RoleKey } from "@/generated/prisma/client";

export type PermissionKey =
  | "people.view"
  | "people.create"
  | "people.edit"
  | "people.delete"
  | "families.manage"
  | "macrocells.manage"
  | "cells.manage"
  | "cells.view_own"
  | "leaders.manage"
  | "attendance.register"
  | "attendance.view"
  | "discipleship.register"
  | "discipleship.tools.manage"
  | "prayer.register"
  | "prayer.view"
  | "prayer.view_private"
  | "encounters.manage"
  | "encounters.register"
  | "retreats.manage"
  | "congresses.manage"
  | "events.manage"
  | "goals.register"
  | "reports.view"
  | "reports.export"
  | "settings.manage"
  | "users.manage"
  | "roles.manage"
  | "stages.configure"
  | "audit.view";

const ALL_PERMISSIONS: PermissionKey[] = [
  "people.view",
  "people.create",
  "people.edit",
  "people.delete",
  "families.manage",
  "macrocells.manage",
  "cells.manage",
  "cells.view_own",
  "leaders.manage",
  "attendance.register",
  "attendance.view",
  "discipleship.register",
  "discipleship.tools.manage",
  "prayer.register",
  "prayer.view",
  "prayer.view_private",
  "encounters.manage",
  "encounters.register",
  "retreats.manage",
  "congresses.manage",
  "events.manage",
  "goals.register",
  "reports.view",
  "reports.export",
  "settings.manage",
  "users.manage",
  "roles.manage",
  "stages.configure",
  "audit.view",
];

export const ROLE_PERMISSIONS: Record<RoleKey, PermissionKey[]> = {
  ADMIN: ALL_PERMISSIONS,
  LIDER_MACRO: [
    "people.view",
    "people.create",
    "people.edit",
    "families.manage",
    "cells.view_own",
    "leaders.manage",
    "attendance.view",
    "discipleship.register",
    "prayer.register",
    "prayer.view",
    "encounters.register",
    "goals.register",
    "reports.view",
    "reports.export",
  ],
  LIDER_CELULA: [
    "people.view",
    "people.create",
    "people.edit",
    "families.manage",
    "cells.view_own",
    "attendance.register",
    "attendance.view",
    "discipleship.register",
    "prayer.register",
    "prayer.view",
    "encounters.register",
    "goals.register",
    "reports.view",
  ],
  CO_LIDER: [
    "people.view",
    "people.create",
    "cells.view_own",
    "attendance.register",
    "attendance.view",
    "prayer.register",
    "prayer.view",
    "goals.register",
  ],
  LIDER_FORMACION: [
    "people.view",
    "cells.view_own",
    "attendance.view",
    "discipleship.register",
    "prayer.view",
    "goals.register",
  ],
  SUPERVISOR: [
    "people.view",
    "cells.view_own",
    "attendance.view",
    "prayer.view",
    "reports.view",
  ],
};

export function roleHasPermission(role: RoleKey, permission: PermissionKey): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export const ROLE_LABELS: Record<RoleKey, string> = {
  ADMIN: "Administrador General",
  LIDER_MACRO: "Líder de Macro Célula",
  LIDER_CELULA: "Líder de Célula",
  CO_LIDER: "Co-Líder",
  LIDER_FORMACION: "Líder en Formación",
  SUPERVISOR: "Supervisor",
};
