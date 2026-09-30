import Link from 'next/link';
import systems from '@/content/systems.json';
import { site } from '@/lib/site';
import BrandMark from './BrandMark';

export default function Footer() {
  const year = Math.max(2026, new Date().getFullYear());
  return (
    <footer className="footer" id="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-about">
          <Link className="brand" href="/" aria-label="Flowmanic home">
            <BrandMark />
            <span className="brand-name">FLOWMANIC</span>
          </Link>
          <p>
            {site.tagline}
            <br />
            {site.location} · Serving globally
          </p>
          <div className="socials">
            {site.linkedinUrl ? (
              <a href={site.linkedinUrl} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            ) : null}
            {site.xUrl ? (
              <a href={site.xUrl} target="_blank" rel="noopener noreferrer">
                X / Twitter ↗
              </a>
            ) : null}
          </div>
        </div>
        <nav aria-label="Footer">
          <h4>Navigation</h4>
          <ul className="f-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/how-it-works">How It Works</Link></li>
            <li><Link href="/pricing">Pricing</Link></li>
            <li><Link href="/integrations">Integrations</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </nav>
        <div>
          <h4>Systems</h4>
          <ul className="f-links">
            {systems.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`}>{s.shortName}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Contact</h4>
          <div className="f-contact">
            <a className="f-mail" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <Link className="btn btn-black" href="/contact">
              Book a Call →
            </Link>
            <p className="f-note">Still scrolling? Your team is probably still pasting numbers into a report. Let&apos;s fix that.</p>
          </div>
        </div>
      </div>
      <div className="footer-word" aria-hidden="true">
        FLOWMANIC
      </div>
      <div className="footer-bottom">
        <span>© {year} Flowmanic. Built with AI. Deployed with precision. No fluff.</span>
        <span>{site.location}</span>
      </div>
    </footer>
  );
}
