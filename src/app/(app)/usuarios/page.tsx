import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { toggleUserActive } from "@/actions/users";
import { PageHeader } from "@/components/ui/page-header";
import { LinkButton, Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/lib/permissions";
import { formatDate } from "@/lib/utils";
import { Plus } from "lucide-react";

export default async function UsersPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/");

  const users = await prisma.user.findMany({ include: { role: true }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader
        title="Usuarios y permisos"
        subtitle={`${users.length} usuario(s)`}
        actions={
          <LinkButton href="/usuarios/nuevo">
            <Plus className="h-4 w-4" /> Nuevo usuario
          </LinkButton>
        }
      />

      <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white shadow-sm">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-ink-50 text-left text-xs tracking-wide text-ink-500 uppercase">
            <tr>
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Correo</th>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">Último ingreso</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-ink-100">
                <td className="px-4 py-2 font-medium text-ink-800">{u.name}</td>
                <td className="px-4 py-2 text-ink-500">{u.email}</td>
                <td className="px-4 py-2">
                  <Badge variant="brand">{ROLE_LABELS[u.role.key]}</Badge>
                </td>
                <td className="px-4 py-2 text-ink-500">{formatDate(u.lastLoginAt)}</td>
                <td className="px-4 py-2">
                  <Badge variant={u.active ? "green" : "red"}>{u.active ? "Activo" : "Inactivo"}</Badge>
                </td>
                <td className="px-4 py-2">
                  <form action={toggleUserActive.bind(null, u.id, !u.active)}>
                    <Button type="submit" size="sm" variant="outline">
                      {u.active ? "Desactivar" : "Activar"}
                    </Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
