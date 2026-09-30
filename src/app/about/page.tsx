import type { Metadata } from 'next';
import CtaBlock from '@/components/CtaBlock';
import PageHero from '@/components/PageHero';
import { Differentiators, EarlyResults, SectionHead, WhyGrid } from '@/components/Sections';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'About: Your Automation Team',
  description: 'Flowmanic is an AI automation team that works exclusively with marketing agencies. Based in Indore, India, serving globally.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        top="Not a tool."
        bottom="Your team."
        title="We're not a software tool. We're your automation team."
        meta={['Indore, India', 'Serving globally']}
        size="tall"
        next="#why"
      />
      <section className="section" id="why">
        <div className="wrap">
          <SectionHead label="Why Flowmanic" title="We're Not a Software Tool. We're Your Automation Team." />
          <WhyGrid />
        </div>
      </section>
      <section className="section section--flush-top">
        <div className="wrap">
          <SectionHead
            label="How we work"
            title="We Build The Systems. You Run The Agency."
            lead="Flowmanic designs, builds, and deploys custom AI automation systems tailored to how marketing agencies actually work. Not generic templates — systems built around your exact workflows."
          />
          <Differentiators />
        </div>
      </section>
      <section className="section section--rule" id="results">
        <div className="wrap">
          <EarlyResults />
        </div>
      </section>
      <CtaBlock />
    </>
  );
}
