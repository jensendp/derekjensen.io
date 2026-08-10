export const prerender = false;

import type { APIRoute } from 'astro';
import { checkRateLimit } from '@utils/ratelimit';

const BREVO_API = 'https://api.brevo.com/v3';
const TIMEBACK_LIST_ID = 6;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const POST: APIRoute = async ({ request }) => {
  const rateLimit = await checkRateLimit(request, 'timeback-lead', {
    limit: 5,
    window: '1 h',
    message: 'Rate limit reached. Please try again later.',
  });
  if (!rateLimit.ok) return rateLimit.response;

  const json = await request.json().catch(() => null);
  if (!json) {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { name, email, business } = json;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  if (!name || typeof name !== 'string' || name.trim().length < 1) {
    return Response.json({ error: 'Please enter your name.' }, { status: 400 });
  }

  if (typeof business === 'string' && business.length > 500) {
    return Response.json({ error: 'Please keep the business description under 500 characters.' }, { status: 400 });
  }

  const apiKey = import.meta.env.BREVO_API_KEY;
  const senderEmail = import.meta.env.BREVO_SENDER_EMAIL;

  if (!apiKey || !senderEmail) {
    return Response.json({ error: 'Service not configured.' }, { status: 500 });
  }

  const headers = {
    'api-key': apiKey,
    'Content-Type': 'application/json',
  };

  // Split "name" into first/last for Brevo's FIRSTNAME/LASTNAME fields
  const trimmedName = name.trim();
  const [firstName, ...rest] = trimmedName.split(/\s+/);
  const lastName = rest.join(' ');

  const contactBody: Record<string, unknown> = {
    email,
    attributes: {
      FIRSTNAME: firstName,
      ...(lastName ? { LASTNAME: lastName } : {}),
      ...(business ? { BUSINESS: business } : {}),
    },
    listIds: [TIMEBACK_LIST_ID],
    updateEnabled: true,
  };

  const contactRes = await fetch(`${BREVO_API}/contacts`, {
    method: 'POST',
    headers,
    body: JSON.stringify(contactBody),
  });

  if (!contactRes.ok && contactRes.status !== 204) {
    return Response.json({ error: 'Could not submit. Please try again.' }, { status: 500 });
  }

  // Notify Derek directly — no automation needed to see a new lead
  await fetch(`${BREVO_API}/smtp/email`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      to: [{ email: senderEmail, name: 'Derek Jensen' }],
      sender: { name: 'derekjensen.io', email: senderEmail },
      replyTo: { email },
      subject: `New Time Back lead: ${trimmedName}`,
      htmlContent: `
<p>New submission from the Time Back landing page:</p>
<ul>
  <li><strong>Name:</strong> ${escapeHtml(trimmedName)}</li>
  <li><strong>Email:</strong> ${escapeHtml(email)}</li>
  <li><strong>Business:</strong> ${escapeHtml(business || '(not provided)')}</li>
</ul>`,
      textContent: `New Time Back lead:\nName: ${trimmedName}\nEmail: ${email}\nBusiness: ${business || '(not provided)'}`,
    }),
  });

  return Response.json({ success: true });
};
