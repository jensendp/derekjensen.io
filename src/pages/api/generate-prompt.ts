export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  const json = await request.json().catch(() => null);
  if (!json) {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { idea, projectType, audience, challenge } = json;

  if (!idea || idea.trim().length < 10) {
    return Response.json(
      { error: 'Please describe your idea in more detail (at least a sentence).' },
      { status: 400 }
    );
  }

  const apiKey = import.meta.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: 'Service not configured.' }, { status: 500 });
  }

  const userPrompt = `Generate an AI build starter kit for this project:

Idea: ${idea}
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
        'You are an expert at helping non-technical people build real products using AI. Be direct, specific, and immediately actionable. No fluff.',
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
