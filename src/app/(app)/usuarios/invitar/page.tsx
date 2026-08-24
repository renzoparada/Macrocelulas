import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { InviteForm } from "./invite-form";

export default async function InviteUserPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/");

  const [cells, macroCells] = await Promise.all([
    prisma.cell.findMany({ select: { id: true, number: true, name: true }, orderBy: { number: "asc" } }),
    prisma.macroCell.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="Invitar por link"
        subtitle="Genera un link para que un líder cree su propia cuenta."
      />
      <Card>
        <CardContent>
          <InviteForm cells={cells} macroCells={macroCells} />
        </CardContent>
      </Card>
    </div>
  );
}
