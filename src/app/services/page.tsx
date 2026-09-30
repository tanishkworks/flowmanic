import type { Metadata } from 'next';
import CtaBlock from '@/components/CtaBlock';
import HorizontalScroll from '@/components/HorizontalScroll';
import PageHero from '@/components/PageHero';
import SystemCard from '@/components/SystemCard';
import { getSystems } from '@/lib/repo';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Services: Five Automation Systems',
  description:
    'Client reporting, AI lead follow-up, content repurposing, client onboarding and custom automation, built for marketing agencies.',
  alternates: { canonical: '/services' },
};

/** Replica of the reference "Work" page: exhibition hero, then a pinned horizontal gallery. */
export default async function ServicesPage() {
  const systems = await getSystems();
  return (
    <>
      <PageHero
        top="Five"
        bottom="Systems"
        title="Five automation systems for marketing agencies"
        meta={['What we automate', 'Vol. 01 / Flowmanic']}
        next="#gallery"
      />
      <section id="gallery" aria-label="Automation systems">
        <HorizontalScroll>
          <div className="sys-panel">
            <p className="label">What we automate</p>
            <h2 className="h2">Five Systems That Put Your Agency On Autopilot.</h2>
            <p className="lead">
              Each one runs inside your own n8n, Make, or Zapier account and goes live within 14 days.
            </p>
            <p className="sys-hint">
              Scroll <span className="scroll-line" />
            </p>
          </div>
          {systems.map((s) => (
            <SystemCard key={s.slug} system={s} />
          ))}
        </HorizontalScroll>
      </section>
      <CtaBlock />
    </>
  );
}
