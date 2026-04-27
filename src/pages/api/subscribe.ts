export const prerender = false;

import type { APIRoute } from 'astro';

const BREVO_API = 'https://api.brevo.com/v3';

export const POST: APIRoute = async ({ request }) => {
  const json = await request.json().catch(() => null);
  if (!json) {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { email, firstName } = json;

  if (!email || !email.includes('@')) {
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

  // Send welcome email directly — no automation needed
  const greeting = firstName ? `Hey ${firstName},` : 'Hey,';

  const htmlContent = `
<p>${greeting}</p>
<p>Here's your link: <a href="https://derekjensen.io/tools/prompt-builder"><strong>derekjensen.io/tools/prompt-builder</strong></a></p>
<p>Describe your idea, answer 3 quick questions, and you'll get:</p>
<ul>
  <li>A project brief (problem, solution, who it's for)</li>
  <li>A kickoff prompt ready to paste into Claude</li>
  <li>A planning prompt that breaks your build into steps</li>
</ul>
<p>It takes about 60 seconds. I use this exact process every time I start something new.</p>
<hr />
<p>I'm Derek. I build real products with AI and share everything about how I do it — the tools, the prompts, the mistakes, and the wins.</p>
<p>Most of what I put out is free. Not as a teaser — because I genuinely think the more you can build, the better.</p>
<p>You'll hear from me when I have something worth sharing. No filler.</p>
<p>If you ever have a question or want to show me what you're building, just reply to this email. I read everything.</p>
<p>— Derek</p>`;

  const textContent = `${greeting}

Here's your link: https://derekjensen.io/tools/prompt-builder

Describe your idea, answer 3 quick questions, and you'll get:
- A project brief (problem, solution, who it's for)
- A kickoff prompt ready to paste into Claude
- A planning prompt that breaks your build into steps

It takes about 60 seconds. I use this exact process every time I start something new.

---

I'm Derek. I build real products with AI and share everything about how I do it — the tools, the prompts, the mistakes, and the wins.

Most of what I put out is free. Not as a teaser — because I genuinely think the more you can build, the better.

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
      subject: "Here's your free AI Prompt Builder",
      htmlContent,
      textContent,
    }),
  });

  return Response.json({ success: true });
};
