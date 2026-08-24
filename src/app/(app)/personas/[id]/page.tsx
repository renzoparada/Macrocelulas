import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getCardexPerson } from "@/lib/cardex-query";
import { getPersonHealth, getPillarProgress } from "@/lib/business";
import { getScope, isCellIdInScope } from "@/lib/scope";
import { canViewPrayerRequest } from "@/lib/prayer-access";
import { CardexHeader } from "@/components/cardex/cardex-header";
import { PillarsSummary } from "@/components/cardex/pillars-summary";
import { CardexTabs } from "@/components/cardex/cardex-tabs";
import { TabIdentidad } from "@/components/cardex/tab-identidad";
import { TabFamilia } from "@/components/cardex/tab-familia";
import { TabGanar } from "@/components/cardex/tab-ganar";
import { TabConsolidar } from "@/components/cardex/tab-consolidar";
import { TabDiscipulado } from "@/components/cardex/tab-discipulado";
import { TabVida } from "@/components/cardex/tab-vida";
import { TabOracion } from "@/components/cardex/tab-oracion";
import { TabEntrenar } from "@/components/cardex/tab-entrenar";
import { TabEnviar } from "@/components/cardex/tab-enviar";
import { TabEventos } from "@/components/cardex/tab-eventos";
import { TabTestimonio } from "@/components/cardex/tab-testimonio";
import { TabTimeline } from "@/components/cardex/tab-timeline";
import { TabSeguimiento } from "@/components/cardex/tab-seguimiento";

export default async function CardexPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) redirect("/login");

  const { id } = await params;
  const person = await getCardexPerson(id);
  if (!person) notFound();

  const scope = getScope(session);
  if (!isCellIdInScope(scope, person.currentCellId, person.currentCell?.macroCellId)) notFound();

  const visiblePrayerRequests = person.prayerRequests.filter((r) =>
    canViewPrayerRequest(session, {
      isPrivate: r.isPrivate,
      createdById: r.createdById,
      person: { currentCellId: person.currentCellId, currentCell: person.currentCell ? { macroCellId: person.currentCell.macroCellId } : null },
    })
  );
  const personForTabs = { ...person, prayerRequests: visiblePrayerRequests };

  const [health, progress] = await Promise.all([getPersonHealth(id), getPillarProgress(id)]);

  return (
    <div>
      <CardexHeader person={person} health={health.level} />
      <PillarsSummary progress={progress} />

      <CardexTabs
        tabs={[
          { key: "identidad", label: "Identidad", content: <TabIdentidad person={person} /> },
          { key: "familia", label: "Familia", content: <TabFamilia person={person} /> },
          { key: "ganar", label: "Ganar", content: <TabGanar person={person} /> },
          { key: "consolidar", label: "Consolidar", content: <TabConsolidar person={person} /> },
          { key: "discipulado", label: "Discipulado", content: <TabDiscipulado person={person} /> },
          { key: "vida", label: "Vida", content: <TabVida person={person} /> },
          { key: "oracion", label: "🙏 Oración", content: <TabOracion person={personForTabs} /> },
          { key: "entrenar", label: "Entrenar", content: <TabEntrenar person={person} /> },
          { key: "enviar", label: "Enviar", content: <TabEnviar person={person} /> },
          { key: "eventos", label: "Eventos", content: <TabEventos person={person} /> },
          { key: "testimonio", label: "Testimonio", content: <TabTestimonio person={person} /> },
          { key: "seguimiento", label: "Seguimiento", content: <TabSeguimiento person={person} /> },
          { key: "timeline", label: "Timeline", content: <TabTimeline person={person} /> },
        ]}
      />
    </div>
  );
}
