import type { Metadata } from 'next';
import { AboutNarrative } from '@/components/AboutNarrative';
import CtaBlock from '@/components/CtaBlock';
import PageHero from '@/components/PageHero';
import { Differentiators, SectionHead, WhyGrid } from '@/components/Sections';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'About Us — Mission, Story & Digital Architecture | Flowmanic',
  description:
    'Flowmanic (flowmanic.tech) is a specialized AI & n8n automation agency. Discover our story, mission, and how we engineer autonomous agency systems.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Us — Mission & Digital Architecture | Flowmanic',
    description:
      'Flowmanic (flowmanic.tech) is an AI & n8n automation agency engineering custom workflow systems for marketing agencies worldwide.',
    url: 'https://flowmanic.tech/about',
  },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        top="Autonomous"
        bottom="Execution"
        title="Flowmanic Was Never Meant To Be Ordinary."
        meta={['Indore, Madhya Pradesh, India', 'Serving agencies globally']}
        size="tall"
        next="#story"
      />

      {/* Narrative & Story Blocks (Chapters 01.01, 01.02, 01.03) */}
      <AboutNarrative />

      {/* Why Flowmanic Grid */}
      <section className="section section--flush-top" id="why">
        <div className="wrap">
          <SectionHead
            label="Why Flowmanic"
            title="We're Not a Software Tool. We're Your Automation Team."
            lead="No fragile Zapier chains or generic templates. We build custom production-ready systems tailored to how your agency works."
          />
          <WhyGrid />
        </div>
      </section>

      {/* How We Work */}
      <section className="section section--flush-top" id="how">
        <div className="wrap">
          <SectionHead
            label="How we work"
            title="We Build The Systems. You Run The Agency."
            lead="Flowmanic designs, builds, and deploys custom AI automation systems tailored to how marketing agencies actually work. Not generic templates — systems built around your exact workflows."
          />
          <Differentiators />
        </div>
      </section>

      <CtaBlock />
    </>
  );
}
