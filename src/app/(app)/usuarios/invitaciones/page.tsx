import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { revokeInvite } from "@/actions/invites";
import { PageHeader } from "@/components/ui/page-header";
import { LinkButton, Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/lib/permissions";
import { formatDate } from "@/lib/utils";
import { CopyLinkButton } from "./copy-link-button";
import { Plus } from "lucide-react";
import type { InviteStatus } from "@/generated/prisma/client";

const STATUS_LABEL: Record<InviteStatus, string> = {
  PENDIENTE: "Pendiente",
  USADA: "Usada",
  EXPIRADA: "Expirada",
  REVOCADA: "Revocada",
};

const STATUS_VARIANT: Record<InviteStatus, "brand" | "green" | "red" | "default"> = {
  PENDIENTE: "brand",
  USADA: "green",
  EXPIRADA: "default",
  REVOCADA: "red",
};

export default async function InvitationsPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/");

  const invites = await prisma.accountInvite.findMany({ orderBy: { createdAt: "desc" } });

  const cellIds = invites.map((i) => i.cellId).filter((v): v is string => !!v);
  const macroCellIds = invites.map((i) => i.macroCellId).filter((v): v is string => !!v);

  const [cells, macroCells] = await Promise.all([
    prisma.cell.findMany({ where: { id: { in: cellIds } }, select: { id: true, number: true, name: true } }),
    prisma.macroCell.findMany({ where: { id: { in: macroCellIds } }, select: { id: true, name: true } }),
  ]);
  const cellById = new Map(cells.map((c) => [c.id, c]));
  const macroCellById = new Map(macroCells.map((mc) => [mc.id, mc]));

  const now = new Date();

  return (
    <div>
      <PageHeader
        title="Invitaciones"
        subtitle={`${invites.length} invitación(es) generada(s)`}
        actions={
          <LinkButton href="/usuarios/invitar">
            <Plus className="h-4 w-4" /> Nueva invitación
          </LinkButton>
        }
      />

      <div className="overflow-x-auto rounded-xl border border-ink-100 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-ink-50 text-left text-xs tracking-wide text-ink-500 uppercase">
            <tr>
              <th className="px-4 py-2">Rol</th>
              <th className="px-4 py-2">Para</th>
              <th className="px-4 py-2">Estado</th>
              <th className="px-4 py-2">Expira</th>
              <th className="px-4 py-2" />
            </tr>
          </thead>
          <tbody>
            {invites.map((inv) => {
              const effectiveStatus: InviteStatus =
                inv.status === "PENDIENTE" && inv.expiresAt < now ? "EXPIRADA" : inv.status;
              const context = inv.cellId
                ? cellById.get(inv.cellId)
                  ? `Célula ${cellById.get(inv.cellId)!.number} · ${cellById.get(inv.cellId)!.name}`
                  : "—"
                : inv.macroCellId
                  ? (macroCellById.get(inv.macroCellId)?.name ?? "—")
                  : "—";

              return (
                <tr key={inv.id} className="border-t border-ink-100">
                  <td className="px-4 py-2">
                    <Badge variant="brand">{ROLE_LABELS[inv.roleKey]}</Badge>
                  </td>
                  <td className="px-4 py-2 text-ink-600">{context}</td>
                  <td className="px-4 py-2">
                    <Badge variant={STATUS_VARIANT[effectiveStatus]}>{STATUS_LABEL[effectiveStatus]}</Badge>
                  </td>
                  <td className="px-4 py-2 text-ink-500">{formatDate(inv.expiresAt)}</td>
                  <td className="px-4 py-2">
                    {effectiveStatus === "PENDIENTE" ? (
                      <div className="flex items-center gap-2">
                        <CopyLinkButton token={inv.token} />
                        <form action={revokeInvite.bind(null, inv.id)}>
                          <Button type="submit" size="sm" variant="outline">
                            Revocar
                          </Button>
                        </form>
                      </div>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
