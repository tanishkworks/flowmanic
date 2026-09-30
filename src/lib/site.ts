/** Public site settings. NEXT_PUBLIC_* values are inlined at build time. */
export const site = {
  name: 'Flowmanic',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@flowmanic.ai',
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || '',
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || '',
  xUrl: process.env.NEXT_PUBLIC_X_URL || '',
  location: 'Indore, India',
  tagline: 'AI Automation for Marketing Agencies',
  description:
    'Flowmanic builds done-for-you AI automation systems for marketing agencies: client reporting, lead follow-up, content repurposing and onboarding. Live in your own account in under 2 weeks.',
} as const;

/** Prefix public files (e.g. /art/*.svg) with the CDN host when one is configured. */
export function asset(path: string): string {
  const cdn = process.env.NEXT_PUBLIC_CDN_URL || '';
  return cdn ? `${cdn.replace(/\/$/, '')}${path}` : path;
}
