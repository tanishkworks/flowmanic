import type { Metadata, Viewport } from 'next';
import { Archivo, Inter } from 'next/font/google';
import Script from 'next/script';
import type { ReactNode } from 'react';
import systems from '@/content/systems.json';
import Cursor from '@/components/Cursor';
import Dock from '@/components/Dock';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import RevealObserver from '@/components/RevealObserver';
import SmoothScroll from '@/components/SmoothScroll';
import { site } from '@/lib/site';
import './globals.css';

// Self-hosted at build time by next/font: no request to Google at runtime, no layout shift
const display = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-display', display: 'swap' });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: 'Flowmanic | AI Automation for Marketing Agencies', template: '%s | Flowmanic' },
  description: site.description,
  applicationName: 'Flowmanic',
  openGraph: { type: 'website', siteName: 'Flowmanic', locale: 'en_US', url: '/' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = { themeColor: '#ffffff', width: 'device-width', initialScale: 1 };

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Flowmanic',
  description: site.description,
  url: site.url,
  email: site.email,
  areaServed: 'Worldwide',
  address: { '@type': 'PostalAddress', addressLocality: 'Indore', addressCountry: 'IN' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const dockSystems = systems.map((s) => ({ slug: s.slug, position: s.position }));
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Cursor />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <Dock systems={dockSystems} />
        <SmoothScroll />
        <RevealObserver />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        {process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? (
          // Non-critical: loaded only after the page is idle
          <Script
            src="https://plausible.io/js/script.js"
            data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
            strategy="lazyOnload"
          />
        ) : null}
      </body>
    </html>
  );
}
