import type { Metadata } from 'next';
import { Suspense } from 'react';
import CtaBlock from '@/components/CtaBlock';
import IntegrationsResults from '@/components/IntegrationsResults';
import IntegrationsSearch from '@/components/IntegrationsSearch';
import PageHero from '@/components/PageHero';
import { SectionHead } from '@/components/Sections';
import { IntegrationsSkeleton } from '@/components/Skeletons';
import { toInt } from '@/lib/pagination';
import { getIntegrationCategories } from '@/lib/repo';

export const metadata: Metadata = {
  title: 'Integrations: The Tools Your Agency Already Uses',
  description: 'n8n, Make, Zapier, Claude AI, Gmail, Slack, Google Workspace, Meta Ads and Google Ads APIs and more.',
  alternates: { canonical: '/integrations' },
};

type SearchParams = Promise<{ q?: string; category?: string; page?: string }>;

export default async function IntegrationsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = (sp.q ?? '').trim().slice(0, 60);
  const categories = await getIntegrationCategories();
  const category = categories.some((c) => c.category === sp.category) ? (sp.category as string) : '';
  const page = toInt(sp.page, 1, 1, 500);

  return (
    <>
      <PageHero
        top="Your stack"
        bottom="Connected"
        title="Integrations: built on the tools your agency already uses"
        meta={['Integrations', 'Built on tools you already use']}
        size="tall"
        next="#directory"
      />
      <section className="section" id="directory">
        <div className="wrap">
          <SectionHead
            label="Integrations"
            title="Built On The Tools Your Agency Already Uses."
            lead="Search the stack we build on. Each tool shows which Flowmanic systems use it."
          />
          <IntegrationsSearch initialQ={q} category={category} categories={categories} />
          {/* key forces a fresh boundary per query, so the skeleton shows while the next page loads */}
          <Suspense key={`${q}|${category}|${page}`} fallback={<IntegrationsSkeleton />}>
            <IntegrationsResults q={q} category={category} page={page} />
          </Suspense>
        </div>
      </section>
      <CtaBlock />
    </>
  );
}
