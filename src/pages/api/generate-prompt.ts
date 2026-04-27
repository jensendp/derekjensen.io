export const prerender = false;

import type { APIRoute } from 'astro';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

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

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  const url = import.meta.env.UPSTASH_REDIS_REST_URL;
  const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis: new Redis({ url, token }),
      limiter: Ratelimit.slidingWindow(5, '1 h'),
      prefix: 'prompt-builder',
    });
  }
  return ratelimit;
}

export const POST: APIRoute = async ({ request }) => {
  const limiter = getRatelimit();
  if (limiter) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
      request.headers.get('cf-connecting-ip') ??
      '127.0.0.1';
    const { success, limit, remaining } = await limiter.limit(ip);
    if (!success) {
      return Response.json(
        { error: `Rate limit reached. You can generate up to ${limit} prompts per hour.` },
        { status: 429, headers: { 'Retry-After': '3600', 'X-RateLimit-Remaining': String(remaining) } }
      );
    }
  }

  const json = await request.json().catch(() => null);
  if (!json) return Response.json({ error: 'Invalid request body.' }, { status: 400 });

  const { idea, projectType, audience, challenge } = json;

  if (!idea || typeof idea !== 'string' || idea.trim().length < 10)
    return Response.json({ error: 'Please describe your idea in more detail (at least a sentence).' }, { status: 400 });

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

  const response = await fetch('https://api.anthropic.com/v1/messages', {
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

  if (!response.ok)
    return Response.json({ error: 'Failed to generate prompts. Please try again.' }, { status: 500 });

  const data = await response.json();
  const raw = data.content[0].text;

  try {
    const cleaned = raw.replace(/```json\n?/, '').replace(/\n?```/, '').trim();
    const parsed = JSON.parse(cleaned);
    return Response.json(parsed);
  } catch {
    return Response.json({ error: 'Failed to parse response. Please try again.' }, { status: 500 });
  }
};
