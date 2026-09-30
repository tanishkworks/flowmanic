'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type MouseEvent } from 'react';
import { isActivePath } from './Nav';

const PAGES = [
  { href: '/services', label: 'Services' },
  { href: '/how-it-works', label: 'Process' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/contact', label: 'Contact' },
];

type Props = { systems: { slug: string; position: number }[] };

/** The fixed pill at the bottom. On /services it becomes "System 01–05" jump links, like the video's "Wing 01–04". */
export default function Dock({ systems }: Props) {
  const pathname = usePathname() ?? '/';
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.getElementById('site-footer');
    if (!footer) return;
    const io = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), {
      rootMargin: '0px 0px -8% 0px',
    });
    io.observe(footer);
    return () => io.disconnect();
  }, []);

  if (pathname.startsWith('/admin')) return null;
  const onServices = pathname === '/services';

  return (
    <nav className={hidden ? 'dock hide' : 'dock'} aria-label="Section shortcuts">
      {onServices
        ? systems.map((s) => (
            <a
              key={s.slug}
              href={`#${s.slug}`}
              onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent<string>('hscroll:goto', { detail: s.slug }));
              }}
            >
              <span className="dock-pre">System </span>
              {String(s.position).padStart(2, '0')}
            </a>
          ))
        : PAGES.map((p) => (
            <Link key={p.href} href={p.href} className={isActivePath(pathname, p.href) ? 'active' : undefined}>
              {p.label}
            </Link>
          ))}
    </nav>
  );
}
