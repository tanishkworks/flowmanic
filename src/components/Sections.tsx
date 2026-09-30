import Link from 'next/link';
import type { ReactNode } from 'react';
import { differentiators, pains, plans, pricingNote, steps, whyPoints } from '@/lib/content';
import type { System } from '@/lib/types';

export function SectionHead({ label, title, lead, as = 'h2' }: { label: string; title: string; lead?: ReactNode; as?: 'h1' | 'h2' }) {
  const Title = as;
  if (!lead) {
    return (
      <div className="head" data-reveal>
        <p className="label">{label}</p>
        <Title className="h2">{title}</Title>
      </div>
    );
  }
  return (
    <div className="split" data-reveal>
      <div>
        <p className="label">{label}</p>
        <Title className="h2">{title}</Title>
      </div>
      <div className="lead">{lead}</div>
    </div>
  );
}

export function Pains() {
  return (
    <div className="pain-grid" data-stagger>
      {pains.map((p, i) => (
        <article className="pain" key={p.title}>
          <span className="pain-num" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3>{p.title}</h3>
          <p>{p.body}</p>
        </article>
      ))}
    </div>
  );
}

export function Differentiators() {
  return (
    <div className="diff-row" data-stagger>
      {differentiators.map((d) => (
        <div className="diff" key={d.title}>
          <span className="tag">{d.tag}</span>
          <h3>{d.title}</h3>
          <p>{d.body}</p>
        </div>
      ))}
    </div>
  );
}

export function WhyGrid() {
  return (
    <div className="why-grid" data-stagger>
      {whyPoints.map((w) => (
        <div className="why-col" key={w.title}>
          <span className="why-dot" aria-hidden="true" />
          <h3>{w.title}</h3>
          <p>{w.body}</p>
        </div>
      ))}
    </div>
  );
}

export function ProcessList() {
  return (
    <ol className="steps" data-stagger>
      {steps.map((s, i) => (
        <li className="step" key={s.title}>
          <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
          <h3>{s.title}</h3>
          <p>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function PricingCards() {
  return (
    <>
      <div className="price-grid" data-stagger>
        {plans.map((p) => (
          <article className={p.featured ? 'price-card featured' : 'price-card'} key={p.tier}>
            <div className="price-top">
              <h3 className="tier">{p.tier}</h3>
              {p.featured ? <span className="tag fill">Most popular</span> : null}
            </div>
            <div className="price-body">
              <div className="price-amt">
                {p.from ? <small>from</small> : null}
                <strong>{p.setup}</strong>
                <small>setup</small>
              </div>
              <p className="price-mo">+ {p.monthly}</p>
              <ul className="features">
                {p.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
            <Link className="price-cta" href={`/contact?plan=${p.tier.toLowerCase()}`}>
              {p.cta} <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </div>
      <p className="price-note" data-reveal>
        {pricingNote}
      </p>
    </>
  );
}

export function EarlyResults() {
  return (
    <div className="proof">
      <div data-reveal>
        <p className="label">What agencies say</p>
        <h2 className="h2">Early Results Coming.</h2>
      </div>
      <figure className="proof-card" data-reveal>
        <div className="proof-q" aria-hidden="true">
          “
        </div>
        <blockquote>
          <p>We&apos;re currently deploying with our first clients and will be publishing verified results shortly.</p>
          <p>
            If you want to be one of the first — we&apos;ll build your first automation and document the results
            together.
          </p>
        </blockquote>
        <figcaption className="proof-foot">
          <span className="proof-by">The Flowmanic team · Indore, India</span>
          <Link className="btn btn-black" href="/contact">
            Be an Early Client →
          </Link>
        </figcaption>
      </figure>
    </div>
  );
}

export function SystemRows({ systems }: { systems: System[] }) {
  return (
    <ol className="sys-rows" data-stagger>
      {systems.map((s) => (
        <li key={s.slug}>
          <Link href={`/services/${s.slug}`}>
            <span className="sr-num">{String(s.position).padStart(2, '0')}</span>
            <span className="sr-name">{s.name}</span>
            <span className="sr-price">
              {s.setupPrice}
              {s.monthlyPrice ? (
                <>
                  <br />+ {s.monthlyPrice}
                </>
              ) : null}
            </span>
            <span className="sr-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
