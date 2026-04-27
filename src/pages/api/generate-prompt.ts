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
  // Rate limiting (gracefully skipped if Upstash not configured)
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
        {
          status: 429,
          headers: { 'Retry-After': '3600', 'X-RateLimit-Remaining': String(remaining) },
        }
      );
    }
  }

  const json = await request.json().catch(() => null);
  if (!json) {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { idea, projectType, audience, challenge } = json;

  // Input validation
  if (!idea || typeof idea !== 'string' || idea.trim().length < 10) {
    return Response.json(
      { error: 'Please describe your idea in more detail (at least a sentence).' },
      { status: 400 }
    );
  }

  if (idea.length > 500) {
    return Response.json(
      { error: 'Please keep your idea description under 500 characters.' },
      { status: 400 }
    );
  }

  // Validate selects against allowed values
  if (projectType && !ALLOWED_PROJECT_TYPES.includes(projectType)) {
    return Response.json({ error: 'Invalid project type.' }, { status: 400 });
  }
  if (audience && !ALLOWED_AUDIENCES.includes(audience)) {
    return Response.json({ error: 'Invalid audience selection.' }, { status: 400 });
  }
  if (challenge && !ALLOWED_CHALLENGES.includes(challenge)) {
    return Response.json({ error: 'Invalid challenge selection.' }, { status: 400 });
  }

  // Prompt injection check
  if (containsInjection(idea)) {
    return Response.json(
      { error: 'Input contains disallowed content. Please describe your idea naturally.' },
      { status: 400 }
    );
  }

  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'Service not configured.' }, { status: 500 });
  }

  const userPrompt = `Generate an AI build starter kit for this project:

Idea: ${idea.trim()}
Project type: ${projectType || 'Not specified'}
Who uses it: ${audience || 'Not specified'}
Biggest challenge: ${challenge || 'Not specified'}

Return ONLY valid JSON with this exact structure — no markdown, no explanation:
{
  "brief": "4-line project brief using this format exactly:\\nProblem: [the core problem being solved]\\nSolution: [what this builds]\\nTarget user: [who uses it]\\nSuccess looks like: [one concrete outcome]",
  "kickoffPrompt": "A ready-to-paste prompt for Claude that kicks off the actual build. Be specific — reference the idea, the user, and what to build first. Tell Claude to ask clarifying questions before writing any code. Minimum 120 words.",
  "planningPrompt": "A ready-to-paste prompt for Claude that breaks this project into 5-7 ordered, concrete steps. For each step, name what to build and suggest which AI tool is best suited (Claude, Cursor, v0, Replit, etc). Minimum 100 words."
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1500,
      system:
        'You are an expert at helping non-technical people build real products using AI. Be direct, specific, and immediately actionable. No fluff. Always respond with valid JSON only.',
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    return Response.json({ error: 'Failed to generate prompts. Please try again.' }, { status: 500 });
  }

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
