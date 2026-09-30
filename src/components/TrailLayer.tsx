'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

/** "Automation artifact" tiles that spawn under the cursor (desktop) or drift along a path (touch). */
const TILES: { cls: string; body: ReactNode }[] = [
  {
    cls: 'tile--p dark purple',
    body: (
      <>
        <div className="t-dots"><i /><i /><i /></div>
        <p className="t-k">Weekly report</p>
        <p className="t-big">4.1×</p>
        <p className="t-small">ROAS · Meta + Google</p>
        <div className="t-bars">
          {[40, 65, 52, 88, 72].map((h) => (
            <i key={h} style={{ '--h': `${h}%` } as CSSProperties} />
          ))}
        </div>
      </>
    ),
  },
  {
    cls: 'tile--p light',
    body: (
      <>
        <p className="t-k">New lead</p>
        <p className="t-mid">Northwind Dental</p>
        <div className="t-rule" />
        <p className="t-k">First reply sent in</p>
        <p className="t-big blue">00:18</p>
      </>
    ),
  },
  {
    cls: 'tile--l dark green',
    body: (
      <>
        <p className="t-k"># new-leads</p>
        <div className="t-msg"><b>Flowmanic</b>Priya from Northwind replied to your email.</div>
        <div className="t-msg dim"><b>Flowmanic</b>Day 3 follow-up sent.</div>
      </>
    ),
  },
  {
    cls: 'tile--p dark cyan',
    body: (
      <>
        <p className="t-k">Client onboarded</p>
        <ul className="t-list">
          <li>Welcome email</li><li>Drive folder</li><li>Tracking sheet</li><li>Checklist doc</li><li>Slack ping</li>
        </ul>
      </>
    ),
  },
  {
    cls: 'tile--s dark orange',
    body: (
      <>
        <p className="t-k">From 1 video</p>
        <p className="t-big">11</p>
        <p className="t-small">scripts, posts, outline &amp; captions</p>
      </>
    ),
  },
  {
    cls: 'tile--l dark blue',
    body: (
      <>
        <p className="t-k">n8n workflow</p>
        <div className="t-nodes"><span>Trigger</span><em /><span className="hot">Claude</span><em /><span>Gmail</span></div>
      </>
    ),
  },
  {
    cls: 'tile--s light',
    body: (
      <>
        <p className="t-k">Hours back</p>
        <p className="t-big">20h</p>
        <p className="t-small">every week, per team</p>
      </>
    ),
  },
  {
    cls: 'tile--p dark pink',
    body: (
      <>
        <p className="t-k">Content pipeline</p>
        <div className="t-play" />
        <p className="t-small">YouTube URL in. Posts out.</p>
      </>
    ),
  },
];

export default function TrailLayer() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const zone = layer?.parentElement;
    if (!layer || !zone) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const pool = Array.from(layer.children) as HTMLElement[];
    if (!pool.length || typeof pool[0].animate !== 'function') return;

    let i = 0;
    let z = 10;
    const spawn = (x: number, y: number) => {
      const el = pool[i++ % pool.length];
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const rot = (Math.random() * 22 - 11).toFixed(1);
      const tx = x - w / 2;
      const ty = y - h / 2;
      el.style.zIndex = String(++z);
      el.getAnimations().forEach((a) => a.cancel());
      el.animate(
        [
          { opacity: 0, transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(.55)`, easing: 'cubic-bezier(.16,1,.3,1)' },
          { opacity: 1, transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(1)`, offset: 0.27 },
          { opacity: 1, transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(1)`, offset: 0.46, easing: 'cubic-bezier(.55,0,1,.45)' },
          { opacity: 0, transform: `translate(${tx}px, ${ty + 24}px) rotate(${rot}deg) scale(.9)` },
        ],
        { duration: 1650, fill: 'forwards' },
      );
    };

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (fine) {
      let lastX: number | null = null;
      let lastY = 0;
      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        const r = zone.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        if (lastX === null) {
          lastX = x;
          lastY = y;
          return;
        }
        if (Math.hypot(x - lastX, y - lastY) < Math.max(60, window.innerWidth * 0.055)) return;
        lastX = x;
        lastY = y;
        spawn(x, y);
      };
      const onLeave = () => {
        lastX = null;
      };
      zone.addEventListener('pointermove', onMove);
      zone.addEventListener('pointerleave', onLeave);
      return () => {
        zone.removeEventListener('pointermove', onMove);
        zone.removeEventListener('pointerleave', onLeave);
      };
    }

    // Touch screens: gentle autoplay while the section is on screen
    let timer = 0;
    let t = 0;
    const tick = () => {
      t += 0.42;
      spawn(zone.clientWidth * (0.5 + 0.34 * Math.sin(t * 1.1)), zone.clientHeight * (0.42 + 0.22 * Math.sin(t * 1.9)));
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        window.clearInterval(timer);
        if (entry.isIntersecting) timer = window.setInterval(tick, 520);
      },
      { threshold: 0.3 },
    );
    io.observe(zone);
    return () => {
      io.disconnect();
      window.clearInterval(timer);
    };
  }, []);

  return (
    <div className="trail" ref={ref} aria-hidden="true">
      {[...TILES, ...TILES].map((tile, n) => (
        <div key={n} className={`tile ${tile.cls}`}>
          {tile.body}
        </div>
      ))}
    </div>
  );
}
