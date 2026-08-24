import Link from "next/link";
import { fullName, initials, calculateAge } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type PersonRowData = {
  id: string;
  firstName: string;
  lastNamePaternal: string;
  lastNameMaternal: string | null;
  photoUrl: string | null;
  birthDate: Date | null;
  status: string;
  currentCell: { number: string; name: string } | null;
  currentStage: { name: string } | null;
};

const STATUS_VARIANT: Record<string, "green" | "yellow" | "red" | "default"> = {
  ACTIVO: "green",
  INACTIVO: "default",
  EN_RIESGO: "yellow",
  RETIRADO: "red",
};

export function PersonRow({ person }: { person: PersonRowData }) {
  const age = calculateAge(person.birthDate);
  return (
    <Link
      href={`/personas/${person.id}`}
      className="flex items-center gap-3 rounded-xl border border-ink-100 bg-white p-3 transition-shadow hover:shadow-md"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-display font-bold text-brand-700">
        {person.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={person.photoUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          initials(person)
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-semibold text-ink-900">{fullName(person)}</p>
          <Badge variant={STATUS_VARIANT[person.status] ?? "default"}>{person.status}</Badge>
        </div>
        <p className="truncate text-xs text-ink-500">
          {person.currentCell ? `C${person.currentCell.number} · ${person.currentCell.name}` : "Sin célula"}
          {age !== null && ` · ${age} años`}
        </p>
      </div>
      {person.currentStage && (
        <Badge variant="brand" className="hidden sm:inline-flex">
          {person.currentStage.name}
        </Badge>
      )}
    </Link>
  );
}
