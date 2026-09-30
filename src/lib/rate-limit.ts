import { getRedis } from './cache';

type Result = { ok: boolean; remaining: number; resetSeconds: number };

const windows = new Map<string, { count: number; resetAt: number }>();

/** Fixed-window rate limit. Uses Redis when available so all replicas share the counter. */
export async function rateLimit(id: string, limit: number, windowSeconds: number): Promise<Result> {
  const key = `fm:rl:${id}`;
  const redis = await getRedis();
  if (redis) {
    try {
      const count = await redis.incr(key);
      if (count === 1) await redis.expire(key, windowSeconds);
      const ttl = await redis.ttl(key);
      return { ok: count <= limit, remaining: Math.max(0, limit - count), resetSeconds: Math.max(ttl, 0) };
    } catch {
      /* fall back to memory */
    }
  }
  const now = Date.now();
  const current = windows.get(key);
  if (!current || current.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    if (windows.size > 10_000) {
      for (const [k, v] of windows) if (v.resetAt <= now) windows.delete(k);
    }
    return { ok: true, remaining: limit - 1, resetSeconds: windowSeconds };
  }
  current.count++;
  return {
    ok: current.count <= limit,
    remaining: Math.max(0, limit - current.count),
    resetSeconds: Math.ceil((current.resetAt - now) / 1000),
  };
}
