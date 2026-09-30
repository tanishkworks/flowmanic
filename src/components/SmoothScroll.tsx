'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Lenis smooth scrolling, loaded as a separate chunk after the page is interactive
 * (it is non-critical, so it never blocks first paint). Also handles in-page #anchors.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let cancelled = false;
    let destroy: (() => void) | undefined;

    import('lenis').then(({ default: Lenis }) => {
      if (cancelled) return;
      const lenis = new Lenis({ duration: 1.1, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      window.__lenis = lenis;
      const loop = (time: number) => {
        lenis.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      destroy = () => {
        cancelAnimationFrame(raf);
        lenis.destroy();
        window.__lenis = undefined;
      };
    });

    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a || !window.__lenis || e.defaultPrevented) return;
      const id = a.getAttribute('href') ?? '';
      if (id.length < 2) return;
      const target = document.querySelector<HTMLElement>(id);
      if (!target) return;
      e.preventDefault();
      window.__lenis.scrollTo(target, { duration: 1.3 });
    };
    document.addEventListener('click', onClick);

    return () => {
      cancelled = true;
      document.removeEventListener('click', onClick);
      destroy?.();
    };
  }, []);

  // Route change: jump to top instantly so Lenis and the browser agree on position
  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
