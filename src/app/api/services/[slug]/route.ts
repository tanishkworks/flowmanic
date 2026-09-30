import { cachedJson, jsonError } from '@/lib/http';
import { getSystem } from '@/lib/repo';

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const system = await getSystem(slug);
  if (!system) return jsonError(404, 'System not found.');
  return cachedJson(req, system, { sMaxAge: 3600 });
}
