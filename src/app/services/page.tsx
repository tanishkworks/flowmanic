import type { Metadata } from 'next';
import CtaBlock from '@/components/CtaBlock';
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
      <section className="section" id="gallery" aria-label="Automation systems">
        <div className="wrap">
          <div className="head" style={{ marginBottom: 48 }}>
            <p className="label">What we automate</p>
            <h2 className="h2">Five Systems That Put Your Agency On Autopilot.</h2>
            <p className="lead" style={{ marginTop: 12 }}>
              Each one runs inside your own n8n, Make, or Zapier account and goes live within 14 days.
            </p>
          </div>
          <div className="services-static-grid">
            {systems.map((s) => (
              <SystemCard key={s.slug} system={s} />
            ))}
          </div>
        </div>
      </section>
      <CtaBlock />
    </>
  );
}
