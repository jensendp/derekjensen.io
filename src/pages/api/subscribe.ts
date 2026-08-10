export const prerender = false;

import type { APIRoute } from 'astro';
import { checkRateLimit } from '@utils/ratelimit';

const BREVO_API = 'https://api.brevo.com/v3';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const POST: APIRoute = async ({ request }) => {
  const rateLimit = await checkRateLimit(request, 'subscribe', {
    limit: 5,
    window: '1 h',
    message: 'Rate limit reached. Please try again later.',
  });
  if (!rateLimit.ok) return rateLimit.response;

  const json = await request.json().catch(() => null);
  if (!json) {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { email, firstName } = json;

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const apiKey = import.meta.env.BREVO_API_KEY;
  const senderEmail = import.meta.env.BREVO_SENDER_EMAIL;
  const listId = import.meta.env.BREVO_LIST_ID ? Number(import.meta.env.BREVO_LIST_ID) : null;

  if (!apiKey || !senderEmail) {
    return Response.json({ error: 'Service not configured.' }, { status: 500 });
  }

  const headers = {
    'api-key': apiKey,
    'Content-Type': 'application/json',
  };

  // Add contact to Brevo
  const contactBody: Record<string, unknown> = {
    email,
    attributes: firstName ? { FIRSTNAME: firstName } : {},
    updateEnabled: true,
  };
  if (listId) contactBody.listIds = [listId];

  const contactRes = await fetch(`${BREVO_API}/contacts`, {
    method: 'POST',
    headers,
    body: JSON.stringify(contactBody),
  });

  if (!contactRes.ok && contactRes.status !== 204) {
    return Response.json({ error: 'Could not subscribe. Please try again.' }, { status: 500 });
  }

  // Send welcome email directly — no automation needed. Generic on purpose: this endpoint is
  // reached from a plain "get new posts by email" widget, not tied to any one lead magnet, so
  // it shouldn't promise a specific tool/link.
  const safeFirstName = typeof firstName === 'string' ? escapeHtml(firstName) : '';
  const greeting = safeFirstName ? `Hey ${safeFirstName},` : 'Hey,';

  const htmlContent = `
<p>${greeting}</p>
<p>You're on the list — thanks for subscribing.</p>
<p>I'm Derek. I build real products with AI and share everything about how I do it — the tools, the prompts, the mistakes, and the wins.</p>
<p>Most of what I put out is free. Not as a teaser — because I genuinely think the more you can build, the better. While you're here, a couple of free tools worth trying:</p>
<ul>
  <li><a href="https://derekjensen.io/tools/prompt-builder"><strong>AI Prompt Builder</strong></a> — describe your idea, get a project brief and ready-to-paste Claude prompts in under 60 seconds.</li>
  <li><a href="https://derekjensen.io/tools/ai-visibility-check"><strong>AI Visibility Check</strong></a> — find out whether ChatGPT and other AI assistants can actually find and recommend your business.</li>
</ul>
<p>You'll hear from me when I have something worth sharing. No filler.</p>
<p>If you ever have a question or want to show me what you're building, just reply to this email. I read everything.</p>
<p>— Derek</p>`;

  const textContent = `${greeting}

You're on the list — thanks for subscribing.

I'm Derek. I build real products with AI and share everything about how I do it — the tools, the prompts, the mistakes, and the wins.

Most of what I put out is free. Not as a teaser — because I genuinely think the more you can build, the better. While you're here, a couple of free tools worth trying:

- AI Prompt Builder — https://derekjensen.io/tools/prompt-builder
- AI Visibility Check — https://derekjensen.io/tools/ai-visibility-check

You'll hear from me when I have something worth sharing. No filler.

If you ever have a question or want to show me what you're building, just reply to this email. I read everything.

— Derek`;

  await fetch(`${BREVO_API}/smtp/email`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      to: [{ email, name: firstName || email }],
      sender: { name: 'Derek Jensen', email: senderEmail },
      replyTo: { email: senderEmail },
      subject: "You're on the list",
      htmlContent,
      textContent,
    }),
  });

  return Response.json({ success: true });
};
