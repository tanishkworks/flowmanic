import Link from 'next/link';
import { pageList } from '@/lib/pagination';

type Props = { basePath: string; page: number; totalPages: number; total: number; params?: Record<string, string> };

function href(basePath: string, params: Record<string, string>, page: number) {
  const sp = new URLSearchParams(Object.entries(params).filter(([, v]) => v));
  if (page > 1) sp.set('page', String(page));
  const qs = sp.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Crawlable numbered pagination (plain links, rendered on the server). */
export default function Pagination({ basePath, page, totalPages, total, params = {} }: Props) {
  if (totalPages <= 1) return <p className="pager-info" style={{ marginTop: 28 }}>{total} {total === 1 ? 'result' : 'results'}</p>;
  return (
    <nav className="pager" aria-label="Pagination">
      <span className="pager-info">
        Page {page} of {totalPages} · {total} results
      </span>
      <div className="pager-pages">
        <Link className={page <= 1 ? 'dim' : undefined} href={href(basePath, params, page - 1)} scroll={false} aria-disabled={page <= 1} rel="prev">
          ←
        </Link>
        {pageList(page, totalPages).map((p, i) =>
          p === '…' ? (
            <span className="p" key={`e${i}`}>…</span>
          ) : (
            <Link key={p} href={href(basePath, params, p)} scroll={false} aria-current={p === page ? 'page' : undefined}>
              {p}
            </Link>
          ),
        )}
        <Link className={page >= totalPages ? 'dim' : undefined} href={href(basePath, params, page + 1)} scroll={false} aria-disabled={page >= totalPages} rel="next">
          →
        </Link>
      </div>
    </nav>
  );
}
