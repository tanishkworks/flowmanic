import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CtaBlock from '@/components/CtaBlock';
import PageHero from '@/components/PageHero';
import { FlowLine } from '@/components/SystemCard';
import { getSystem, getSystems, staticSystems } from '@/lib/repo';
import { asset, site } from '@/lib/site';

export const revalidate = 3600;
// New slugs added to the DB later are rendered on first request, then cached
export const dynamicParams = true;

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return staticSystems().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const system = await getSystem(slug);
  if (!system) return { title: 'Not found' };
  return {
    title: system.name,
    description: system.summary,
    alternates: { canonical: `/services/${slug}` },
    openGraph: { title: `${system.name} | Flowmanic`, description: system.summary, images: [asset(`/art/${slug}.svg`)] },
  };
}

export default async function SystemPage({ params }: Params) {
  const { slug } = await params;
  const systems = await getSystems();
  const index = systems.findIndex((s) => s.slug === slug);
  if (index < 0) notFound();
  const system = systems[index];
  const prev = systems[(index - 1 + systems.length) % systems.length];
  const next = systems[(index + 1) % systems.length];
  const num = String(system.position).padStart(2, '0');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: system.name,
    description: system.summary,
    provider: { '@type': 'Organization', name: 'Flowmanic', url: site.url },
    areaServed: 'Worldwide',
    audience: { '@type': 'BusinessAudience', audienceType: 'Marketing agencies' },
  };

  return (
    <>
      <PageHero
        top={system.displayTop}
        bottom={system.displayBottom}
        title={system.name}
        meta={[`System ${num}`, system.badge ?? 'Done for you']}
        size="tall"
        next="#overview"
      />

      <section className="section" id="overview">
        <div className="wrap detail-grid">
          <div data-reveal>
            <p className="label">System {num}</p>
            <h2 className="h2">{system.name}</h2>
            <p className="lead" style={{ marginTop: 24 }}>
              {system.summary}
            </p>
            <figure className="detail-art" style={{ background: system.artBg }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={asset(`/art/${system.slug}.svg`)}
                alt={`Illustration of the ${system.name} workflow`}
                width={1200}
                height={520}
                loading="lazy"
                decoding="async"
              />
            </figure>
          </div>
          <aside className="price-box" data-reveal>
            <div className="price-box-top">
              <h3 className="tier">Pricing</h3>
              {system.badge ? <span className="tag fill">{system.badge}</span> : null}
            </div>
            <div className="price-box-body">
              <dl>
                <div>
                  <dt>Setup</dt>
                  <dd>{system.setupPrice}</dd>
                </div>
                {system.monthlyPrice ? (
                  <div>
                    <dt>Monthly retainer</dt>
                    <dd>{system.monthlyPrice}</dd>
                  </div>
                ) : null}
              </dl>
              <p>Built in your own n8n, Make, or Zapier account. You own everything. Live in 14 days or less.</p>
            </div>
            <Link className="price-cta" href={`/contact?system=${system.slug}`}>
              Book a Free Audit <span aria-hidden="true">→</span>
            </Link>
          </aside>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="wrap two-col">
          <div data-reveal>
            <p className="label">What it does</p>
            <ol className="outcomes">
              {system.outcomes.map((o, i) => (
                <li key={o}>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {o}
                </li>
              ))}
            </ol>
          </div>
          <div data-reveal>
            <p className="label">How it runs</p>
            {system.tools.length ? (
              <ol className="flow-steps">
                {system.tools.map((t, i) => (
                  <li key={t.slug}>
                    <Link href={`/integrations?q=${encodeURIComponent(t.name)}`}>
                      <span className="fs-name">{t.name}</span>
                    </Link>
                    <span className="fs-step">STEP {String(i + 1).padStart(2, '0')}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <div className="flow-steps" style={{ paddingTop: 20 }}>
                <FlowLine flow={system.flow} />
              </div>
            )}
          </div>
        </div>
      </section>

      <nav className="nextprev" aria-label="More systems">
        <Link href={`/services/${prev.slug}`}>
          <small>← Previous system</small>
          <strong>{prev.shortName}</strong>
        </Link>
        <Link href={`/services/${next.slug}`}>
          <small>Next system →</small>
          <strong>{next.shortName}</strong>
        </Link>
      </nav>

      <CtaBlock href={`/contact?system=${system.slug}`} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
