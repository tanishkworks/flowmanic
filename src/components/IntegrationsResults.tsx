import Link from 'next/link';
import { getIntegrations } from '@/lib/repo';
import Pagination from './Pagination';

export const PAGE_SIZE = 6;

/** Async server component: one cached query returns the page, the total and each tool's systems. */
export default async function IntegrationsResults({ q, category, page }: { q: string; category: string; page: number }) {
  const result = await getIntegrations({ q, category, page, pageSize: PAGE_SIZE });

  if (!result.items.length) {
    return (
      <div className="int-empty">
        No tools match{q ? ` “${q}”` : ''}. We build custom integrations too —{' '}
        <Link href="/services/custom-automation">see Custom Automation</Link>.
      </div>
    );
  }

  return (
    <>
      <div className="int-grid">
        {result.items.map((i) => (
          <article className="int-card" key={i.slug}>
            <p className="int-cat">{i.category}</p>
            <h3>{i.name}</h3>
            <p>{i.description}</p>
            <div className="int-used">
              {i.usedIn.length ? (
                i.usedIn.map((s) => (
                  <span className="tag" key={s.slug}>
                    {s.name}
                  </span>
                ))
              ) : (
                <span className="tag">Custom builds</span>
              )}
            </div>
          </article>
        ))}
      </div>
      <Pagination
        basePath="/integrations"
        page={result.page}
        totalPages={result.totalPages}
        total={result.total}
        params={{ q, category }}
      />
    </>
  );
}
