import { prisma } from "@/lib/prisma";
import { PageHeader, EmptyState } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { fullName, formatDate } from "@/lib/utils";
import Link from "next/link";

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    include: { person: true },
    orderBy: { date: "desc" },
  });

  return (
    <div>
      <PageHeader title="Testimonios" subtitle="Historias de transformación — lo que Dios hizo." />

      {testimonials.length === 0 ? (
        <EmptyState title="Sin testimonios registrados" />
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-2xl border border-ink-100 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <Link href={`/personas/${t.person.id}`} className="font-semibold text-ink-900 hover:text-brand-700">
                  {fullName(t.person)}
                </Link>
                <Badge variant={t.authorizedToShare ? "green" : "default"}>{t.authorizedToShare ? "Autorizado" : "Privado"}</Badge>
              </div>
              {t.whatGodDid && <p className="text-sm text-brand-700 italic">&ldquo;{t.whatGodDid}&rdquo;</p>}
              <p className="mt-2 text-xs text-ink-400">{formatDate(t.date)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
