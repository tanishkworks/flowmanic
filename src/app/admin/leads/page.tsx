import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isAuthorizedAdmin } from '@/lib/auth';
import { hasDb } from '@/lib/db';
import { LEAD_STATUSES, getLeadStats, listLeads } from '@/lib/repo';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Leads', robots: { index: false, follow: false } };

type SearchParams = Promise<{ cursor?: string; status?: string }>;

const fmt = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' });

export default async function LeadsPage({ searchParams }: { searchParams: SearchParams }) {
  // Middleware prompts for credentials; this second check means the page is safe even if middleware is misconfigured
  const h = await headers();
  if (!isAuthorizedAdmin(h.get('authorization'))) notFound();

  if (!hasDb()) {
    return (
      <section className="admin">
        <div className="wrap">
          <h1 className="h2">Leads</h1>
          <p className="lead" style={{ marginTop: 20 }}>
            DATABASE_URL is not configured, so leads are only delivered to your webhook.
          </p>
        </div>
      </section>
    );
  }

  const sp = await searchParams;
  const [{ items, nextCursor, status }, stats] = await Promise.all([
    listLeads({ cursor: sp.cursor, status: sp.status, limit: 25 }),
    getLeadStats(),
  ]);
  const qs = (extra: Record<string, string | null | undefined>) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(extra)) if (v) p.set(k, v);
    const s = p.toString();
    return s ? `/admin/leads?${s}` : '/admin/leads';
  };

  return (
    <section className="admin">
      <div className="wrap">
        <p className="label">Admin</p>
        <h1 className="h2">Leads ({stats.total})</h1>
        <nav className="admin-stats chips" aria-label="Filter by status">
          <Link className="chip" href="/admin/leads" aria-current={!status ? 'true' : undefined}>
            All <small>{stats.total}</small>
          </Link>
          {LEAD_STATUSES.map((s) => (
            <Link key={s} className="chip" href={qs({ status: s })} aria-current={status === s ? 'true' : undefined}>
              {s} <small>{stats.byStatus[s] ?? 0}</small>
            </Link>
          ))}
        </nav>
        {items.length ? (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Received</th>
                  <th>Name</th>
                  <th>Agency</th>
                  <th>Interest</th>
                  <th>Team</th>
                  <th>Message</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((l) => (
                  <tr key={l.id}>
                    <td>{fmt.format(new Date(l.createdAt))}</td>
                    <td>
                      {l.name}
                      <small>
                        <a href={`mailto:${l.email}`}>{l.email}</a>
                      </small>
                    </td>
                    <td>
                      {l.agency}
                      {l.website ? (
                        <small>
                          <a href={l.website} target="_blank" rel="noopener noreferrer nofollow">
                            {l.website.replace(/^https?:\/\//, '')}
                          </a>
                        </small>
                      ) : null}
                    </td>
                    <td>{l.interest}</td>
                    <td>{l.teamSize}</td>
                    <td style={{ maxWidth: 320 }}>{l.message ?? '—'}</td>
                    <td>
                      <span className="status">{l.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="int-empty">No leads yet.</p>
        )}
        <div className="pager">
          <span className="pager-info">Showing {items.length} · newest first</span>
          <div className="pager-pages">
            {sp.cursor ? <Link href={qs({ status })}>First</Link> : null}
            {nextCursor ? <Link href={qs({ status, cursor: nextCursor })}>Next →</Link> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
