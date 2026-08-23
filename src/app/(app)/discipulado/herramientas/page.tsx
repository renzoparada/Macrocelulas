import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { revalidatePath } from "next/cache";

async function createTool(formData: FormData) {
  "use server";
  await prisma.discipleshipTool.create({
    data: {
      category: formData.get("category")?.toString() ?? "Discipulado",
      name: formData.get("name")?.toString() ?? "",
      description: formData.get("description")?.toString() || undefined,
    },
  });
  revalidatePath("/discipulado/herramientas");
}

const CATEGORIES = ["Vida Espiritual", "Oración", "Discipulado", "Crecimiento Personal", "Familia", "Liderazgo", "Servicio"];

export default async function DiscipleshipToolsPage() {
  const session = await auth();
  const tools = await prisma.discipleshipTool.findMany({ orderBy: [{ category: "asc" }, { name: "asc" }] });

  const grouped = tools.reduce<Record<string, typeof tools>>((acc, t) => {
    (acc[t.category] ??= []).push(t);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader title="Herramientas cristianas de discipulado" subtitle="Catálogo configurable de herramientas por categoría." />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {Object.entries(grouped).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle>{category}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {items.map((t) => (
                  <span key={t.id} className="rounded-full bg-ink-50 px-3 py-1 text-sm text-ink-700">
                    {t.name}
                  </span>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {session?.user.role === "ADMIN" && (
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Agregar herramienta</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={createTool} className="space-y-4">
                <Field label="Nombre" required>
                  <Input name="name" required />
                </Field>
                <Field label="Categoría">
                  <Select name="category" defaultValue="Discipulado">
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Button type="submit" className="w-full">
                  Agregar
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
