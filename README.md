# MACRO SANTIDAD CRM

**GANAR · CONSOLIDAR · ENTRENAR · ENVIAR**

CRM cristiano de gestión celular: personas, células, discipulado, liderazgo,
crecimiento espiritual, seguimiento y multiplicación. Construido a partir del
prompt maestro "CRM Macro Santidad".

## Stack

- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript
- **UI:** Tailwind CSS v4 (identidad visual rojo/dorado de Célula 69)
- **Backend:** Server Actions de Next.js (sin API REST intermedia para el CRUD)
- **Base de datos:** PostgreSQL + Prisma ORM 7 (driver adapter `@prisma/adapter-pg`)
- **Autenticación:** NextAuth v5 (Credentials + JWT), RBAC con 6 roles
- **Iconos:** lucide-react

## Primeros pasos

```bash
npm install

# Configura tu base de datos en .env (copia .env.example)
cp .env.example .env

# Levanta un PostgreSQL local (o usa uno remoto) y actualiza DATABASE_URL

npx prisma migrate dev   # crea las tablas
npm run db:seed          # datos de demostración (3 macro células, 10 células, 100 personas...)

npm run dev
```

Usuario de demostración:

- **Admin:** `admin@macrosantidad.org` / `MacroSantidad2026`
- También se crean 20 líderes (`lider.macro1@...`, `lider.celula1@...`, `colider1@...`, `supervisor@...`) con la misma contraseña.

## Estructura del dominio

El sistema modela la estructura `Organización → Macro Célula → Célula → Líder → Discípulos`
y acompaña a cada persona a través del camino:

```
ACEPTAR A JESÚS → LLEGAR A LA CÉLULA → CONSOLIDARSE → ENCUENTRO →
DISCIPULADO → ENTRENAMIENTO → LIDERAZGO → MULTIPLICACIÓN → ENVÍO
```

El **Cardex** (`/personas/[id]`) es el expediente de vida completo de cada
persona: identidad, familia, los 4 pilares, discipulado, vida (historia,
desafíos, metas, sueños, logros), motivos de oración, entrenamiento, envío,
eventos, testimonio, seguimiento y una timeline cronológica de todo lo vivido.

Los **Motivos de Oración** (`/oracion`) son el corazón de acompañamiento del
sistema: lista diaria de oración, lista priorizada por Macro Célula, filtros,
privacidad y ciclo completo Necesidad → Oración → Seguimiento → Respuesta →
Testimonio.

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` / `npm run start` — build de producción
- `npm run lint` — ESLint
- `npm run db:migrate` — `prisma migrate dev`
- `npm run db:seed` — datos de demostración
- `npm run db:studio` — Prisma Studio

## Fases de desarrollo cubiertas

Todas las fases 1–15 del prompt maestro están representadas: autenticación y
roles, macro células/células/líderes, personas/familias/Cardex, timeline,
asistencia, pre/post-encuentro, bautismo/iglesia/retiros/congresos,
discipulado y herramientas cristianas, metas/sueños/logros/testimonios,
motivos de oración y lista diaria, liderazgo y multiplicación, dashboards,
reportes y alertas, auditoría, y una arquitectura preparada para incorporar
IA en el futuro (ver `90. INSTRUCCIÓN FINAL` del documento fuente).
