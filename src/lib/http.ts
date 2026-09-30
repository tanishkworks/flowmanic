import { createHash } from 'node:crypto';

type CacheOpts = { sMaxAge?: number; staleWhileRevalidate?: number; maxAge?: number };

/**
 * JSON response for public GET endpoints:
 * - Cache-Control lets the CDN / Nginx cache it (s-maxage) and serve stale while refreshing
 * - ETag + If-None-Match returns 304 with no body when nothing changed
 * Payload compression (gzip/brotli) is applied by Next, Nginx or the CDN based on Accept-Encoding.
 */
export function cachedJson(req: Request, data: unknown, opts: CacheOpts = {}): Response {
  const { sMaxAge = 300, staleWhileRevalidate = 86_400, maxAge = 0 } = opts;
  const body = JSON.stringify(data);
  const etag = `W/"${createHash('sha1').update(body).digest('base64url')}"`;
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': `public, max-age=${maxAge}, s-maxage=${sMaxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
    ETag: etag,
    Vary: 'Accept-Encoding',
  });
  if (req.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers });
  return new Response(body, { status: 200, headers });
}

export function jsonError(status: number, message: string, extra: Record<string, unknown> = {}): Response {
  return new Response(JSON.stringify({ error: message, ...extra }), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

export function hashIp(ip: string): string {
  return createHash('sha256')
    .update(`${process.env.IP_HASH_SALT || 'flowmanic'}:${ip}`)
    .digest('hex')
    .slice(0, 32);
}
