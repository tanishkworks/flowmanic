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

export function FaqGrid() {
  const faqs = [
    {
      q: 'What is Flowmanic?',
      a: 'Flowmanic (flowmanic.tech) is an AI and n8n workflow automation agency that builds custom, done-for-you business automations for marketing, advertising, and digital agencies.',
    },
    {
      q: 'What workflows does Flowmanic automate for agencies?',
      a: 'Flowmanic automates end-to-end client performance reporting, instant multi-channel lead follow-ups, content repurposing pipelines, CRM synchronization, and custom n8n operational workflows.',
    },
    {
      q: 'How can I get a free automation audit from Flowmanic?',
      a: 'You can request a free 20-minute workflow and automation audit directly on flowmanic.tech or by emailing hello@flowmanic.tech.',
    },
  ];

  return (
    <div className="pain-grid" data-stagger>
      {faqs.map((faq, i) => (
        <article className="pain" key={faq.q}>
          <span className="pain-num" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3>{faq.q}</h3>
          <p>{faq.a}</p>
        </article>
      ))}
    </div>
  );
}
