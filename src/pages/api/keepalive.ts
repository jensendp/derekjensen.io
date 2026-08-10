export const prerender = false;

import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';

// Upstash's free tier reclaims a Redis database after ~14 days with no commands run against
// it — exactly what happened to the site's rate-limiter database once traffic was low enough.
// This route runs a real write (not just a ping) on a weekly Vercel Cron schedule (see
// vercel.json) to keep the database counted as active, well inside that 14-day window.
export const GET: APIRoute = async ({ request }) => {
  // If CRON_SECRET is set, only accept Vercel's own cron invocations — Vercel automatically
  // sends it as a Bearer token when triggering a scheduled job. Falls back to open (still
  // functional, just unauthenticated) if it isn't configured, consistent with how every other
  // optional integration in this codebase degrades rather than hard-fails.
  const cronSecret = import.meta.env.CRON_SECRET;
  if (cronSecret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${cronSecret}`) {
      return new Response('Unauthorized', { status: 401 });
    }
  }

  const url = import.meta.env.UPSTASH_REDIS_REST_URL;
  const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return Response.json({ error: 'Upstash not configured.' }, { status: 500 });
  }

  const redis = new Redis({ url, token });
  const timestamp = new Date().toISOString();
  await redis.set('keepalive', timestamp);
  const value = await redis.get('keepalive');

  return Response.json({ ok: true, timestamp, verified: value === timestamp });
};
