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
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';

// Self-hosted at build time by next/font: no request to Google at runtime, no layout shift
const display = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-display', display: 'swap' });
const sans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://flowmanic.tech'),
  title: { default: 'Flowmanic — AI & n8n Workflow Automation Agency | flowmanic.tech', template: '%s | Flowmanic' },
  description:
    'Flowmanic (flowmanic.tech) is a custom AI and n8n workflow automation agency led by Director Tanishk Dhakad and Web Designer Palak Dubey. We help marketing and digital agencies automate client reporting, lead follow-ups, and content repurposing. Request a free automation audit.',
  applicationName: 'Flowmanic',
  keywords: [
    'Flowmanic',
    'Flowmanic Tech',
    'flowmanic.tech',
    'Flowmanic automation',
    'Flowmanic agency',
    'Tanishk Dhakad',
    'Palak Dubey',
    'n8n workflow automation agency',
    'AI automation for marketing agencies',
  ],
  authors: [
    { name: 'Tanishk Dhakad', url: 'https://www.linkedin.com/in/tanishk-dhakad/' },
    { name: 'Palak Dubey', url: 'https://www.linkedin.com/in/palakdubey0306/' },
  ],
  creator: 'Tanishk Dhakad',
  publisher: 'Flowmanic',
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    siteName: 'Flowmanic',
    locale: 'en_US',
    url: 'https://flowmanic.tech',
    title: 'Flowmanic — AI & n8n Workflow Automation Agency | flowmanic.tech',
    description:
      'Flowmanic (flowmanic.tech) is a custom AI and n8n workflow automation agency led by Director Tanishk Dhakad and Web Designer Palak Dubey. Automate client reporting, lead follow-up, and content repurposing.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Flowmanic — AI & n8n Workflow Automation Agency | flowmanic.tech',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flowmanic — AI & n8n Workflow Automation Agency | flowmanic.tech',
    description:
      'Flowmanic (flowmanic.tech) is a custom AI and n8n workflow automation agency led by Director Tanishk Dhakad and Web Designer Palak Dubey.',
    images: ['/og-image.png'],
    creator: '@flowmanic',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = { themeColor: '#ffffff', width: 'device-width', initialScale: 1 };

const jsonLdGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': 'https://flowmanic.tech/#organization',
      name: 'Flowmanic',
      alternateName: ['Flowmanic Tech', 'Flowmanic Automation Agency'],
      url: 'https://flowmanic.tech/',
      logo: 'https://flowmanic.tech/logo.png',
      image: 'https://flowmanic.tech/og-image.png',
      email: 'hello@flowmanic.tech',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Indore',
        addressRegion: 'Madhya Pradesh',
        addressCountry: 'IN',
      },
      founder: [
        {
          '@type': 'Person',
          name: 'Tanishk Dhakad',
          jobTitle: 'Director',
          email: 'tanishk@flowmanic.tech',
          worksFor: { '@id': 'https://flowmanic.tech/#organization' },
          sameAs: ['https://www.linkedin.com/in/tanishk-dhakad/'],
        },
      ],
      member: [
        {
          '@type': 'Person',
          name: 'Tanishk Dhakad',
          jobTitle: 'Director',
          email: 'tanishk@flowmanic.tech',
          worksFor: { '@id': 'https://flowmanic.tech/#organization' },
          sameAs: ['https://www.linkedin.com/in/tanishk-dhakad/'],
        },
        {
          '@type': 'Person',
          name: 'Palak Dubey',
          jobTitle: 'Web Designer',
          email: 'palak@flowmanic.tech',
          worksFor: { '@id': 'https://flowmanic.tech/#organization' },
          sameAs: ['https://www.linkedin.com/in/palakdubey0306/'],
        },
      ],
      sameAs: [
        'https://github.com/tanishkworks/flowmanic',
        'https://www.linkedin.com/in/tanishk-dhakad/',
        'https://www.linkedin.com/in/palakdubey0306/',
      ],
      knowsAbout: [
        'n8n Workflow Automation',
        'AI Agent Development',
        'Automated Client Reporting',
        'Lead Follow-Up Automation',
        'Content Repurposing Automation',
        'Marketing Agency Operations',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://flowmanic.tech/#website',
      url: 'https://flowmanic.tech/',
      name: 'Flowmanic',
      alternateName: 'Flowmanic Tech',
      publisher: {
        '@id': 'https://flowmanic.tech/#organization',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://flowmanic.tech/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Flowmanic?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Flowmanic (flowmanic.tech) is an AI and n8n workflow automation agency that builds custom, done-for-you business automations for marketing, advertising, and digital agencies.',
          },
        },
        {
          '@type': 'Question',
          name: 'What workflows does Flowmanic automate for agencies?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Flowmanic automates end-to-end client performance reporting, instant multi-channel lead follow-ups, content repurposing pipelines, CRM synchronization, and custom n8n operational workflows.',
          },
        },
        {
          '@type': 'Question',
          name: 'How can I get a free automation audit from Flowmanic?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You can request a free 20-minute workflow and automation audit directly on flowmanic.tech or by emailing hello@flowmanic.tech.',
          },
        },
      ],
    },
  ],
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }} />
        <Analytics />
        <SpeedInsights />
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
