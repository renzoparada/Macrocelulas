import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, calculateAge } from "@/lib/utils";
import type { CardexPerson } from "@/lib/cardex-query";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <span className="block text-xs text-ink-400 uppercase">{label}</span>
      <span className="font-medium text-ink-800">{value || "—"}</span>
    </div>
  );
}

export function TabIdentidad({ person }: { person: CardexPerson }) {
  const age = calculateAge(person.birthDate);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Datos personales</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Row label="Nombre completo" value={`${person.firstName} ${person.lastNamePaternal} ${person.lastNameMaternal ?? ""}`} />
          <Row label="Fecha de nacimiento" value={person.birthDate ? `${formatDate(person.birthDate)} (${age} años)` : "—"} />
          <Row label="Sexo" value={person.sex} />
          <Row label="Documento" value={person.documentId} />
          <Row label="Ocupación" value={person.occupation} />
          <Row label="Empresa" value={person.company} />
          <Row label="Fecha de registro" value={formatDate(person.registeredAt)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contacto</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <Row label="Teléfono" value={person.phone} />
          <Row label="WhatsApp" value={person.whatsapp} />
          <Row label="Email" value={person.email} />
          <Row label="Redes sociales" value={person.socialMedia} />
          <Row label="Dirección" value={person.address} />
          <Row label="Ciudad" value={person.city} />
          <Row label="Zona" value={person.zone} />
        </CardContent>
      </Card>
    </div>
  );
}
