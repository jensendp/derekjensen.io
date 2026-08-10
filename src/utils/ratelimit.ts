import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const limiters = new Map<string, Ratelimit>();

function getRatelimit(prefix: string, limit: number, window: `${number} ${'s' | 'm' | 'h' | 'd'}`): Ratelimit | null {
  const url = import.meta.env.UPSTASH_REDIS_REST_URL;
  const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const cached = limiters.get(prefix);
  if (cached) return cached;

  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix,
  });
  limiters.set(prefix, limiter);
  return limiter;
}

/**
 * Checks the rate limit for a request, keyed by IP. Fails open (returns `ok: true`) if the
 * limiter is unconfigured or unreachable (e.g. Redis misconfigured/down) — a rate-limit outage
 * should degrade to "unlimited," not take the endpoint down entirely. Returns a ready-to-return
 * 429 Response when the limit IS exceeded; callers should `return` it immediately when present.
 */
export async function checkRateLimit(
  request: Request,
  prefix: string,
  { limit = 5, window = '1 h' as const, message }: { limit?: number; window?: `${number} ${'s' | 'm' | 'h' | 'd'}`; message: string }
): Promise<{ ok: true } | { ok: false; response: Response }> {
  const limiter = getRatelimit(prefix, limit, window);
  if (!limiter) return { ok: true };

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('cf-connecting-ip') ??
    '127.0.0.1';

  try {
    const { success, limit: max, remaining } = await limiter.limit(ip);
    if (!success) {
      return {
        ok: false,
        response: Response.json(
          { error: message },
          { status: 429, headers: { 'Retry-After': '3600', 'X-RateLimit-Remaining': String(remaining), 'X-RateLimit-Limit': String(max) } }
        ),
      };
    }
    return { ok: true };
  } catch (err) {
    console.error(`Rate limiter (${prefix}) unavailable, proceeding without limit:`, err);
    return { ok: true };
  }
}
