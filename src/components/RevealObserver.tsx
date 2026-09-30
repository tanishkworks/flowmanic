'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * One IntersectionObserver for the whole page. Server components only add
 * data-reveal / data-stagger attributes, so they stay zero-JS.
 * Content is fully visible until this runs (no-JS and crawlers see everything).
 */
export default function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
      Array.from(group.children).forEach((child, i) => (child as HTMLElement).style.setProperty('--i', String(i)));
    });
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in), [data-stagger]:not(.is-in)'));
    const vh = window.innerHeight;
    // Anything already on screen is shown as-is, so there is no flash on load
    for (const el of targets) if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add('is-in');
    document.documentElement.classList.add('reveal-ready');

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    for (const el of targets) if (!el.classList.contains('is-in')) io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
