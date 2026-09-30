import type { Metadata } from 'next';
import CtaBlock from '@/components/CtaBlock';
import PageHero from '@/components/PageHero';
import { ProcessList, SectionHead, WhyGrid } from '@/components/Sections';
import Stack from '@/components/Stack';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'How It Works: Live in Under 2 Weeks',
  description: 'Discovery, audit, build, test, deploy, maintain. Your automation goes live in your own account in 14 days or less.',
  alternates: { canonical: '/how-it-works' },
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        top="Six steps"
        bottom="Two weeks"
        title="How it works: live in your account in under 2 weeks"
        meta={['How it works', 'Kickoff to live in 14 days']}
        size="tall"
        next="#process"
      />
      <section className="section" id="process">
        <div className="wrap">
          <SectionHead
            label="How it works"
            title="Live In Your Account In Under 2 Weeks."
            lead="Six steps from first call to a running system. You keep full access the whole way."
          />
          <ProcessList />
        </div>
      </section>
      <Stack />
      <section className="section">
        <div className="wrap">
          <SectionHead label="Why Flowmanic" title="We're Not a Software Tool. We're Your Automation Team." />
          <WhyGrid />
        </div>
      </section>
      <CtaBlock />
    </>
  );
}
