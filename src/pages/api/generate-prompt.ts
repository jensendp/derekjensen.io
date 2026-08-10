export const prerender = false;

import type { APIRoute } from 'astro';
import { checkRateLimit } from '@utils/ratelimit';

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 15000): Promise<Response | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const ALLOWED_PROJECT_TYPES = [
  'Web app',
  'Automation / workflow',
  'Content tool',
  'Browser extension',
  'Mobile app',
  'Internal tool',
  'Other',
];
const ALLOWED_AUDIENCES = ['Just me', 'My team', 'Customers / public'];
const ALLOWED_CHALLENGES = [
  "Don't know where to start",
  'Getting AI to do what I want',
  'Connecting tools together',
  'Shipping and launching',
];

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /disregard\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /forget\s+(all\s+)?(previous|prior|above)\s+instructions/i,
  /you\s+are\s+now\s+/i,
  /new\s+system\s+prompt/i,
  /\[system\]/i,
  /\[inst\]/i,
  /<<sys>>/i,
  /act\s+as\s+/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /jailbreak/i,
];

function containsInjection(text: string): boolean {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

const BREVO_API = 'https://api.brevo.com/v3';
const PROMPT_BUILDER_LIST_ID = 5; // "Lead Magnet Prompt Builder"

interface GeneratedKit {
  brief?: string;
  techStack?: { tool: string; purpose: string; why: string }[];
  validationPrompt?: string;
  kickoffPrompt?: string;
  planningPrompt?: string;
  risks?: { risk: string; mitigation: string }[];
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Claude's output is influenced by user-supplied input (the "idea" field, filtered but not
// bulletproof) — escape before it goes into an HTML email, same as any other untrusted content.
function buildKitEmail(kit: GeneratedKit): { html: string; text: string } {
  const techList = (kit.techStack || [])
    .map((t) => `<li><strong>${escapeHtml(t.tool)}</strong> — ${escapeHtml(t.purpose)} (${escapeHtml(t.why)})</li>`)
    .join('\n');
  const risksList = (kit.risks || [])
    .map((r) => `<li><strong>${escapeHtml(r.risk)}</strong> — Fix: ${escapeHtml(r.mitigation)}</li>`)
    .join('\n');

  const html = `
<p>Here's your AI build starter kit:</p>
<h3>Project Brief</h3>
<p>${escapeHtml(kit.brief || '').replace(/\n/g, '<br/>')}</p>
<h3>Tech Stack</h3>
<ul>${techList}</ul>
<h3>Validate First</h3>
<pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(kit.validationPrompt || '')}</pre>
<h3>Kickoff Prompt</h3>
<pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(kit.kickoffPrompt || '')}</pre>
<h3>Build Plan Prompt</h3>
<pre style="white-space: pre-wrap; font-family: inherit;">${escapeHtml(kit.planningPrompt || '')}</pre>
<h3>Watch Out For</h3>
<ul>${risksList}</ul>
<hr />
<p>I'm Derek. I build real products with AI and share everything about how I do it. If you want help with any of this, just reply — I read everything.</p>
<p>— Derek</p>`;

  const text = `Here's your AI build starter kit:

PROJECT BRIEF
${kit.brief || ''}

TECH STACK
${(kit.techStack || []).map((t) => `- ${t.tool} — ${t.purpose} (${t.why})`).join('\n')}

VALIDATE FIRST
${kit.validationPrompt || ''}

KICKOFF PROMPT
${kit.kickoffPrompt || ''}

BUILD PLAN PROMPT
${kit.planningPrompt || ''}

WATCH OUT FOR
${(kit.risks || []).map((r) => `- ${r.risk} — Fix: ${r.mitigation}`).join('\n')}

— Derek`;

  return { html, text };
}

export const POST: APIRoute = async ({ request }) => {
  const rateLimit = await checkRateLimit(request, 'prompt-builder', {
    limit: 5,
    window: '1 h',
    message: 'Rate limit reached. You can generate up to 5 prompts per hour.',
  });
  if (!rateLimit.ok) return rateLimit.response;

  const json = await request.json().catch(() => null);
  if (!json) return Response.json({ error: 'Invalid request body.' }, { status: 400 });

  const { idea, projectType, audience, challenge, email } = json;

  if (!idea || typeof idea !== 'string' || idea.trim().length < 10)
    return Response.json({ error: 'Please describe your idea in more detail (at least a sentence).' }, { status: 400 });

  if (!email || typeof email !== 'string' || !email.includes('@'))
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });

  if (idea.length > 500)
    return Response.json({ error: 'Please keep your idea description under 500 characters.' }, { status: 400 });

  if (projectType && !ALLOWED_PROJECT_TYPES.includes(projectType))
    return Response.json({ error: 'Invalid project type.' }, { status: 400 });

  if (audience && !ALLOWED_AUDIENCES.includes(audience))
    return Response.json({ error: 'Invalid audience selection.' }, { status: 400 });

  if (challenge && !ALLOWED_CHALLENGES.includes(challenge))
    return Response.json({ error: 'Invalid challenge selection.' }, { status: 400 });

  if (containsInjection(idea))
    return Response.json({ error: 'Input contains disallowed content. Please describe your idea naturally.' }, { status: 400 });

  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  if (!apiKey) return Response.json({ error: 'Service not configured.' }, { status: 500 });

  const userPrompt = `You are helping a non-technical builder get started on their project. Be specific, opinionated, and personal — reference their exact idea and context throughout every section. Never be generic.

Project details:
- Idea: ${idea.trim()}
- Type: ${projectType || 'Not specified'}
- Who uses it: ${audience || 'Not specified'}
- Biggest challenge: ${challenge || 'Not specified'}

Generate a complete AI build starter kit. Every section must feel written specifically for this person's project — use their words, their context, their situation. Do not write generic content that could apply to any project.

Return ONLY valid JSON — no markdown, no explanation:
{
  "brief": "A tight 4-line project brief. Start with their actual idea. Format:\\nProblem: [the specific frustration this solves — use their language]\\nSolution: [exactly what this builds, named specifically]\\nBuilt for: [who uses it and in what context]\\nSuccess looks like: [one concrete, measurable outcome specific to this idea]",

  "techStack": [
    {
      "tool": "Tool name",
      "purpose": "What it does in this specific project (1 line)",
      "why": "Why this tool over alternatives for their exact situation (1 line)"
    }
  ],

  "validationPrompt": "A ready-to-paste Claude prompt that helps them validate this specific idea before writing a line of code. Should ask Claude to pressure-test the core assumption, identify the riskiest part of the idea, and suggest a lean experiment to test it in under a week. Make it feel tailored to their project — not generic startup advice. 80-120 words.",

  "kickoffPrompt": "A ready-to-paste Claude prompt that kicks off the actual build. Must reference their specific idea, audience, and challenge. Tell Claude to ask 3-5 clarifying questions before suggesting any code or tooling. End with a clear statement of what to build first. 150-200 words.",

  "planningPrompt": "A ready-to-paste Claude prompt that produces a step-by-step build plan for this specific project. Should result in 6-8 concrete phases, each with: what gets built, which specific tool to use, and what done looks like. Reference their actual project type and audience throughout. 120-160 words.",

  "risks": [
    {
      "risk": "A specific failure mode for this exact project — not generic advice",
      "mitigation": "A concrete action they can take to prevent or handle it"
    }
  ]
}

Rules:
- techStack: 3-4 tools max. Be opinionated — pick the best tool, don't hedge with "you could also use X"
- risks: exactly 3 items, each specific to their project type and idea
- Every prompt must reference their idea by name or description — nothing generic
- Tool choices should account for their skill level (non-technical, building with AI)`;

  const response = await fetchWithTimeout('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2500,
      system: 'You are an expert product builder and AI tools specialist helping non-technical founders ship real products. You give specific, opinionated, immediately actionable guidance. You always reference the user\'s exact project context — never give generic advice. Respond only with valid JSON.',
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response || !response.ok)
    return Response.json({ error: 'Failed to generate prompts. Please try again.' }, { status: 500 });

  const data = await response.json().catch(() => null);
  const raw = data?.content?.[0]?.text;
  if (!raw) return Response.json({ error: 'Failed to generate prompts. Please try again.' }, { status: 500 });

  let parsed: GeneratedKit;
  try {
    const cleaned = raw.replace(/```json\n?/, '').replace(/\n?```/, '').trim();
    parsed = JSON.parse(cleaned);
  } catch {
    return Response.json({ error: 'Failed to parse response. Please try again.' }, { status: 500 });
  }

  // Fire-and-forget: capture the lead in Brevo and email them a copy of the kit —
  // don't block the response on either.
  const brevoApiKey = import.meta.env.BREVO_API_KEY;
  const senderEmail = import.meta.env.BREVO_SENDER_EMAIL;
  if (brevoApiKey && senderEmail) {
    fetch(`${BREVO_API}/contacts`, {
      method: 'POST',
      headers: { 'api-key': brevoApiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, listIds: [PROMPT_BUILDER_LIST_ID], updateEnabled: true }),
    }).catch(() => {});

    const kitEmail = buildKitEmail(parsed);
    fetch(`${BREVO_API}/smtp/email`, {
      method: 'POST',
      headers: { 'api-key': brevoApiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: [{ email }],
        sender: { name: 'Derek Jensen', email: senderEmail },
        replyTo: { email: senderEmail },
        subject: 'Your AI Build Starter Kit',
        htmlContent: kitEmail.html,
        textContent: kitEmail.text,
      }),
    }).catch(() => {});
  }

  return Response.json(parsed);
};
