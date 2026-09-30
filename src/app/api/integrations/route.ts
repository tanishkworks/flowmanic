import { cachedJson } from '@/lib/http';
import { toInt } from '@/lib/pagination';
import { getIntegrations } from '@/lib/repo';

/** GET /api/integrations?q=slack&category=Communication&page=1&pageSize=12 */
export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const data = await getIntegrations({
    q: sp.get('q') ?? '',
    category: sp.get('category') ?? '',
    page: toInt(sp.get('page'), 1, 1, 500),
    pageSize: toInt(sp.get('pageSize'), 12, 1, 24),
  });
  return cachedJson(req, data, { sMaxAge: 300 });
}
