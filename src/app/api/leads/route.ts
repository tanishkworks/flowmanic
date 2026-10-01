import { after } from 'next/server';
import { hasDb } from '@/lib/db';
import { clientIp, hashIp, jsonError } from '@/lib/http';
import { notifyLead } from '@/lib/notify';
import { rateLimit } from '@/lib/rate-limit';
import { INTEREST_OPTIONS, createLead } from '@/lib/repo';
import { validateLead } from '@/lib/validation';

const MAX_BYTES = 16_000;

export async function POST(req: Request) {
  if (!(req.headers.get('content-type') ?? '').includes('application/json')) return jsonError(415, 'Send JSON.');
  if (Number(req.headers.get('content-length') ?? 0) > MAX_BYTES) return jsonError(413, 'Payload too large.');

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError(400, 'Invalid JSON.');
  }

  // Honeypot: bots fill the hidden field. Pretend success so they don't retry.
  const hp = (body as Record<string, unknown> | null)?.company_url;
  if (typeof hp === 'string' && hp.trim()) return Response.json({ ok: true }, { status: 201 });

  const ipHash = hashIp(clientIp(req));
  const limit = await rateLimit(`lead:${ipHash}`, 5, 600);
  if (!limit.ok) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please try again in a few minutes.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': String(limit.resetSeconds), 'Cache-Control': 'no-store' },
    });
  }

  const result = validateLead(body, INTEREST_OPTIONS);
  if (!result.ok) return jsonError(422, 'Please fix the highlighted fields.', { errors: result.errors });

  let id: string | null = null;
  if (hasDb()) {
    try {
      id = (
        await createLead(result.data, {
          ipHash,
          source: typeof (body as Record<string, unknown>).source === 'string' ? ((body as Record<string, unknown>).source as string) : null,
          userAgent: req.headers.get('user-agent'),
        })
      ).id;
    } catch (err) {
      console.error('[leads] insert failed:', (err as Error).message);
    }
  }

  // Notifications run after the response is sent, so the visitor never waits on external APIs
  const lead = result.data;
  after(() => notifyLead(lead, id));

  return Response.json({ ok: true, id }, { status: 201, headers: { 'Cache-Control': 'no-store' } });
}
