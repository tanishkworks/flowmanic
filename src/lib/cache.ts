import type Redis from 'ioredis';

/**
 * Server-side cache.
 * - Redis when REDIS_URL is set (shared by every app replica behind the load balancer)
 * - otherwise an in-process LRU map (good for a single instance / local dev)
 * - in-flight de-duplication so a cold key is computed once, not once per request (stampede guard)
 */
const PREFIX = 'fm:';
const MEM_MAX = 500;

type Entry = { value: unknown; expires: number };
const memory = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();

let redisPromise: Promise<Redis | null> | null = null;

export function getRedis(): Promise<Redis | null> {
  if (!process.env.REDIS_URL) return Promise.resolve(null);
  if (!redisPromise) {
    redisPromise = import('ioredis')
      .then(({ default: RedisCtor }) => {
        const client = new RedisCtor(process.env.REDIS_URL as string, {
          maxRetriesPerRequest: 1,
          enableOfflineQueue: false,
          connectTimeout: 3_000,
        });
        client.on('error', (err: Error) => console.error('[redis]', err.message));
        return client;
      })
      .catch((err: Error) => {
        console.error('[redis] unavailable, using memory cache:', err.message);
        return null;
      });
  }
  return redisPromise;
}

function memGet<T>(key: string): T | undefined {
  const hit = memory.get(key);
  if (!hit) return undefined;
  if (hit.expires <= Date.now()) {
    memory.delete(key);
    return undefined;
  }
  // refresh LRU position
  memory.delete(key);
  memory.set(key, hit);
  return hit.value as T;
}

function memSet(key: string, value: unknown, ttlSeconds: number) {
  memory.set(key, { value, expires: Date.now() + ttlSeconds * 1000 });
  while (memory.size > MEM_MAX) {
    const oldest = memory.keys().next().value;
    if (oldest === undefined) break;
    memory.delete(oldest);
  }
}

/** Return the cached value for `key`, or compute it with `fn` and cache it for `ttlSeconds`. */
export async function cached<T>(key: string, ttlSeconds: number, fn: () => Promise<T>): Promise<T> {
  const fullKey = PREFIX + key;
  const redis = await getRedis();

  if (redis) {
    try {
      const raw = await redis.get(fullKey);
      if (raw !== null) return JSON.parse(raw) as T;
    } catch {
      /* Redis hiccup: fall through and compute */
    }
  } else {
    const hit = memGet<T>(fullKey);
    if (hit !== undefined) return hit;
  }

  const pending = inflight.get(fullKey);
  if (pending) return pending as Promise<T>;

  const job = (async () => {
    const value = await fn();
    if (redis) {
      try {
        await redis.set(fullKey, JSON.stringify(value), 'EX', ttlSeconds);
      } catch {
        /* ignore write failures */
      }
    } else {
      memSet(fullKey, value, ttlSeconds);
    }
    return value;
  })().finally(() => inflight.delete(fullKey));

  inflight.set(fullKey, job);
  return job;
}

/** Drop every cached key that starts with `prefix` (e.g. "systems", "integrations"). */
export async function invalidate(prefix: string): Promise<number> {
  const match = PREFIX + prefix;
  let removed = 0;
  for (const key of Array.from(memory.keys())) {
    if (key.startsWith(match)) {
      memory.delete(key);
      removed++;
    }
  }
  const redis = await getRedis();
  if (redis) {
    try {
      let cursor = '0';
      do {
        const [next, keys] = await redis.scan(cursor, 'MATCH', `${match}*`, 'COUNT', 200);
        cursor = next;
        if (keys.length) {
          removed += keys.length;
          await redis.unlink(...keys);
        }
      } while (cursor !== '0');
    } catch (err) {
      console.error('[cache] invalidate failed:', (err as Error).message);
    }
  }
  return removed;
}

/** Test helper */
export function __resetMemoryCache() {
  memory.clear();
  inflight.clear();
}
