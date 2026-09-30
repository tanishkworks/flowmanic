import type { Metadata } from 'next';
import CtaBlock from '@/components/CtaBlock';
import PageHero from '@/components/PageHero';
import { PricingCards, SectionHead } from '@/components/Sections';
import { faqs } from '@/lib/content';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Pricing: Setup Fee + Low Monthly Retainer',
  description: 'Starter from $1,500 setup + $300/month. Growth $3,500 + $700/month. Enterprise from $5,000 + $1,200/month. Cancel anytime.',
  alternates: { canonical: '/pricing' },
};

export default function PricingPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
  return (
    <>
      <PageHero
        top="Clear"
        bottom="Pricing"
        title="Straightforward pricing. No retainer traps."
        meta={['One-time setup fee', 'Low monthly retainer']}
        size="tall"
        next="#plans"
      />
      <section className="section" id="plans">
        <div className="wrap">
          <SectionHead
            label="Pricing"
            title="Straightforward Pricing. No Retainer Traps."
            lead="One-time setup fee. Low monthly retainer. Cancel anytime."
          />
          <PricingCards />
        </div>
      </section>
      <section className="section section--flush-top" id="faq">
        <div className="wrap">
          <SectionHead label="Questions" title="What Agencies Ask Before They Book." />
          <div className="faq" data-reveal>
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <CtaBlock />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </>
  );
}
