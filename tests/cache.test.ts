import assert from 'node:assert/strict';
import { test } from 'node:test';
import { __resetMemoryCache, cached, invalidate } from '../src/lib/cache';
import { rateLimit } from '../src/lib/rate-limit';

delete process.env.REDIS_URL; // exercise the in-memory path

test('caches values and de-duplicates concurrent misses', async () => {
  __resetMemoryCache();
  let calls = 0;
  const fn = async () => {
    calls++;
    await new Promise((r) => setTimeout(r, 20));
    return { n: calls };
  };
  const [a, b, c] = await Promise.all([cached('t:a', 60, fn), cached('t:a', 60, fn), cached('t:a', 60, fn)]);
  assert.equal(calls, 1);
  assert.deepEqual(a, b);
  assert.deepEqual(b, c);
  await cached('t:a', 60, fn);
  assert.equal(calls, 1);
});

test('invalidate by prefix', async () => {
  __resetMemoryCache();
  let calls = 0;
  const fn = async () => ++calls;
  await cached('systems:all', 60, fn);
  await cached('other:x', 60, fn);
  const removed = await invalidate('systems');
  assert.equal(removed, 1);
  await cached('systems:all', 60, fn);
  assert.equal(calls, 3);
});

test('failed computations are not cached', async () => {
  __resetMemoryCache();
  await assert.rejects(cached('t:fail', 60, async () => { throw new Error('db down'); }));
  assert.equal(await cached('t:fail', 60, async () => 'ok'), 'ok');
});

test('rate limit blocks after the limit', async () => {
  const id = `test-${Math.random()}`;
  for (let i = 0; i < 3; i++) assert.equal((await rateLimit(id, 3, 60)).ok, true);
  const blocked = await rateLimit(id, 3, 60);
  assert.equal(blocked.ok, false);
  assert.equal(blocked.remaining, 0);
});
