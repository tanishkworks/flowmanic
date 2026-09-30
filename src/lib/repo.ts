import systemsJson from '@/content/systems.json';
import integrationsJson from '@/content/integrations.json';
import { cached, invalidate } from './cache';
import { hasDb, query } from './db';
import { decodeCursor, encodeCursor, escapeLike, totalPages } from './pagination';
import type { Integration, Lead, LeadStatus, Paginated, System } from './types';
import type { LeadInput } from './validation';

/* ==========================================================================
   Static content (fallback when DATABASE_URL is missing or the DB is down,
   and the seed source for the database)
   ========================================================================== */
type SystemJson = Omit<System, 'tools'> & { tools: string[] };
type IntegrationJson = Omit<Integration, 'usedIn'>;

const SYSTEMS = systemsJson as SystemJson[];
const INTEGRATIONS = integrationsJson as IntegrationJson[];

export function staticSystems(): System[] {
  const byslug = new Map(INTEGRATIONS.map((i) => [i.slug, i.name]));
  return [...SYSTEMS]
    .sort((a, b) => a.position - b.position)
    .map((s) => ({ ...s, tools: s.tools.map((slug) => ({ slug, name: byslug.get(slug) ?? slug })) }));
}

function staticIntegrations(): Integration[] {
  return INTEGRATIONS.map((i) => ({
    ...i,
    usedIn: SYSTEMS.filter((s) => s.tools.includes(i.slug))
      .sort((a, b) => a.position - b.position)
      .map((s) => ({ slug: s.slug, name: s.shortName })),
  })).sort((a, b) => a.name.localeCompare(b.name));
}

export const INTEREST_OPTIONS = [...SYSTEMS.map((s) => s.slug), 'not-sure'] as const;

/* ==========================================================================
   Systems
   ========================================================================== */
type SystemRow = {
  slug: string;
  position: number;
  name: string;
  short_name: string;
  display_top: string;
  display_bottom: string;
  summary: string;
  setup_price: string;
  monthly_price: string | null;
  badge: string | null;
  accent: string;
  art_bg: string;
  flow: string[];
  outcomes: string[];
  tools: { slug: string; name: string }[];
};

/**
 * One round trip for every system AND its tools (LEFT JOIN + json_agg).
 * The N+1 version would be: SELECT systems, then one SELECT per system for its tools.
 */
const SQL_SYSTEMS = `
  SELECT s.slug, s.position, s.name, s.short_name, s.display_top, s.display_bottom, s.summary,
         s.setup_price, s.monthly_price, s.badge, s.accent, s.art_bg, s.flow, s.outcomes,
         COALESCE(
           json_agg(json_build_object('slug', i.slug, 'name', i.name) ORDER BY si.step)
             FILTER (WHERE i.id IS NOT NULL),
           '[]'::json
         ) AS tools
    FROM systems s
    LEFT JOIN system_integrations si ON si.system_id = s.id
    LEFT JOIN integrations i ON i.id = si.integration_id
   GROUP BY s.id
   ORDER BY s.position`;

function fromSystemRow(r: SystemRow): System {
  return {
    slug: r.slug,
    position: r.position,
    name: r.name,
    shortName: r.short_name,
    displayTop: r.display_top,
    displayBottom: r.display_bottom,
    summary: r.summary,
    setupPrice: r.setup_price,
    monthlyPrice: r.monthly_price,
    badge: r.badge,
    accent: r.accent,
    artBg: r.art_bg,
    flow: r.flow,
    outcomes: r.outcomes,
    tools: r.tools,
  };
}

export async function getSystems(): Promise<System[]> {
  if (!hasDb()) return staticSystems();
  try {
    return await cached('systems:all', 3600, async () => {
      const { rows } = await query<SystemRow>(SQL_SYSTEMS);
      if (!rows.length) throw new Error('systems table is empty (run npm run db:seed)');
      return rows.map(fromSystemRow);
    });
  } catch (err) {
    console.error('[repo] getSystems → static fallback:', (err as Error).message);
    return staticSystems();
  }
}

export async function getSystem(slug: string): Promise<System | null> {
  const all = await getSystems();
  return all.find((s) => s.slug === slug) ?? null;
}

/* ==========================================================================
   Integrations (paginated + searchable)
   ========================================================================== */
export type IntegrationQuery = { q?: string; category?: string; page?: number; pageSize?: number };

type IntegrationRow = {
  slug: string;
  name: string;
  category: string;
  description: string;
  used_in: { slug: string; name: string }[];
  total: string;
};

/**
 * Filter + page + total count + "used in which systems" in ONE query.
 * LATERAL aggregates each row's systems inside the same statement (no per-row round trips).
 * name/description ILIKE is served by pg_trgm GIN indexes; the lateral lookup by the
 * system_integrations(integration_id) index.
 */
const SQL_INTEGRATIONS = `
  SELECT i.slug, i.name, i.category, i.description,
         COALESCE(u.used_in, '[]'::json) AS used_in,
         count(*) OVER () AS total
    FROM integrations i
    LEFT JOIN LATERAL (
      SELECT json_agg(json_build_object('slug', s.slug, 'name', s.short_name) ORDER BY s.position) AS used_in
        FROM system_integrations si
        JOIN systems s ON s.id = si.system_id
       WHERE si.integration_id = i.id
    ) u ON true
   WHERE ($1::text IS NULL OR i.name ILIKE $1 OR i.description ILIKE $1)
     AND ($2::text IS NULL OR i.category = $2)
   ORDER BY i.name
   LIMIT $3 OFFSET $4`;

const SQL_INTEGRATIONS_COUNT = `
  SELECT count(*) AS total FROM integrations i
   WHERE ($1::text IS NULL OR i.name ILIKE $1 OR i.description ILIKE $1)
     AND ($2::text IS NULL OR i.category = $2)`;

function normalizeQuery(p: IntegrationQuery) {
  return {
    q: (p.q ?? '').trim().toLowerCase().slice(0, 60),
    category: (p.category ?? '').trim().slice(0, 40),
    page: Math.max(1, Math.floor(p.page ?? 1)),
    pageSize: Math.min(24, Math.max(1, Math.floor(p.pageSize ?? 6))),
  };
}

function paginateStatic(p: ReturnType<typeof normalizeQuery>): Paginated<Integration> {
  const filtered = staticIntegrations().filter(
    (i) =>
      (!p.q || i.name.toLowerCase().includes(p.q) || i.description.toLowerCase().includes(p.q)) &&
      (!p.category || i.category === p.category),
  );
  const start = (p.page - 1) * p.pageSize;
  return {
    items: filtered.slice(start, start + p.pageSize),
    page: p.page,
    pageSize: p.pageSize,
    total: filtered.length,
    totalPages: totalPages(filtered.length, p.pageSize),
  };
}

export async function getIntegrations(params: IntegrationQuery = {}): Promise<Paginated<Integration>> {
  const p = normalizeQuery(params);
  if (!hasDb()) return paginateStatic(p);
  const key = `integrations:list:${encodeURIComponent(p.category)}:${p.page}:${p.pageSize}:${encodeURIComponent(p.q)}`;
  try {
    return await cached(key, 300, async () => {
      const like = p.q ? `%${escapeLike(p.q)}%` : null;
      const cat = p.category || null;
      const { rows } = await query<IntegrationRow>(SQL_INTEGRATIONS, [like, cat, p.pageSize, (p.page - 1) * p.pageSize]);
      let total = rows.length ? Number(rows[0].total) : 0;
      if (!rows.length && p.page > 1) {
        const count = await query<{ total: string }>(SQL_INTEGRATIONS_COUNT, [like, cat]);
        total = Number(count.rows[0]?.total ?? 0);
      }
      return {
        items: rows.map((r) => ({
          slug: r.slug,
          name: r.name,
          category: r.category,
          description: r.description,
          usedIn: r.used_in,
        })),
        page: p.page,
        pageSize: p.pageSize,
        total,
        totalPages: totalPages(total, p.pageSize),
      };
    });
  } catch (err) {
    console.error('[repo] getIntegrations → static fallback:', (err as Error).message);
    return paginateStatic(p);
  }
}

export async function getIntegrationCategories(): Promise<{ category: string; count: number }[]> {
  const fromStatic = () => {
    const counts = new Map<string, number>();
    for (const i of INTEGRATIONS) counts.set(i.category, (counts.get(i.category) ?? 0) + 1);
    return Array.from(counts, ([category, count]) => ({ category, count })).sort((a, b) =>
      a.category.localeCompare(b.category),
    );
  };
  if (!hasDb()) return fromStatic();
  try {
    return await cached('integrations:categories', 3600, async () => {
      const { rows } = await query<{ category: string; count: number }>(
        'SELECT category, count(*)::int AS count FROM integrations GROUP BY category ORDER BY category',
      );
      return rows;
    });
  } catch (err) {
    console.error('[repo] getIntegrationCategories → static fallback:', (err as Error).message);
    return fromStatic();
  }
}

/* ==========================================================================
   Leads
   ========================================================================== */
export const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'booked', 'won', 'lost'];

type LeadRow = {
  id: string;
  name: string;
  email: string;
  agency: string;
  website: string | null;
  team_size: string;
  interest: string;
  message: string | null;
  status: LeadStatus;
  created_at: Date;
};

export async function createLead(
  input: LeadInput,
  meta: { ipHash: string; source: string | null; userAgent: string | null },
): Promise<{ id: string; createdAt: string }> {
  const { rows } = await query<{ id: string; created_at: Date }>(
    `INSERT INTO leads (name, email, agency, website, team_size, interest, message, source, ip_hash, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING id, created_at`,
    [
      input.name,
      input.email,
      input.agency,
      input.website,
      input.teamSize,
      input.interest,
      input.message,
      meta.source?.slice(0, 200) ?? null,
      meta.ipHash,
      meta.userAgent?.slice(0, 300) ?? null,
    ],
  );
  await invalidate('leads:');
  return { id: String(rows[0].id), createdAt: rows[0].created_at.toISOString() };
}

/** Keyset (cursor) pagination: stays fast on page 1,000 where OFFSET would scan every skipped row. */
export async function listLeads(opts: { cursor?: string | null; status?: string | null; limit?: number }) {
  const limit = Math.min(100, Math.max(1, opts.limit ?? 25));
  const params: unknown[] = [];
  const where: string[] = [];
  const status = opts.status && (LEAD_STATUSES as string[]).includes(opts.status) ? opts.status : null;
  if (status) {
    params.push(status);
    where.push(`status = $${params.length}`);
  }
  const cursor = decodeCursor(opts.cursor);
  if (cursor) {
    params.push(cursor.t, cursor.id);
    where.push(`(created_at, id) < ($${params.length - 1}::timestamptz, $${params.length}::bigint)`);
  }
  params.push(limit + 1);
  const { rows } = await query<LeadRow>(
    `SELECT id, name, email, agency, website, team_size, interest, message, status, created_at
       FROM leads
      ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
      ORDER BY created_at DESC, id DESC
      LIMIT $${params.length}`,
    params,
  );
  const items: Lead[] = rows.slice(0, limit).map((r) => ({
    id: String(r.id),
    name: r.name,
    email: r.email,
    agency: r.agency,
    website: r.website,
    teamSize: r.team_size,
    interest: r.interest,
    message: r.message,
    status: r.status,
    createdAt: r.created_at.toISOString(),
  }));
  const last = items[items.length - 1];
  return {
    items,
    status,
    nextCursor: rows.length > limit && last ? encodeCursor({ t: last.createdAt, id: last.id }) : null,
  };
}

/** Aggregates are the expensive part of the admin view, so they are cached for a minute. */
export async function getLeadStats(): Promise<{ total: number; byStatus: Record<string, number> }> {
  return cached('leads:stats', 60, async () => {
    const { rows } = await query<{ status: string; count: number }>(
      'SELECT status, count(*)::int AS count FROM leads GROUP BY status',
    );
    const byStatus: Record<string, number> = {};
    let total = 0;
    for (const r of rows) {
      byStatus[r.status] = r.count;
      total += r.count;
    }
    return { total, byStatus };
  });
}
