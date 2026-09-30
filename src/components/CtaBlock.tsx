import Link from 'next/link';
import FitDisplay from './FitDisplay';
import TrailLayer from './TrailLayer';

export default function CtaBlock({ href = '/contact' }: { href?: string }) {
  return (
    <section className="cta" data-trail>
      <TrailLayer />
      <div className="wrap" data-reveal>
        <FitDisplay
          as="h2"
          className="cta-title"
          frac={0.84}
          fracSm={0.9}
          srText="Your team is losing 20 hours a week to work that AI should be doing."
          lines={[
            { text: 'Your team is losing' },
            { text: '20 hours a week', outline: true },
            { text: 'to work that AI' },
            { text: 'should be doing.', outline: true },
          ]}
        />
        <p className="cta-sub">Let&apos;s find out exactly what to automate first.</p>
        <Link className="btn btn-black btn-lg" href={href}>
          Book a Free 30-Minute Automation Audit →
        </Link>
        <p className="cta-small">
          No pitch. No pressure. Just a clear map of what to automate and what it&apos;s worth to your agency.
        </p>
      </div>
    </section>
  );
}
