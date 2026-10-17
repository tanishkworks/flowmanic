import type { Metadata } from 'next';
import CtaBlock from '@/components/CtaBlock';
import PageHero from '@/components/PageHero';
import { TeamSection } from '@/components/TeamSection';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Our Digital Architects — Leadership & Creative Team | Flowmanic',
  description:
    'Meet the digital architects behind Flowmanic: Director Tanishk Dhakad and Web Designer Palak Dubey. Architecting autonomous AI & n8n workflow systems for agencies.',
  alternates: { canonical: '/team' },
  openGraph: {
    title: 'Our Digital Architects — Leadership & Creative Team | Flowmanic',
    description:
      'Meet the digital architects behind Flowmanic: Director Tanishk Dhakad and Web Designer Palak Dubey. Custom AI & n8n workflow systems for marketing agencies.',
    url: 'https://flowmanic.tech/team',
  },
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        top="Digital"
        bottom="Architects"
        title="Meet The Minds Behind The Flowmanic Autopilot."
        meta={['Leadership & Design', 'Indore, India · Global']}
        size="tall"
        next="#team"
      />
      <TeamSection />
      <CtaBlock />
    </>
  );
}
