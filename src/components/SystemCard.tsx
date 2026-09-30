import Link from 'next/link';
import { Fragment } from 'react';
import { asset } from '@/lib/site';
import type { System } from '@/lib/types';

export function FlowLine({ flow }: { flow: string[] }) {
  return (
    <p className="sys-flow">
      {flow.map((step, i) => (
        <Fragment key={step}>
          {i > 0 ? <b> → </b> : null}
          {step}
        </Fragment>
      ))}
    </p>
  );
}

/** Gallery card: grayscale art → colour on hover, title bar fills blue (as in the video). */
export default function SystemCard({ system }: { system: System }) {
  return (
    <Link className="sys-card" href={`/services/${system.slug}`} data-slug={system.slug} id={system.slug}>
      <div className="sys-media" style={{ background: system.artBg }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG, lazy + CDN-cacheable */}
        <img
          className="sys-art"
          src={asset(`/art/${system.slug}.svg`)}
          alt={`Illustration of the ${system.name} workflow`}
          width={1200}
          height={520}
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="sys-bar">
        <div className="sys-row">
          <h3>{system.name}</h3>
          <div className="sys-tags">
            {system.badge ? <span className="tag hot">{system.badge}</span> : null}
            <span className="tag">
              {system.setupPrice.startsWith('Scoped') ? system.setupPrice : `Setup ${system.setupPrice}`}
            </span>
            {system.monthlyPrice ? <span className="tag">{system.monthlyPrice.replace('/month', '/mo')}</span> : null}
          </div>
        </div>
        <div className="sys-foot">
          <p className="sys-desc">{system.summary}</p>
          <FlowLine flow={system.flow} />
        </div>
      </div>
    </Link>
  );
}
