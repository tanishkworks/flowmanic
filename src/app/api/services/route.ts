import { cachedJson } from '@/lib/http';
import { getSystems } from '@/lib/repo';

/** Compact payload: only the fields a client needs (smaller response, better compression). */
export async function GET(req: Request) {
  const systems = await getSystems();
  return cachedJson(
    req,
    {
      items: systems.map((s) => ({
        slug: s.slug,
        name: s.name,
        summary: s.summary,
        setupPrice: s.setupPrice,
        monthlyPrice: s.monthlyPrice,
        badge: s.badge,
        flow: s.flow,
        url: `/services/${s.slug}`,
      })),
    },
    { sMaxAge: 3600 },
  );
}
