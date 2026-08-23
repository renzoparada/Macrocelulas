import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fullName, formatDate } from "@/lib/utils";

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: unknown) => `"${String(v ?? "").replaceAll('"', '""')}"`;
  const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h])).join(","))];
  return lines.join("\n");
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ entity: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { entity } = await params;
  let rows: Record<string, unknown>[] = [];

  switch (entity) {
    case "personas": {
      const people = await prisma.person.findMany({
        include: { currentCell: true, currentStage: true },
        orderBy: { registeredAt: "desc" },
      });
      rows = people.map((p) => ({
        Nombre: fullName(p),
        Documento: p.documentId,
        Telefono: p.phone,
        Celula: p.currentCell ? `C${p.currentCell.number} - ${p.currentCell.name}` : "",
        Etapa: p.currentStage?.name ?? "",
        Estado: p.status,
        FechaRegistro: formatDate(p.registeredAt),
      }));
      break;
    }
    case "asistencia": {
      const reports = await prisma.attendanceReport.findMany({ include: { cell: true }, orderBy: { date: "desc" } });
      rows = reports.map((r) => ({
        Fecha: formatDate(r.date),
        Celula: `C${r.cell.number} - ${r.cell.name}`,
        Miembros: r.membersCount,
        Asistentes: r.attendeesCount,
        Nuevos: r.newCount,
        Invitados: r.guestsCount,
        PorcentajeAsistencia: r.attendancePercent,
      }));
      break;
    }
    case "celulas": {
      const cells = await prisma.cell.findMany({ include: { macroCell: true, leader: true } });
      rows = cells.map((c) => ({
        Numero: c.number,
        Nombre: c.name,
        MacroCelula: c.macroCell.name,
        Lider: c.leader?.name ?? "",
        Estado: c.status,
      }));
      break;
    }
    case "bautismos": {
      const baptisms = await prisma.baptism.findMany({ include: { person: true } });
      rows = baptisms.map((b) => ({ Nombre: fullName(b.person), Fecha: formatDate(b.date), Lugar: b.place ?? "" }));
      break;
    }
    case "encuentros": {
      const regs = await prisma.encounterRegistration.findMany({ include: { person: true, encounter: true } });
      rows = regs.map((r) => ({
        Nombre: fullName(r.person),
        Encuentro: r.encounter.name,
        Fecha: formatDate(r.encounter.date),
        Asistio: r.attended ? "Si" : "No",
      }));
      break;
    }
    case "oracion": {
      const requests = await prisma.prayerRequest.findMany({ include: { person: true } });
      rows = requests.map((r) => ({
        Nombre: fullName(r.person),
        Motivo: r.motivo,
        Categoria: r.category,
        Prioridad: r.priority,
        Estado: r.status,
        FechaInicio: formatDate(r.startDate),
      }));
      break;
    }
    default:
      return NextResponse.json({ error: "Entidad no soportada" }, { status: 400 });
  }

  const csv = toCsv(rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${entity}.csv"`,
    },
  });
}
