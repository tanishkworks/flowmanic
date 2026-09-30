/** Marketing copy that changes with a deploy, not at runtime. Data that the DB owns lives in /src/content/*.json. */

export const pains = [
  {
    title: '15–20 Hours/Week Lost',
    body: "Your team manually pulls data from Meta and Google Ads, pastes it into a doc, formats it, and emails it to clients. Every week. That's two and a half working days gone.",
  },
  {
    title: 'Leads Going Cold',
    body: "A new lead fills your form. Your team sees it 4 hours later. By then they've already booked a call with your competitor who responded in 30 seconds.",
  },
  {
    title: 'Onboarding Chaos Every Time',
    body: 'Every new client triggers the same scramble — who sends the welcome email? Who makes the Drive folder? Who adds them to Slack? Same questions. Every. Time.',
  },
] as const;

export const differentiators = [
  { tag: '14 days', title: 'Built in Under 2 Weeks', body: 'From kickoff call to live system in 14 days or less.' },
  { tag: 'Your accounts', title: 'You Own Everything', body: 'All automations live in your own accounts. No lock-in.' },
  { tag: 'Agencies only', title: 'Marketing Agencies Only', body: "We don't do e-commerce or SaaS. We know your operations." },
] as const;

export const steps = [
  { title: 'Discovery', body: 'We map every repetitive task your team does each week.' },
  { title: 'Audit', body: 'We identify which automations save the most hours first.' },
  { title: 'Build', body: 'We configure the full system — n8n + AI + your tools.' },
  { title: 'Test', body: 'Every edge case stress-tested before you see it.' },
  { title: 'Deploy', body: 'Goes live in your own account. You keep full access.' },
  { title: 'Maintain', body: 'Monthly retainer covers monitoring, fixes, and updates.' },
] as const;

export type Plan = {
  tier: string;
  from?: boolean;
  setup: string;
  monthly: string;
  featured?: boolean;
  features: string[];
  cta: string;
};

export const plans: Plan[] = [
  {
    tier: 'Starter',
    setup: '$1,500',
    monthly: '$300/month',
    features: [
      '1 automation system built and deployed',
      'Full configuration in your existing tools',
      '30-day post-launch support',
      'Monthly monitoring and maintenance',
    ],
    cta: 'Get Started',
  },
  {
    tier: 'Growth',
    setup: '$3,500',
    monthly: '$700/month',
    featured: true,
    features: [
      '2 automation systems',
      'Priority build and configuration',
      '60-day support',
      'Monthly maintenance + optimization',
      'Monthly performance review call',
    ],
    cta: 'Book a Call',
  },
  {
    tier: 'Enterprise',
    from: true,
    setup: '$5,000',
    monthly: '$1,200/month',
    features: [
      '3+ custom automation systems',
      'Dedicated 2-week build sprint',
      '90-day support',
      'Priority Slack access with the Flowmanic team',
      'Custom API integrations on request',
    ],
    cta: "Let's Talk",
  },
];

export const pricingNote =
  'All automations are built in your own n8n, Make, or Zapier account. You own everything. No dependency on Flowmanic to keep things running.';

/** FAQ answers restate facts already on the site, so nothing here is a new promise. */
export const faqs = [
  {
    q: 'Who owns the automations?',
    a: 'You do. Everything is built in your own n8n, Make, or Zapier account, with your credentials and your data. If you ever leave, you take everything with you.',
  },
  {
    q: 'How long does a build take?',
    a: 'From kickoff call to live system in 14 days or less.',
  },
  {
    q: 'Can I cancel the monthly retainer?',
    a: 'Yes. One-time setup fee, low monthly retainer, cancel anytime. The retainer covers monitoring, fixes, and updates.',
  },
  {
    q: 'What if my workflow isn’t one of the five systems?',
    a: "Tell us about it. We scope it, price it, and build it. If it can be automated, we'll automate it.",
  },
  {
    q: 'Do you work with e-commerce or SaaS companies?',
    a: 'No. We work exclusively with marketing agencies, so we already understand paid media workflows, client reporting cycles, and the tools you use.',
  },
] as const;

export const whyPoints = [
  {
    title: 'Marketing Agency Specialists',
    body: 'We work exclusively with marketing agencies. We understand paid media workflows, client reporting cycles, and the tools you use. No onboarding us on your industry.',
  },
  {
    title: '2-Week Deployment',
    body: 'Most automation agencies quote 6–8 weeks. We scope tightly and ship fast. Your team sees results within 14 days of kickoff.',
  },
  {
    title: 'Zero Lock-In',
    body: "Your automations live in your accounts. Your credentials. Your data. If you ever want to leave, you take everything with you. We'd prefer you don't though.",
  },
] as const;

export const stackRowA = ['n8n', 'Claude AI', 'Make', 'Zapier', 'Gmail', 'Slack', 'Google Sheets', 'Google Drive'];
export const stackRowB = ['Meta Ads API', 'Google Ads API', 'Notion', 'Airtable', 'Supabase', 'Twilio', 'OpenAI'];
