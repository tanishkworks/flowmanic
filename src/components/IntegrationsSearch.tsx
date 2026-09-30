'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition, type ChangeEvent } from 'react';
import { useDebouncedValue } from '@/lib/hooks';

type Props = {
  initialQ: string;
  category: string;
  categories: { category: string; count: number }[];
};

function buildHref(pathname: string, q: string, category: string) {
  const params = new URLSearchParams();
  if (q) params.set('q', q);
  if (category) params.set('category', category);
  const qs = params.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

/**
 * Search box is debounced (300 ms): the server is queried once the user pauses,
 * not on every keystroke. The results list re-renders on the server (cached) and
 * streams in behind a skeleton.
 */
export default function IntegrationsSearch({ initialQ, category, categories }: Props) {
  const router = useRouter();
  const pathname = usePathname() ?? '/integrations';
  const [q, setQ] = useState(initialQ);
  const [pending, startTransition] = useTransition();
  const debounced = useDebouncedValue(q.trim(), 300);
  const lastPushed = useRef(initialQ.trim());

  useEffect(() => {
    if (debounced === lastPushed.current) return;
    lastPushed.current = debounced;
    startTransition(() => router.replace(buildHref(pathname, debounced, category), { scroll: false }));
  }, [debounced, category, pathname, router]);

  return (
    <div className="dir-controls">
      <div className="search" role="search">
        <label className="sr-only" htmlFor="int-search">
          Search integrations
        </label>
        <input
          id="int-search"
          type="search"
          placeholder="Search tools… (e.g. Slack, Sheets)"
          value={q}
          maxLength={60}
          autoComplete="off"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setQ(e.target.value)}
        />
        {pending ? <span className="spin" aria-label="Searching" /> : null}
      </div>
      <nav className="chips" aria-label="Filter by category">
        <Link className="chip" href={buildHref(pathname, q.trim(), '')} scroll={false} aria-current={category === '' ? 'true' : undefined}>
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.category}
            className="chip"
            href={buildHref(pathname, q.trim(), c.category)}
            scroll={false}
            aria-current={category === c.category ? 'true' : undefined}
          >
            {c.category}
            <small>{c.count}</small>
          </Link>
        ))}
      </nav>
    </div>
  );
}
