import type { MetadataRoute } from 'next';
import { getSystems } from '@/lib/repo';
import { site } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = site.url.replace(/\/$/, '');
  const now = new Date();
  const pages = ['', '/services', '/how-it-works', '/pricing', '/integrations', '/about', '/contact'].map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: p === '' ? 1 : 0.8,
  }));
  const systems = (await getSystems()).map((s) => ({
    url: `${base}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  return [...pages, ...systems];
}
