#!/usr/bin/env node
// Corre las migraciones y el seed de datos demo contra una conexión DIRECTA
// (sin pooling). Neon (y otros proveedores con PgBouncer en modo "transaction")
// no soportan advisory locks a través del connection pooler, y `prisma migrate
// deploy` los necesita — por eso NO se puede usar la misma URL pooled que usa
// la app en runtime (DATABASE_URL) para migrar.
//
// Busca una URL directa en las variables que suelen inyectar las integraciones
// de Neon/Vercel Postgres; si no encuentra ninguna, cae de vuelta a
// DATABASE_URL (mejor intentarlo con esa que no migrar en absoluto).
import "dotenv/config";
import { execSync } from "node:child_process";
import { Client } from "pg";

function describe(name) {
  const raw = process.env[name];
  if (!raw) return `${name}: (no definida)`;
  try {
    const u = new URL(raw);
    return `${name}: host=${u.hostname} db=${u.pathname} params=${u.search || "(ninguno)"}`;
  } catch {
    return `${name}: (definida, no parseable como URL)`;
  }
}

console.log("🔍 Variables de conexión disponibles:");
for (const name of [
  "DATABASE_URL",
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
  "DIRECT_DATABASE_URL",
  "POSTGRES_URL",
  "PGHOST",
  "PGHOST_UNPOOLED",
]) {
  console.log("   " + describe(name));
}

const directUrl =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DIRECT_DATABASE_URL ||
  process.env.DATABASE_URL;

if (!directUrl) {
  console.error("❌ No hay ninguna variable DATABASE_URL configurada. Abortando.");
  process.exit(1);
}

console.log(
  directUrl === process.env.DATABASE_URL
    ? "⚠️  No se encontró una URL directa (sin pooling); se usará DATABASE_URL tal cual para migrar/sembrar."
    : "✅ Usando conexión directa (sin pooling) para migrar y sembrar."
);

const env = { ...process.env, DATABASE_URL: directUrl };

// Neon suspende el compute cuando está inactivo (free tier); la primera
// conexión después de un período de inactividad puede tardar varios
// segundos en "despertarlo". `prisma migrate deploy` solo espera 10s para
// adquirir el advisory lock, lo cual puede no alcanzar. Por eso primero
// hacemos una conexión simple (con timeout generoso) para forzar el
// arranque del compute y confirmar que el endpoint responde, antes de
// invocar a Prisma.
async function warmUp() {
  const client = new Client({ connectionString: directUrl, connectionTimeoutMillis: 60_000 });
  const start = Date.now();
  await client.connect();
  await client.query("SELECT 1");
  await client.end();
  console.log(`🔥 Conexión directa verificada en ${Date.now() - start}ms`);
}

function migrateDeployWithRetry(attemptsLeft = 3) {
  try {
    execSync("prisma migrate deploy", { stdio: "inherit", env });
  } catch (err) {
    if (attemptsLeft <= 1) throw err;
    console.warn(`⚠️  'prisma migrate deploy' falló, reintentando (${attemptsLeft - 1} intento(s) restante(s))...`);
    migrateDeployWithRetry(attemptsLeft - 1);
  }
}

await warmUp();
migrateDeployWithRetry();
execSync("tsx prisma/seed.ts", { stdio: "inherit", env });
