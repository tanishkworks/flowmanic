'use client';

import { Fragment, useEffect, useRef, type CSSProperties } from 'react';

/** Words fill from grey to black as the heading scrolls through the viewport. One CSS variable write per frame. */
export default function StatementFill({ text, className }: { text: string; className: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.35;
      const p = (start - r.top) / (start - end + r.height * 0.6);
      el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const words = text.split(/\s+/);
  return (
    <h2 ref={ref} className={className} aria-label={text} style={{ '--n': words.length } as CSSProperties}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden="true" style={{ '--i': i } as CSSProperties}>
            {w}
          </span>{' '}
        </Fragment>
      ))}
    </h2>
  );
}
