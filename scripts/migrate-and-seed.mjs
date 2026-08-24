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

execSync("prisma migrate deploy", { stdio: "inherit", env });
execSync("tsx prisma/seed.ts", { stdio: "inherit", env });
