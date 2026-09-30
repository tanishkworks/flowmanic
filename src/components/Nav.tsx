'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import BrandMark from './BrandMark';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/integrations', label: 'Integrations' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Nav() {
  const pathname = usePathname() ?? '/';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const scrolledRef = useRef(false);

  // Only re-render when the 60px threshold is crossed, not on every scroll event
  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 60;
      if (next !== scrolledRef.current) {
        scrolledRef.current = next;
        setScrolled(next);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className={scrolled ? 'nav scrolled' : 'nav'}>
        <div className="nav-inner">
          <Link className="brand" href="/" aria-label="Flowmanic home">
            <BrandMark />
            <span className="brand-name">FLOWMANIC</span>
          </Link>
          <nav className="nav-primary" aria-label="Primary">
            <div className="nav-links">
              {LINKS.slice(1).map((l) => (
                <Link key={l.href} href={l.href} aria-current={isActivePath(pathname, l.href) ? 'page' : undefined}>
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>
          <div className="nav-right">
            <Link className="btn btn-black nav-cta" href="/contact">
              Book a Free Audit
            </Link>
            <button
              type="button"
              className="burger"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div className="menu" id="menu" inert={!open}>
        <ul>
          {LINKS.map((l, i) => (
            <li key={l.href}>
              <Link href={l.href} aria-current={isActivePath(pathname, l.href) ? 'page' : undefined}>
                {l.label} <span>{String(i + 1).padStart(2, '0')}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link className="btn btn-black btn-lg" href="/contact">
          Book a Free Audit →
        </Link>
      </div>
    </>
  );
}
