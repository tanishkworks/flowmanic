import { Pool, type QueryResultRow } from 'pg';

/**
 * One connection pool per server process (reused across requests and hot reloads).
 * With 3 app replicas x PG_POOL_MAX=10 you use at most 30 Postgres connections.
 * For bigger fleets, put PgBouncer (transaction mode) in front of Postgres.
 */
declare global {
  // eslint-disable-next-line no-var
  var __flowmanicPool: Pool | undefined;
}

export const hasDb = (): boolean => Boolean(process.env.DATABASE_URL);

function createPool(): Pool {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: Number(process.env.PG_POOL_MAX || 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    statement_timeout: 10_000,
    application_name: 'flowmanic-web',
    ssl: process.env.PGSSL === 'require' ? { rejectUnauthorized: false } : undefined,
  });
  // An idle client erroring (e.g. DB restart) must not crash the process
  pool.on('error', (err) => console.error('[pg] idle client error:', err.message));
  return pool;
}

export function getPool(): Pool {
  if (!globalThis.__flowmanicPool) globalThis.__flowmanicPool = createPool();
  return globalThis.__flowmanicPool;
}

export async function query<T extends QueryResultRow>(text: string, params: unknown[] = []) {
  return getPool().query<T>(text, params);
}
