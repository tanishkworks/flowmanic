import type { LeadInput } from './validation';

async function post(url: string, payload: unknown) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
}

/** Forward a new lead to n8n/Make/Zapier (full JSON) and/or Slack (formatted text). Never throws. */
export async function notifyLead(lead: LeadInput, id: string | null): Promise<void> {
  const jobs: Promise<void>[] = [];
  const hook = process.env.LEAD_WEBHOOK_URL;
  const slack = process.env.SLACK_WEBHOOK_URL;
  if (hook) jobs.push(post(hook, { event: 'lead.created', id, lead, receivedAt: new Date().toISOString() }));
  if (slack) {
    const lines = [
      `*New audit request* from ${lead.name} (${lead.agency})`,
      `${lead.email}${lead.website ? ` · ${lead.website}` : ''}`,
      `Team: ${lead.teamSize} · Interest: ${lead.interest}`,
      lead.message ? `> ${lead.message.slice(0, 500)}` : '',
    ].filter(Boolean);
    jobs.push(post(slack, { text: lines.join('\n') }));
  }
  const results = await Promise.allSettled(jobs);
  for (const r of results) if (r.status === 'rejected') console.error('[notify] webhook failed:', (r.reason as Error).message);
}
