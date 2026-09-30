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

/** Forward a new lead to Webhook, Discord, Telegram, Resend Email, or Slack. Never throws. */
export async function notifyLead(lead: LeadInput, id: string | null): Promise<void> {
  const jobs: Promise<void>[] = [];
  const hook = process.env.LEAD_WEBHOOK_URL;
  const slack = process.env.SLACK_WEBHOOK_URL;
  const discord = process.env.DISCORD_WEBHOOK_URL;
  const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramChatId = process.env.TELEGRAM_CHAT_ID;
  const resendApiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.NOTIFICATION_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@flowmanic.ai';

  // 1. Generic JSON Webhook
  if (hook) {
    jobs.push(post(hook, { event: 'lead.created', id, lead, receivedAt: new Date().toISOString() }));
  }

  // 2. Slack Notification
  if (slack) {
    const lines = [
      `*New audit request* from ${lead.name} (${lead.agency})`,
      `${lead.email}${lead.website ? ` · ${lead.website}` : ''}`,
      `Team: ${lead.teamSize} · Interest: ${lead.interest}`,
      lead.message ? `> ${lead.message.slice(0, 500)}` : '',
    ].filter(Boolean);
    jobs.push(post(slack, { text: lines.join('\n') }));
  }

  // 3. Discord Webhook (100% Free)
  if (discord) {
    const discordPayload = {
      embeds: [
        {
          title: '⚡ New Free Audit Booked!',
          color: 742647, // #0B54F7 Blue
          fields: [
            { name: 'Name', value: lead.name, inline: true },
            { name: 'Email', value: lead.email, inline: true },
            { name: 'Agency', value: lead.agency, inline: stroke(lead.website) },
            ...(lead.website ? [{ name: 'Website', value: lead.website, inline: true }] : []),
            { name: 'Team Size', value: lead.teamSize, inline: true },
            { name: 'Automate First', value: lead.interest, inline: true },
            ...(lead.message ? [{ name: "Team's Time / Message", value: lead.message.slice(0, 1024) }] : []),
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    };
    jobs.push(post(discord, discordPayload));
  }

  // 4. Telegram Bot Notification (100% Free)
  if (telegramToken && telegramChatId) {
    const text = `⚡ *New Audit Request*\n\n` +
      `*Name:* ${escapeMarkdown(lead.name)}\n` +
      `*Email:* ${escapeMarkdown(lead.email)}\n` +
      `*Agency:* ${escapeMarkdown(lead.agency)}\n` +
      (lead.website ? `*Website:* ${escapeMarkdown(lead.website)}\n` : '') +
      `*Team Size:* ${escapeMarkdown(lead.teamSize)}\n` +
      `*Automate First:* ${escapeMarkdown(lead.interest)}\n` +
      (lead.message ? `\n*Message:*\n_${escapeMarkdown(lead.message.slice(0, 500))}_` : '');

    jobs.push(
      post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
        chat_id: telegramChatId,
        text,
        parse_mode: 'Markdown',
      })
    );
  }

  // 5. Resend Direct Email (100% Free for 3,000 emails/month)
  if (resendApiKey) {
    jobs.push(
      post('https://api.resend.com/emails', {
        from: 'Flowmanic Audits <onboarding@resend.dev>',
        to: [notifyEmail],
        subject: `⚡ New Audit Request: ${lead.name} (${lead.agency})`,
        html: `
          <h2>New Free Audit Request</h2>
          <p><strong>Name:</strong> ${lead.name}</p>
          <p><strong>Email:</strong> <a href="mailto:${lead.email}">${lead.email}</a></p>
          <p><strong>Agency:</strong> ${lead.agency}</p>
          ${lead.website ? `<p><strong>Website:</strong> <a href="${lead.website}">${lead.website}</a></p>` : ''}
          <p><strong>Team Size:</strong> ${lead.teamSize}</p>
          <p><strong>Automate First:</strong> ${lead.interest}</p>
          ${lead.message ? `<p><strong>Message:</strong><br/>${lead.message}</p>` : ''}
        `,
      })
    );
  }

  const results = await Promise.allSettled(jobs);
  for (const r of results) {
    if (r.status === 'rejected') console.error('[notify] webhook failed:', (r.reason as Error).message);
  }
}

function stroke(val?: string | null): boolean {
  return !val;
}

function escapeMarkdown(text: string): string {
  return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, '\\$&');
}
