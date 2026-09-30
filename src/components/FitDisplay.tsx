'use client';

import { useEffect, useRef, type CSSProperties } from 'react';

type Line = { text: string; outline?: boolean };
type Props = {
  as?: 'h1' | 'h2';
  className: string;
  lines: Line[];
  /** Widest line = this share of the viewport width (0.665 matches the reference video) */
  frac: number;
  fracSm?: number;
  masked?: boolean;
  srText: string;
};

/**
 * Display headline (one solid line, one outlined line). CSS gives a close first-paint size;
 * this measures the real glyph widths once fonts load and fits the widest line exactly.
 */
export default function FitDisplay({ as: Tag = 'h1', className, lines, frac, fracSm, masked, srText }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => {
      const vw = document.documentElement.clientWidth;
      const f = vw < 700 && fracSm ? fracSm : frac;
      el.style.fontSize = '100px';
      let widest = 0;
      el.querySelectorAll<HTMLElement>('.d-line').forEach((line) => {
        const range = document.createRange();
        range.selectNodeContents(line);
        widest = Math.max(widest, range.getBoundingClientRect().width);
      });
      if (widest > 0) el.style.fontSize = `${((100 * vw * f) / widest).toFixed(2)}px`;
    };
    fit();
    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(fit, 120);
    };
    window.addEventListener('resize', onResize);
    document.fonts?.ready.then(fit).catch(() => {});
    return () => {
      window.removeEventListener('resize', onResize);
      window.clearTimeout(t);
    };
  }, [frac, fracSm]);

  const chars = Math.max(...lines.map((l) => l.text.length));
  const style = { '--chars': chars, '--frac': frac, '--frac-sm': fracSm ?? frac } as CSSProperties;

  return (
    <Tag ref={ref} className={className} style={style}>
      <span className="sr-only">{srText}</span>
      {lines.map((l, i) => {
        const line = (
          <span
            className={l.outline ? 'd-line outline' : 'd-line'}
            style={{ '--i': i } as CSSProperties}
            aria-hidden="true"
          >
            {l.text}
          </span>
        );
        return masked ? (
          <span className="line-mask" key={i} aria-hidden="true">
            {line}
          </span>
        ) : (
          <span key={i}>{line}</span>
        );
      })}
    </Tag>
  );
}
