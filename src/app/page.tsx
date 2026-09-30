import Link from 'next/link';
import CtaBlock from '@/components/CtaBlock';
import PageHero from '@/components/PageHero';
import { Differentiators, Pains, SectionHead, SystemRows } from '@/components/Sections';
import Stack from '@/components/Stack';
import StatementFill from '@/components/StatementFill';
import { getSystems } from '@/lib/repo';

// ISR: rendered once, served from cache, refreshed in the background every hour
export const revalidate = 3600;

export default async function HomePage() {
  const systems = await getSystems();
  return (
    <>
      <PageHero
        top="Agency"
        bottom="Autopilot"
        title="Flowmanic: AI automation that puts your marketing agency on autopilot"
        meta={['Done-for-you AI automation', 'For marketing agencies only']}
        next="#statement"
      />

      <section className="statement" id="statement">
        <div className="wrap">
          <p className="label" data-reveal>
            [ Done-for-you AI automation ]
          </p>
          <StatementFill className="statement-text" text="Stop doing manually what AI can do in 30 seconds." />
          <div className="statement-foot" data-reveal>
            <p className="lead">
              Flowmanic builds AI-powered automation systems for marketing agencies — so your team stops drowning in
              reports, follow-ups, and onboarding chaos.
            </p>
            <div className="btn-row">
              <Link className="btn btn-black" href="/services">
                See What We Automate →
              </Link>
              <Link className="btn btn-ghost" href="/how-it-works">
                See How It Works ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--flush-top" id="problem">
        <div className="wrap">
          <SectionHead label="The problem" title="Your Agency Is Bleeding Time On Work That Shouldn't Exist." />
          <Pains />
        </div>
      </section>

      <section className="section section--flush-top" id="solution">
        <div className="wrap">
          <SectionHead
            label="The solution"
            title="We Build The Systems. You Run The Agency."
            lead="Flowmanic designs, builds, and deploys custom AI automation systems tailored to how marketing agencies actually work. Not generic templates — systems built around your exact workflows."
          />
          <Differentiators />
        </div>
      </section>

      <section className="section section--flush-top" id="systems">
        <div className="wrap">
          <SectionHead
            label="What we automate"
            title="Five Systems That Put Your Agency On Autopilot."
            lead="Each one runs inside your own n8n, Make, or Zapier account and goes live within 14 days."
          />
          <SystemRows systems={systems} />
          <Link className="btn btn-black more-link" href="/services">
            Explore all five systems →
          </Link>
        </div>
      </section>

      <Stack />
      <CtaBlock />
    </>
  );
}
