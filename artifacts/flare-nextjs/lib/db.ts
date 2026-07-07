import { Pool } from 'pg';

const g = globalThis as typeof globalThis & { _pgPool?: Pool; _schemaReady?: boolean };

export const pool = g._pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

if (process.env.NODE_ENV !== 'production') g._pgPool = pool;

export async function sql<T = Record<string, unknown>>(
  query: string,
  params?: unknown[]
): Promise<T[]> {
  await ensureSchema();
  const { rows } = await pool.query(query, params);
  return rows as T[];
}

export async function ensureSchema(): Promise<void> {
  if (g._schemaReady) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      image_url TEXT,
      sort_order INTEGER DEFAULT 0,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS menu_items (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      description TEXT,
      category_id INTEGER REFERENCES categories(id),
      price NUMERIC(10,2) NOT NULL,
      original_price NUMERIC(10,2),
      image_url TEXT,
      is_available BOOLEAN DEFAULT true,
      is_featured BOOLEAN DEFAULT false,
      calories INTEGER,
      tags TEXT[],
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS deals (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      original_price NUMERIC(10,2),
      deal_price NUMERIC(10,2) NOT NULL,
      discount_type TEXT,
      discount_value NUMERIC,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      tracking_token UUID NOT NULL UNIQUE,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_address TEXT,
      order_type TEXT NOT NULL CHECK (order_type IN ('delivery', 'pickup')),
      status TEXT NOT NULL DEFAULT 'new',
      total_amount NUMERIC(10,2) NOT NULL,
      special_instructions TEXT,
      items JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  g._schemaReady = true;
}
