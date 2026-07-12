import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const fallbackDatabaseUrl = "postgresql://assetflow:assetflow@localhost:5432/assetflow";

function getDatabaseUrl() {
  const value = process.env.DATABASE_URL?.trim().replace(/^['\"]+|['\"]+$/g, "");
  if (!value) return null;

  try {
    const url = new URL(value);
    return url.protocol === "postgresql:" || url.protocol === "postgres:" ? value : null;
  } catch {
    return null;
  }
}

export const databaseUrl = getDatabaseUrl();
export const isDatabaseConfigured = databaseUrl !== null;

/**
 * Uses a syntactically valid inert URL during builds without DATABASE_URL.
 * Queries still fail clearly at runtime until a real Neon URL is configured.
 */
export const sql = neon(databaseUrl ?? fallbackDatabaseUrl);
export const db = drizzle({ client: sql });

export function assertDatabaseConfigured() {
  if (!isDatabaseConfigured) {
    throw new Error("DATABASE_URL must be a valid postgresql:// Neon connection string.");
  }
}
