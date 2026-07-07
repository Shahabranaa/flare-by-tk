import { Pool } from 'pg';

const g = globalThis as typeof globalThis & { _pgPool?: Pool };

export const pool = g._pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

if (process.env.NODE_ENV !== 'production') g._pgPool = pool;

export async function sql<T = Record<string, unknown>>(
  query: string,
  params?: unknown[]
): Promise<T[]> {
  const { rows } = await pool.query(query, params);
  return rows as T[];
}
