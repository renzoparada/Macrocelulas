import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";
import { Download } from "lucide-react";

const REPORTS = [
  {
    pillar: "GANAR",
    color: "text-brand-700",
    items: [
      { label: "Personas (nuevos, invitados)", href: "/personas", csv: "personas" },
      { label: "Encuentros y conversión", href: "/encuentros", csv: "encuentros" },
    ],
  },
  {
    pillar: "CONSOLIDAR",
    color: "text-ink-800",
    items: [
      { label: "Informes de asistencia", href: "/informes", csv: "asistencia" },
      { label: "Bautismos", href: "/bautismos", csv: "bautismos" },
    ],
  },
  {
    pillar: "ENTRENAR",
    color: "text-brand-800",
    items: [{ label: "Discipulados y formación", href: "/discipulado", csv: null }],
  },
  {
    pillar: "ENVIAR",
    color: "text-gold-700",
    items: [{ label: "Multiplicación y nuevas células", href: "/multiplicacion", csv: "celulas" }],
  },
  {
    pillar: "ORACIÓN",
    color: "text-brand-600",
    items: [{ label: "Motivos de oración", href: "/oracion", csv: "oracion" }],
  },
];

export default function ReportesPage() {
  return (
    <div>
      <PageHeader title="Reportes" subtitle="Exporta información en CSV para análisis externo." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {REPORTS.map((group) => (
          <Card key={group.pillar}>
            <CardHeader>
              <CardTitle className={group.color}>{group.pillar}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {group.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-2">
                  <LinkButton href={item.href} variant="ghost" size="sm" className="justify-start px-0">
                    {item.label}
                  </LinkButton>
                  {item.csv && (
                    <a
                      href={`/api/export/${item.csv}`}
                      className="flex items-center gap-1 rounded-lg border border-ink-200 px-2 py-1 text-xs font-medium text-ink-600 hover:bg-ink-50"
                    >
                      <Download className="h-3 w-3" /> CSV
                    </a>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
