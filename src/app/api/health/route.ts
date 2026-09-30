import { getRedis } from '@/lib/cache';
import { hasDb, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([p, new Promise<T>((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))]);
}

/** Load balancer / Docker health check. ?strict=1 returns 503 when a dependency is down. */
export async function GET(req: Request) {
  const checks: Record<string, string> = {};
  if (hasDb()) {
    try {
      await withTimeout(query('SELECT 1'), 2000);
      checks.database = 'ok';
    } catch {
      checks.database = 'down';
    }
  } else checks.database = 'not-configured';

  const redis = await getRedis();
  if (redis) {
    try {
      await withTimeout(redis.ping(), 1000);
      checks.cache = 'ok';
    } catch {
      checks.cache = 'down';
    }
  } else checks.cache = 'memory';

  const degraded = Object.values(checks).includes('down');
  const strict = new URL(req.url).searchParams.get('strict') === '1';
  return Response.json(
    { status: degraded ? 'degraded' : 'ok', checks, uptime: Math.round(process.uptime()) },
    { status: degraded && strict ? 503 : 200, headers: { 'Cache-Control': 'no-store' } },
  );
}
