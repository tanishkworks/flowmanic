#!/usr/bin/env node
/**
 * Upserts systems + integrations from src/content/*.json (the single source of truth),
 * rebuilds the system ↔ integration links, then clears cached content in Redis.
 * Safe to run on every deploy.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = async (f) => JSON.parse(await readFile(path.join(root, 'src', 'content', f), 'utf8'));

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const systems = await read('systems.json');
const integrations = await read('integrations.json');

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === 'require' ? { rejectUnauthorized: false } : undefined,
});
await client.connect();

try {
  await client.query('BEGIN');

  const integrationIds = new Map();
  for (const i of integrations) {
    const { rows } = await client.query(
      `INSERT INTO integrations (slug, name, category, description) VALUES ($1, $2, $3, $4)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category,
         description = EXCLUDED.description
       RETURNING id`,
      [i.slug, i.name, i.category, i.description],
    );
    integrationIds.set(i.slug, rows[0].id);
  }

  for (const s of systems) {
    const { rows } = await client.query(
      `INSERT INTO systems (slug, position, name, short_name, display_top, display_bottom, summary,
                            setup_price, monthly_price, badge, accent, art_bg, flow, outcomes, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13::jsonb,$14::jsonb, now())
       ON CONFLICT (slug) DO UPDATE SET position = EXCLUDED.position, name = EXCLUDED.name,
         short_name = EXCLUDED.short_name, display_top = EXCLUDED.display_top,
         display_bottom = EXCLUDED.display_bottom, summary = EXCLUDED.summary,
         setup_price = EXCLUDED.setup_price, monthly_price = EXCLUDED.monthly_price,
         badge = EXCLUDED.badge, accent = EXCLUDED.accent, art_bg = EXCLUDED.art_bg,
         flow = EXCLUDED.flow, outcomes = EXCLUDED.outcomes, updated_at = now()
       RETURNING id`,
      [s.slug, s.position, s.name, s.shortName, s.displayTop, s.displayBottom, s.summary, s.setupPrice,
       s.monthlyPrice, s.badge, s.accent, s.artBg, JSON.stringify(s.flow), JSON.stringify(s.outcomes)],
    );
    const systemId = rows[0].id;
    await client.query('DELETE FROM system_integrations WHERE system_id = $1', [systemId]);
    // One multi-row INSERT per system instead of one INSERT per tool
    const links = s.tools.map((slug, step) => [systemId, integrationIds.get(slug), step]).filter((l) => l[1]);
    if (links.length) {
      const values = links.map((_, n) => `($${n * 3 + 1}, $${n * 3 + 2}, $${n * 3 + 3})`).join(', ');
      await client.query(
        `INSERT INTO system_integrations (system_id, integration_id, step) VALUES ${values}`,
        links.flat(),
      );
    }
  }

  await client.query('COMMIT');
  console.log(`Seeded ${systems.length} systems and ${integrations.length} integrations.`);
} catch (err) {
  await client.query('ROLLBACK');
  console.error(err);
  process.exitCode = 1;
} finally {
  await client.end();
}

// Clear cached content so the site picks up changes immediately
if (process.env.REDIS_URL && !process.exitCode) {
  try {
    const { default: Redis } = await import('ioredis');
    const redis = new Redis(process.env.REDIS_URL, { maxRetriesPerRequest: 1 });
    for (const prefix of ['fm:systems', 'fm:integrations']) {
      let cursor = '0';
      do {
        const [next, keys] = await redis.scan(cursor, 'MATCH', `${prefix}*`, 'COUNT', 200);
        cursor = next;
        if (keys.length) await redis.unlink(...keys);
      } while (cursor !== '0');
    }
    await redis.quit();
    console.log('Cleared cached content in Redis.');
  } catch (err) {
    console.warn('Could not clear Redis cache:', err.message);
  }
}
