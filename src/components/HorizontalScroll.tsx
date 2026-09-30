'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Pinned horizontal gallery using position: sticky + one transform per frame (no GSAP needed).
 * Vertical scroll maps 1:1 to horizontal travel. Below 901px the cards simply stack.
 * Listens for "hscroll:goto" (fired by the dock) to jump to a card.
 */
export default function HorizontalScroll({ children }: { children: ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;
    const mq = window.matchMedia('(min-width: 901px)');
    let dist = 0;
    let top = 0;
    let raf = 0;

    const apply = () => {
      raf = 0;
      if (!mq.matches) return;
      const p = Math.min(Math.max(window.scrollY - top, 0), dist);
      track.style.transform = `translate3d(${-p}px, 0, 0)`;
    };
    const measure = () => {
      if (!mq.matches) {
        outer.classList.remove('is-pinned');
        outer.style.height = '';
        track.style.transform = '';
        return;
      }
      outer.classList.add('is-pinned');
      dist = Math.max(0, track.scrollWidth - window.innerWidth);
      outer.style.height = `${dist + window.innerHeight}px`;
      top = outer.getBoundingClientRect().top + window.scrollY;
      apply();
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onGoto = (e: Event) => {
      const slug = (e as CustomEvent<string>).detail;
      const card = track.querySelector<HTMLElement>(`[data-slug="${CSS.escape(slug)}"]`);
      if (!card) return;
      const y = mq.matches
        ? top + Math.min(dist, Math.max(0, card.offsetLeft - 80))
        : card.getBoundingClientRect().top + window.scrollY - 90;
      if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.4 });
      else window.scrollTo({ top: y, behavior: 'smooth' });
    };

    measure();
    const ro = new ResizeObserver(() => measure());
    ro.observe(track);
    ro.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hscroll:goto', onGoto);
    mq.addEventListener('change', measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('hscroll:goto', onGoto);
      mq.removeEventListener('change', measure);
    };
  }, []);

  return (
    <div ref={outerRef} className="hscroll">
      <div className="hscroll-sticky">
        <div ref={trackRef} className="systems-track">
          {children}
        </div>
      </div>
    </div>
  );
}
