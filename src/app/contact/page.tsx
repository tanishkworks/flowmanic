import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import PageHero from '@/components/PageHero';
import { staticSystems } from '@/lib/repo';
import { site } from '@/lib/site';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Book a Free 30-Minute Automation Audit',
  description: "No pitch. No pressure. Just a clear map of what to automate and what it's worth to your agency.",
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const interests = [
    ...staticSystems().map((s) => ({ value: s.slug, label: s.shortName })),
    { value: 'not-sure', label: 'Not sure yet' },
  ];
  return (
    <>
      <PageHero
        top="Free"
        bottom="Audit"
        title="Book a free 30-minute automation audit"
        meta={['30 minutes', 'No pitch. No pressure.']}
        size="tall"
        next="#book"
      />
      <section className="section" id="book">
        <div className="wrap contact-grid">
          <div data-reveal>
            <p className="label">Book a free audit</p>
            <h2 className="h2" style={{ marginBottom: 40 }}>
              Let&apos;s Find Out Exactly What To Automate First.
            </h2>
            <ContactForm interests={interests} bookingUrl={site.bookingUrl || undefined} email={site.email} />
          </div>
          <aside data-reveal>
            <p className="label">What happens next</p>
            <ol className="next-steps">
              <li>
                <span>01</span>Tell us what eats your team&apos;s time each week.
              </li>
              <li>
                <span>02</span>We meet for a free 30-minute automation audit.
              </li>
              <li>
                <span>03</span>You get a clear map of what to automate first and what it&apos;s worth to your agency.
              </li>
            </ol>
            <div className="contact-meta">
              <span className="label" style={{ margin: '12px 0 4px' }}>
                Prefer email?
              </span>
              <a href={`mailto:${site.email}`}>{site.email}</a>
              {site.bookingUrl ? (
                <a href={site.bookingUrl} target="_blank" rel="noopener noreferrer">
                  Pick a time directly ↗
                </a>
              ) : null}
              <span style={{ marginTop: 12 }}>{site.location} · Serving globally</span>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
