import { Fragment, type CSSProperties } from 'react';
import { stackRowA, stackRowB } from '@/lib/content';

function Marquee({ items, reverse }: { items: string[]; reverse?: boolean }) {
  // Duration scales with content length so both rows move at a similar speed. Pure CSS, no JS.
  const dur = `${Math.max(24, Math.round(items.join('').length * 0.75))}s`;
  const track = (key: string) => (
    <div className="marquee-track" key={key}>
      {[...items, ...items].map((t, i) => (
        <Fragment key={i}>
          <span>{t}</span>
          <i />
        </Fragment>
      ))}
    </div>
  );
  return (
    <div className={reverse ? 'marquee rev' : 'marquee'} style={{ '--dur': dur } as CSSProperties} aria-hidden="true">
      {track('a')}
      {track('b')}
    </div>
  );
}

export default function Stack() {
  return (
    <section className="stack" aria-labelledby="stack-label">
      <p className="label stack-label" id="stack-label">
        Built on the tools your agency already uses
      </p>
      <Marquee items={stackRowA} />
      <Marquee items={stackRowB} reverse />
      <p className="sr-only">{[...stackRowA, ...stackRowB].join(', ')}.</p>
    </section>
  );
}
