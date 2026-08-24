import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Textarea, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/page-header";
import { updateLifeHistory, addChallenge, addGoal, addDream, addAchievement } from "@/actions/cardex";
import { CHALLENGE_CATEGORIES, GOAL_CATEGORIES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import type { CardexPerson } from "@/lib/cardex-query";
import { ProgressBar } from "@/components/ui/progress-bar";

const CHALLENGE_STATUS_VARIANT: Record<string, "default" | "yellow" | "green" | "red"> = {
  ABIERTO: "red",
  EN_SEGUIMIENTO: "yellow",
  MEJORANDO: "yellow",
  RESUELTO: "green",
  CERRADO: "default",
};

const HORIZON_LABELS: Record<string, string> = {
  CORTO_PLAZO: "Corto plazo (0-12 meses)",
  MEDIANO_PLAZO: "Mediano plazo (1-3 años)",
  LARGO_PLAZO: "Largo plazo (3+ años)",
};

export function TabVida({ person }: { person: CardexPerson }) {
  const lifeAction = updateLifeHistory.bind(null, person.id);
  const challengeAction = addChallenge.bind(null, person.id);
  const goalAction = addGoal.bind(null, person.id);
  const dreamAction = addDream.bind(null, person.id);
  const achievementAction = addAchievement.bind(null, person.id);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Mi historia</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={lifeAction} className="grid gap-4 sm:grid-cols-2">
            <Field label="Historia de vida" className="sm:col-span-2">
              <Textarea name="history" defaultValue={person.lifeHistory?.history ?? ""} rows={3} />
            </Field>
            <Field label="Antecedentes importantes">
              <Textarea name="background" defaultValue={person.lifeHistory?.background ?? ""} />
            </Field>
            <Field label="Situación actual">
              <Textarea name="currentSituation" defaultValue={person.lifeHistory?.currentSituation ?? ""} />
            </Field>
            <Field label="Fortalezas">
              <Textarea name="strengths" defaultValue={person.lifeHistory?.strengths ?? ""} />
            </Field>
            <Field label="Áreas de desarrollo">
              <Textarea name="developmentAreas" defaultValue={person.lifeHistory?.developmentAreas ?? ""} />
            </Field>
            <Field label="Dones">
              <Input name="gifts" defaultValue={person.lifeHistory?.gifts ?? ""} />
            </Field>
            <Field label="Talentos">
              <Input name="talents" defaultValue={person.lifeHistory?.talents ?? ""} />
            </Field>
            <Field label="Habilidades">
              <Input name="skills" defaultValue={person.lifeHistory?.skills ?? ""} />
            </Field>
            <Field label="Vocación / propósito">
              <Input name="purpose" defaultValue={person.lifeHistory?.purpose ?? ""} />
            </Field>
            <div className="sm:col-span-2">
              <Button type="submit">Guardar historia</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Mis desafíos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 max-h-64 space-y-2 overflow-y-auto">
              {person.personalChallenges.length === 0 && <EmptyState title="Sin desafíos registrados" />}
              {person.personalChallenges.map((c) => (
                <div key={c.id} className="rounded-lg border border-ink-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink-800">{c.problem}</span>
                    <Badge variant={CHALLENGE_STATUS_VARIANT[c.status]}>{c.status.replaceAll("_", " ")}</Badge>
                  </div>
                  <p className="text-xs text-ink-400">{c.category} · {formatDate(c.date)}</p>
                  {c.description && <p className="mt-1 text-sm text-ink-600">{c.description}</p>}
                </div>
              ))}
            </div>
            <form action={challengeAction} className="space-y-3 border-t border-ink-100 pt-4">
              <Field label="Problema" required>
                <Input name="problem" required />
              </Field>
              <Field label="Categoría">
                <Select name="category" defaultValue="Personal">
                  {CHALLENGE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Descripción">
                <Textarea name="description" />
              </Field>
              <Button type="submit" className="w-full">
                Registrar desafío
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mis metas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 max-h-64 space-y-3 overflow-y-auto">
              {person.personalGoals.length === 0 && <EmptyState title="Sin metas registradas" />}
              {person.personalGoals.map((g) => (
                <div key={g.id} className="rounded-lg border border-ink-100 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-ink-800">{g.goal}</span>
                    <span className="text-xs text-ink-400">{g.category}</span>
                  </div>
                  <ProgressBar value={g.progress} size="sm" />
                </div>
              ))}
            </div>
            <form action={goalAction} className="space-y-3 border-t border-ink-100 pt-4">
              <Field label="Meta" required>
                <Input name="goal" required />
              </Field>
              <Field label="Categoría">
                <Select name="category" defaultValue="Personal">
                  {GOAL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Fecha objetivo">
                <Input name="targetDate" type="date" />
              </Field>
              <Button type="submit" className="w-full">
                Registrar meta
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mis sueños</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 max-h-64 space-y-2 overflow-y-auto">
              {person.dreams.length === 0 && <EmptyState title="Sin sueños registrados" />}
              {person.dreams.map((d) => (
                <div key={d.id} className="rounded-lg border border-ink-100 p-3">
                  <span className="text-sm font-semibold text-ink-800">{d.dream}</span>
                  <p className="text-xs text-ink-400">{HORIZON_LABELS[d.horizon]}</p>
                </div>
              ))}
            </div>
            <form action={dreamAction} className="space-y-3 border-t border-ink-100 pt-4">
              <Field label="Sueño" required>
                <Input name="dream" required />
              </Field>
              <Field label="Horizonte">
                <Select name="horizon" defaultValue="CORTO_PLAZO">
                  {Object.entries(HORIZON_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Próximo paso">
                <Input name="nextStep" />
              </Field>
              <Button type="submit" className="w-full">
                Registrar sueño
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mis logros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 max-h-64 space-y-2 overflow-y-auto">
              {person.achievements.length === 0 && <EmptyState title="Sin logros registrados" />}
              {person.achievements.map((a) => (
                <div key={a.id} className="rounded-lg border border-gold-200 bg-gold-50/40 p-3">
                  <span className="text-sm font-semibold text-ink-800">🏆 {a.achievement}</span>
                  <p className="text-xs text-ink-400">{formatDate(a.date)}</p>
                </div>
              ))}
            </div>
            <form action={achievementAction} className="space-y-3 border-t border-ink-100 pt-4">
              <Field label="Logro" required>
                <Input name="achievement" required />
              </Field>
              <Field label="Comentario">
                <Textarea name="comment" />
              </Field>
              <Button type="submit" variant="gold" className="w-full">
                Registrar logro
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
