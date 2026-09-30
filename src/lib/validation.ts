/** Shared by the contact form (instant feedback) and the API (source of truth). No server imports. */

export const TEAM_SIZES = ['1-5', '6-15', '16-50', '50+'] as const;
export type TeamSize = (typeof TEAM_SIZES)[number];

export type LeadInput = {
  name: string;
  email: string;
  agency: string;
  website: string | null;
  teamSize: TeamSize;
  interest: string;
  message: string | null;
};

export type LeadErrors = Partial<Record<keyof LeadInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return 'Enter your work email.';
  if (v.length > 254 || !EMAIL_RE.test(v)) return 'That email doesn’t look right.';
  return undefined;
}

export function normalizeWebsite(value: string): string | null {
  const v = value.trim();
  if (!v) return null;
  const withProto = /^https?:\/\//i.test(v) ? v : `https://${v}`;
  try {
    const url = new URL(withProto);
    if (!url.hostname.includes('.')) return null;
    return url.toString();
  } catch {
    return null;
  }
}

const str = (v: unknown) => (typeof v === 'string' ? v : '');

export function validateLead(
  raw: unknown,
  allowedInterests: readonly string[],
): { ok: true; data: LeadInput } | { ok: false; errors: LeadErrors } {
  const body = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const errors: LeadErrors = {};

  const name = str(body.name).trim();
  if (name.length < 2) errors.name = 'Enter your name.';
  else if (name.length > 80) errors.name = 'Keep your name under 80 characters.';

  const email = str(body.email).trim().toLowerCase();
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const agency = str(body.agency).trim();
  if (agency.length < 2) errors.agency = 'Enter your agency name.';
  else if (agency.length > 120) errors.agency = 'Keep the agency name under 120 characters.';

  const websiteRaw = str(body.website);
  const website = normalizeWebsite(websiteRaw);
  if (websiteRaw.trim() && !website) errors.website = 'Enter a valid website, like youragency.com.';

  const teamSize = str(body.teamSize) as TeamSize;
  if (!TEAM_SIZES.includes(teamSize)) errors.teamSize = 'Pick your team size.';

  const interest = str(body.interest);
  if (!allowedInterests.includes(interest)) errors.interest = 'Pick what you want to automate first.';

  const messageRaw = str(body.message).trim();
  if (messageRaw.length > 2000) errors.message = 'Keep the message under 2,000 characters.';

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: { name, email, agency, website, teamSize, interest, message: messageRaw || null },
  };
}
