/** Public site settings. NEXT_PUBLIC_* values are inlined at build time. */
export const site = {
  name: 'Flowmanic',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://flowmanic.tech',
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@flowmanic.tech',
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL || '',
  linkedinUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL || 'https://www.linkedin.com/company/flowmanic/',
  xUrl: process.env.NEXT_PUBLIC_X_URL || '',
  location: 'Remote · Serving Globally',
  tagline: 'Custom AI & n8n Workflow Automation Agency for Marketing Agencies',
  description:
    'Flowmanic (flowmanic.tech) is a B2B AI and n8n workflow automation agency building custom, done-for-you client reporting, instant lead triage, and content repurposing systems for marketing, advertising, and digital agencies.',
} as const;

/** Prefix public files (e.g. /art/*.svg) with the CDN host when one is configured. */
export function asset(path: string): string {
  const cdn = process.env.NEXT_PUBLIC_CDN_URL || '';
  return cdn ? `${cdn.replace(/\/$/, '')}${path}` : path;
}
