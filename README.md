# Flowmanic website

Production multi-page site for Flowmanic (AI automation for marketing agencies), styled after the Involynk reference recording: a white canvas, extended display type (one line solid, one outlined), a cursor image trail, a floating nav pill that morphs on scroll, a fixed bottom dock, and a pinned horizontal gallery with grayscale-to-colour cards whose title bars fill blue on hover.

**Stack:** Next.js 15 (App Router, TypeScript) · PostgreSQL · Redis · Nginx · Docker

---

## Pages

| Route | What's on it |
|---|---|
| `/` | Hero, the "30 seconds" statement, problem, solution, the five systems, tool marquee, CTA |
| `/services` | Replica of the reference "Work" page: exhibition hero + pinned horizontal gallery; dock becomes System 01–05 |
| `/services/[slug]` | One page per system: pricing box, what it does, tool-by-tool flow, previous/next |
| `/how-it-works` | Six-step process, tool marquee, why Flowmanic |
| `/pricing` | Plans, the no-lock-in note, FAQ (with FAQ structured data) |
| `/integrations` | Searchable, filterable, paginated tool directory |
| `/about` | Why Flowmanic, how we work, the honest "early results" note |
| `/contact` | Audit request form → Postgres + webhook (n8n / Slack) |
| `/admin/leads` | Password-protected lead inbox (keyset pagination, status filters) |
| `/api/*` | `services`, `services/[slug]`, `integrations`, `leads` (POST), `health` |

---

## Run it locally (no database needed)

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:3000
```

Without `DATABASE_URL`, pages render from `src/content/*.json`. The contact form needs either a database or a webhook (`LEAD_WEBHOOK_URL` or `SLACK_WEBHOOK_URL`) to accept submissions.

### With Postgres + Redis

```bash
docker compose up -d postgres redis
# in .env.local:
#   DATABASE_URL=postgres://flowmanic:flowmanic@localhost:5432/flowmanic
#   REDIS_URL=redis://localhost:6379
npm run db:migrate && npm run db:seed
npm run dev
```

### Checks

```bash
npm run typecheck      # strict TypeScript
npm test               # cache, rate limit, pagination, validation, repository
npm run build          # production build (minified, code-split)
```

---

## Deploy

### Option A: Vercel (simplest)

1. Push to GitHub and import the repo in Vercel. Vercel provides the global CDN and load balancing.
2. Create Postgres (Neon or Supabase) and Redis (Upstash). Set `DATABASE_URL`, `PGSSL=require`, and `REDIS_URL` (the `rediss://` URL).
3. Run `npm run db:migrate && npm run db:seed` once against the production database.
4. Set `NEXT_PUBLIC_SITE_URL`, `ADMIN_PASSWORD`, `IP_HASH_SALT`, and optionally `LEAD_WEBHOOK_URL`, `SLACK_WEBHOOK_URL`, `NEXT_PUBLIC_BOOKING_URL`.

### Option B: Your own server (Docker)

```bash
cp .env.example .env      # set POSTGRES_PASSWORD, ADMIN_PASSWORD, IP_HASH_SALT, NEXT_PUBLIC_SITE_URL
docker compose up -d --build
```

This starts:

- Postgres and Redis.
- A one-shot `migrate` job that applies the schema and seeds content.
- Three app replicas.
- Nginx on port 80, load-balancing across the replicas.

Health check: `curl localhost/api/health`.

Put Cloudflare, or any CDN, in front of the server for HTTPS and edge caching (see "CDN" below).

---

## Where each performance item lives

| # | Item | Implementation |
|---|---|---|
| 1 | Compress images | Illustrations are minified SVG (~3–4 KB each), gzip/brotli-compressed in transit. `next.config.ts` serves AVIF/WebP from `next/image`. `npm run images:optimize` converts PNG/JPG screenshots in `public/images` to AVIF + WebP (max 1920px) with sharp. |
| 2 | Lazy loading | `loading="lazy"` + `decoding="async"` on every illustration. Lenis smooth scroll is loaded with `import()` after hydration. Trail tiles are animated only on interaction. |
| 3 | Split code into chunks | One chunk per route (App Router). Server components ship zero JS; only interactive parts (`Nav`, `Dock`, `TrailLayer`, `HorizontalScroll`, `ContactForm`, `IntegrationsSearch`…) are client code. Lenis is a separate dynamic chunk. |
| 4 | Cache API responses | `src/lib/http.ts → cachedJson`: `Cache-Control: s-maxage + stale-while-revalidate` for CDN/Nginx, plus ETag → `304 Not Modified`. Nginx caches `/api/*` with `proxy_cache_lock`. |
| 5 | Add a CDN | `NEXT_PUBLIC_CDN_URL` → `assetPrefix` (hashed JS/CSS/fonts) and `asset()` for `/art/*`. Static assets are sent as `immutable` for a year. On Vercel the CDN is built in. |
| 6 | Minify JS and CSS | `next build` (SWC minifier + CSS minification); `output: 'standalone'` ships only traced files. |
| 7 | Index the database | `db/migrations/001_init.sql`: unique slugs, composite `(created_at DESC, id DESC)` and `(status, created_at DESC, id DESC)` for lead paging, `lower(email)`, trigram GIN indexes for `ILIKE` search, and a reverse index on `system_integrations(integration_id)`. |
| 8 | Debounce input handlers | `useDebouncedValue` (`src/lib/hooks.ts`): the integrations search queries the server 300 ms after typing stops; contact-form email validation waits 350 ms. |
| 9 | Fix unnecessary re-renders | Cursor, trail and horizontal scroll use refs + `requestAnimationFrame` (no React state per frame). Nav re-renders only when the scroll threshold flips. Form fields are `memo` with stable `useCallback` handlers and a reducer that returns the same state when nothing changed. |
| 10 | Defer non-critical scripts | Analytics (`NEXT_PUBLIC_PLAUSIBLE_DOMAIN`) via `next/script strategy="lazyOnload"`. Lenis is imported after mount. Fonts are self-hosted by `next/font` (no render-blocking Google request). |
| 11 | Remove unused dependencies | 7 runtime deps: `next`, `react`, `react-dom`, `pg`, `ioredis`, `lenis`, `sharp`. GSAP from the single-file version was replaced by CSS, WAAPI and `position: sticky`. |
| 12 | Add a load balancer | `nginx/nginx.conf`: `least_conn` across 3 replicas, passive health checks (`max_fails`), upstream keep-alive, failover via `proxy_next_upstream`. |
| 13 | Paginate large lists | Integrations: numbered, crawlable pages (`?page=`). Admin leads: keyset/cursor pagination that stays fast at any depth. The API clamps `page` and `pageSize`. |
| 14 | Compress API payloads | gzip in Nginx (or Next when not behind Nginx, or the CDN's brotli). Endpoints return only the fields a client needs (`/api/services` is a compact projection). |
| 15 | Loading skeletons | `components/Skeletons.tsx`, used by `loading.tsx` (service detail, integrations, admin) and a keyed `<Suspense>` around directory results. |
| 16 | Cache expensive queries | `src/lib/cache.ts → cached()`. Systems 1 h, integration pages 5 min, lead stats 1 min, with in-flight de-duplication (one DB query per cold key, not one per request). `invalidate()` on writes and on seed. |
| 17 | Connection pooling | `src/lib/db.ts`: one `pg.Pool` per process (max 10, idle + connect + statement timeouts, reused across hot reloads). 3 replicas × 10 = 30 connections; add PgBouncer beyond that. |
| 18 | Fix N+1 queries | `src/lib/repo.ts`: systems + their tools in one `LEFT JOIN … json_agg` query; the integrations page, total count and "used in" systems in one `LATERAL` query; seeding uses one multi-row insert per system. |
| 19 | Server-side caching | ISR (`export const revalidate`) on every marketing page, Redis for data (shared by all replicas, memory fallback), and Nginx micro-caching of HTML (10 s). |

Also included:

- Security headers.
- HTTP Basic Auth on `/admin` (checked in middleware and again in the page).
- Rate limiting, both in the app (Redis) and in Nginx.
- A honeypot field on the contact form.
- Hashed IPs (never stored raw).
- JSON-LD structured data, `sitemap.xml`, `robots.txt`, and a generated Open Graph image.
- `prefers-reduced-motion` support throughout.
- The site stays fully readable without JavaScript.

---

## Editing content

- **Services and tools:** edit `src/content/systems.json` and `src/content/integrations.json`, then run `npm run db:seed`. The seed script clears the Redis cache.
- **Page copy** (pains, steps, plans, FAQ): `src/lib/content.ts`.
- **Illustrations:** `public/art/*.svg`. To use real screenshots, drop PNG/JPG files in `public/images`, run `npm run images:optimize`, and point the cards at the `.avif`/`.webp` output.
- **Leads:** open `/admin/leads` with `ADMIN_USER` / `ADMIN_PASSWORD`.

## Environment variables

See `.env.example`. `NEXT_PUBLIC_*` values are baked in at build time; everything else is read at runtime.

## Notes

- Commit a `package-lock.json` after your first `npm install`. The Dockerfile uses `npm ci` when one exists.
- ISR caches are per replica. Data is shared through Redis, so every replica serves the same content after revalidation.
