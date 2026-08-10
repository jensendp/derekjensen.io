export const prerender = false;

import type { APIRoute } from 'astro';
import { checkRateLimit } from '@utils/ratelimit';

const BREVO_API = 'https://api.brevo.com/v3';
const AI_VISIBILITY_LIST_ID = 7;
const FETCH_TIMEOUT_MS = 8000;

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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Basic SSRF guard for the user-supplied websiteUrl: only allow http(s) to what looks like a
// public hostname. Not bulletproof (doesn't resolve DNS to catch rebinding to an internal IP),
// but blocks the obvious cases — localhost, link-local/cloud-metadata, and private RFC1918
// ranges submitted directly as the host.
function isSafeExternalUrl(rawUrl: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return false;

  const host = parsed.hostname.toLowerCase();
  if (host === 'localhost' || host === '0.0.0.0' || host.endsWith('.local')) return false;

  // IPv4 literal checks (loopback, link-local incl. cloud metadata 169.254.169.254, RFC1918 private)
  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const [a, b] = ipv4.slice(1).map(Number);
    if (a === 127 || a === 10 || a === 169 && b === 254 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) {
      return false;
    }
  }
  if (host === '::1' || host.startsWith('fe80:') || host.startsWith('fc') || host.startsWith('fd')) return false;

  return true;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = FETCH_TIMEOUT_MS): Promise<Response | null> {
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

// --- Normalization helpers for NAP comparison ---

function normalizePhone(phone: string | null | undefined): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '').replace(/^1(\d{10})$/, '$1'); // strip leading US country code
}

function normalizeAddress(address: string | null | undefined): string {
  if (!address) return '';
  return address
    .toLowerCase()
    .replace(/\b(suite|ste|unit|#)\s*\w*/g, '')
    .replace(/[.,]/g, '')
    .replace(/\bstreet\b/g, 'st')
    .replace(/\bavenue\b/g, 'ave')
    .replace(/\bboulevard\b/g, 'blvd')
    .replace(/\bdrive\b/g, 'dr')
    .replace(/\broad\b/g, 'rd')
    .replace(/\s+/g, ' ')
    .trim();
}

function addressesRoughlyMatch(a: string, b: string): boolean {
  if (!a || !b) return false;
  const na = normalizeAddress(a);
  const nb = normalizeAddress(b);
  if (!na || !nb) return false;
  // Compare the leading street-number + street-name token chunk (first 3 words) —
  // good enough to catch "same place, formatted differently" without a full geocode.
  const chunk = (s: string) => s.split(' ').slice(0, 3).join(' ');
  return chunk(na) === chunk(nb) || na.includes(nb) || nb.includes(na);
}

const NAME_STOPWORDS = new Set([
  'the', 'and', 'of', 'a', 'an', 'llc', 'inc', 'incorporated', 'pllc', 'pc', 'pa', 'llp', 'lp',
  'co', 'company', 'corp', 'corporation', 'ltd', 'group', 'associates', 'partners',
]);

function normalizeName(name: string | null | undefined): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !NAME_STOPWORDS.has(w))
    .join(' ')
    .trim();
}

function namesRoughlyMatch(a: string, b: string): boolean {
  if (!a || !b) return false;
  const na = normalizeName(a);
  const nb = normalizeName(b);
  if (!na || !nb) return false;
  // Meaningful-word overlap rather than exact match — site titles/H1s are often phrased
  // differently from the Google listing name ("Hamilton & Antonsen" vs "Hamilton and
  // Antonsen Law Offices"), so require the shorter name's words to mostly appear in the
  // longer one rather than a strict substring/equality check.
  const wordsA = na.split(' ').filter((w) => w.length > 2);
  const wordsB = nb.split(' ').filter((w) => w.length > 2);
  if (wordsA.length === 0 || wordsB.length === 0) return false;
  const [shorter, longer] = wordsA.length <= wordsB.length ? [wordsA, wordsB] : [wordsB, wordsA];
  const longerSet = new Set(longer);
  const overlap = shorter.filter((w) => longerSet.has(w)).length;
  return overlap / shorter.length >= 0.6;
}

// --- Google Places (legacy Text Search + Details — plain API key, no OAuth/approval) ---

interface GooglePlaceResult {
  found: boolean;
  name?: string;
  formattedAddress?: string;
  phone?: string;
  website?: string;
  rating?: number;
  userRatingsTotal?: number;
  placeId?: string;
  /** OPERATIONAL | CLOSED_TEMPORARILY | CLOSED_PERMANENTLY */
  businessStatus?: string;
}

async function lookupGooglePlace(query: string, apiKey: string): Promise<GooglePlaceResult> {
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`;
  const searchRes = await fetchWithTimeout(searchUrl);
  if (!searchRes || !searchRes.ok) return { found: false };

  const searchData = await searchRes.json().catch(() => null);
  const top = searchData?.results?.[0];
  if (!top?.place_id) return { found: false };

  const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${top.place_id}&fields=name,formatted_address,formatted_phone_number,international_phone_number,website,rating,user_ratings_total,business_status&key=${apiKey}`;
  const detailsRes = await fetchWithTimeout(detailsUrl);
  const details = detailsRes && detailsRes.ok ? (await detailsRes.json().catch(() => null))?.result : null;

  return {
    found: true,
    name: details?.name || top.name,
    formattedAddress: details?.formatted_address || top.formatted_address,
    phone: details?.formatted_phone_number || details?.international_phone_number,
    website: details?.website,
    rating: details?.rating ?? top.rating,
    userRatingsTotal: details?.user_ratings_total ?? top.user_ratings_total,
    placeId: top.place_id,
    businessStatus: details?.business_status ?? top.business_status,
  };
}

// --- Website scan: LocalBusiness schema, visible NAP, FAQ-style content ---

interface WebsiteScan {
  reachable: boolean;
  /** Site responded but returned an error status (e.g. a WAF blocking our scan) — the site
   *  itself may be perfectly fine, we just couldn't read it. Distinct from `!reachable`,
   *  which means the fetch itself failed (DNS, timeout, connection refused). */
  scanBlocked: boolean;
  hasLocalBusinessSchema: boolean;
  hasStructuredHours: boolean;
  schemaPhone?: string;
  schemaAddress?: string;
  visiblePhone?: string;
  visibleAddress?: string;
  siteName?: string;
  hasFaqContent: boolean;
}

const FAQ_PATTERNS = [
  /how much (does|is|do)/i,
  /do you (offer|provide|service|accept)/i,
  /what (is|are) your (hours|price|cost|rates)/i,
  /frequently asked questions/i,
  /\bfaq\b/i,
];

function scanWebsite(html: string): WebsiteScan {
  const scan: WebsiteScan = {
    reachable: true,
    scanBlocked: false,
    hasLocalBusinessSchema: false,
    hasStructuredHours: false,
    hasFaqContent: false,
  };

  // JSON-LD LocalBusiness schema
  const jsonLdMatches = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of jsonLdMatches) {
    try {
      const parsed = JSON.parse(match[1].trim());
      const nodes = Array.isArray(parsed) ? parsed : [parsed, ...(parsed['@graph'] || [])];
      for (const node of nodes) {
        const type = node?.['@type'];
        const types = Array.isArray(type) ? type : [type];
        if (types.some((t) => typeof t === 'string' && /localbusiness|store|restaurant|professionalservice/i.test(t))) {
          scan.hasLocalBusinessSchema = true;
          scan.schemaPhone = node.telephone;
          const addr = node.address;
          if (typeof addr === 'string') scan.schemaAddress = addr;
          else if (addr && typeof addr === 'object') {
            scan.schemaAddress = [addr.streetAddress, addr.addressLocality, addr.addressRegion, addr.postalCode]
              .filter(Boolean)
              .join(' ');
          }
          if (node.openingHours || node.openingHoursSpecification) scan.hasStructuredHours = true;
        }
      }
    } catch {
      // malformed JSON-LD — skip
    }
  }

  // Site name — <title> first, falling back to the first <h1> — used to check the "N" in
  // NAP, which nothing else on this page currently checks.
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const rawName = titleMatch?.[1] || h1Match?.[1];
  if (rawName) scan.siteName = rawName.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  // Strip script/style content before any text-based scanning — asset hashes, cache-busting
  // version numbers, and tracking IDs inside <script>/<style> blocks are full of digit runs
  // that look like phone numbers but aren't.
  const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
  const textOnly = withoutScripts.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|\s+/g, ' ');

  // Visible phone number: prefer an explicit tel: link (unambiguous) over pattern-matching
  // free text, and require actual phone-like separators (parens/dash/dot/space) rather than
  // any bare 10-digit run, which false-positives on hashes, IDs, and query params.
  const telMatch = withoutScripts.match(/href=["']tel:([+\d().\s-]{7,})["']/i);
  const loosePhoneMatch = textOnly.match(/(\(\d{3}\)\s?\d{3}[-.\s]\d{4}|\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b)/);
  scan.visiblePhone = telMatch?.[1] || loosePhoneMatch?.[1];

  // Visible street address, only used when there's no JSON-LD schema to check instead —
  // plenty of sites (like this one) show the address as plain text with no structured data.
  const addressMatch = textOnly.match(
    /\d{1,6}\s+[A-Za-z0-9.'-]+(?:\s+[A-Za-z0-9.'-]+){0,4}\s*,?\s*(?:Suite|Ste\.?|Unit|#)?\s*\d{0,5}\s*,?\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}/
  );
  if (addressMatch) scan.visibleAddress = addressMatch[0];

  // FAQ-style, AI-answerable content
  scan.hasFaqContent = FAQ_PATTERNS.some((p) => p.test(textOnly));

  return scan;
}

const BROWSER_USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function scanSite(siteUrl: string): Promise<WebsiteScan> {
  // Use a real browser UA — some sites (correctly) block anything that looks like a generic
  // bot/scanner, which would otherwise get misread as "the site is down."
  const siteRes = await fetchWithTimeout(siteUrl, { headers: { 'User-Agent': BROWSER_USER_AGENT } });
  if (siteRes && siteRes.ok) {
    return scanWebsite(await siteRes.text());
  }
  if (siteRes) {
    // The site responded — it's up — but returned an error (often a WAF blocking automated
    // scans). Don't report the site as broken; report that the scan itself was blocked.
    return { reachable: true, scanBlocked: true, hasLocalBusinessSchema: false, hasStructuredHours: false, hasFaqContent: false };
  }
  // fetch itself failed — genuine network failure (DNS, timeout, connection refused).
  return { reachable: false, scanBlocked: false, hasLocalBusinessSchema: false, hasStructuredHours: false, hasFaqContent: false };
}

// --- Crawler access: can AI bots even reach this site, and does it help them along? ---

// Known AI crawler/agent user-agents — if a site blocks these in robots.txt, it's invisible
// to AI search regardless of content quality. Not an exhaustive list, but covers the major ones.
const AI_BOT_USER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'Google-Extended',
  'PerplexityBot',
  'Perplexity-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'CCBot',
  'Bytespider',
  'Amazonbot',
  'cohere-ai',
  'Diffbot',
];

interface CrawlerAccessScan {
  robotsChecked: boolean;
  blockedBots: string[];
  hasLlmsTxt: boolean;
}

interface RobotsGroup {
  agents: string[];
  disallowAll: boolean;
}

// Best-effort robots.txt group parser — not a full spec implementation (doesn't handle
// Allow-overrides-Disallow precedence), but good enough to catch the common case: a bot
// is listed (by name or via "*") in a group whose only rule is "Disallow: /".
function parseRobotsGroups(robotsTxt: string): RobotsGroup[] {
  const groups: RobotsGroup[] = [];
  let current: RobotsGroup | null = null;
  let sawDirective = false;

  for (const rawLine of robotsTxt.split('\n')) {
    const line = rawLine.split('#')[0].trim();
    if (!line) continue;

    const uaMatch = line.match(/^user-agent:\s*(.+)$/i);
    if (uaMatch) {
      if (!current || sawDirective) {
        if (current) groups.push(current);
        current = { agents: [], disallowAll: false };
        sawDirective = false;
      }
      current.agents.push(uaMatch[1].trim());
      continue;
    }

    const disallowMatch = line.match(/^disallow:\s*(.*)$/i);
    if (disallowMatch && current) {
      sawDirective = true;
      if (disallowMatch[1].trim() === '/') current.disallowAll = true;
    }
  }
  if (current) groups.push(current);
  return groups;
}

function robotsBlocksBot(groups: RobotsGroup[], botName: string): boolean {
  return groups.some(
    (g) => g.disallowAll && g.agents.some((a) => a === '*' || a.toLowerCase() === botName.toLowerCase())
  );
}

async function checkCrawlerAccess(origin: string): Promise<CrawlerAccessScan> {
  const scan: CrawlerAccessScan = { robotsChecked: false, blockedBots: [], hasLlmsTxt: false };

  const [robotsRes, llmsRes] = await Promise.all([
    fetchWithTimeout(`${origin}/robots.txt`),
    fetchWithTimeout(`${origin}/llms.txt`),
  ]);

  if (robotsRes && robotsRes.ok) {
    scan.robotsChecked = true;
    const groups = parseRobotsGroups(await robotsRes.text());
    scan.blockedBots = AI_BOT_USER_AGENTS.filter((bot) => robotsBlocksBot(groups, bot));
  }

  scan.hasLlmsTxt = Boolean(llmsRes && llmsRes.ok);

  return scan;
}

// --- Scoring model ---

interface ScoreBreakdown {
  total: number;
  presence: { score: number; max: number; note: string };
  reviews: { score: number; max: number; note: string };
  schema: { score: number; max: number; note: string };
  nap: { score: number; max: number; note: string };
  faq: { score: number; max: number; note: string };
  crawlerAccess: { score: number; max: number; note: string };
}

function computeScore(
  place: GooglePlaceResult,
  site: WebsiteScan | null,
  inputAddress: string,
  inputBusinessName: string,
  crawler: CrawlerAccessScan | null
): ScoreBreakdown {
  const breakdown: ScoreBreakdown = {
    total: 0,
    presence: { score: 0, max: 25, note: '' },
    reviews: { score: 0, max: 10, note: '' },
    schema: { score: 0, max: 15, note: '' },
    nap: { score: 0, max: 15, note: '' },
    faq: { score: 0, max: 10, note: '' },
    crawlerAccess: { score: 0, max: 25, note: '' },
  };

  // Presence on Google — the primary data source AI assistants pull local recommendations from.
  // A listing marked closed is worse than no listing at all — it actively misleads AI systems
  // (and customers) rather than just being absent, so it zeroes this category regardless of
  // everything else being in order.
  if (place.found && place.businessStatus === 'CLOSED_PERMANENTLY') {
    breakdown.presence.note = "Google shows this business as PERMANENTLY CLOSED. AI assistants will actively tell people you're closed, or simply won't recommend you at all. This needs to be corrected in Google Business Profile immediately.";
  } else if (place.found && place.businessStatus === 'CLOSED_TEMPORARILY') {
    breakdown.presence.note = 'Google shows this business as TEMPORARILY CLOSED. If that\'s no longer accurate, AI assistants are working from stale information and won\'t recommend you until it\'s updated.';
  } else if (place.found) {
    breakdown.presence.score = 25;
    breakdown.presence.note = 'Listed on Google — the primary source AI assistants pull local business data from.';
  } else {
    breakdown.presence.note = "Not found on Google Business Profile — AI assistants have no reliable source to recommend you from.";
  }

  // Review signal
  const count = place.userRatingsTotal ?? 0;
  if (count >= 50) {
    breakdown.reviews.score = 10;
    breakdown.reviews.note = `${count} reviews — strong signal.`;
  } else if (count >= 11) {
    breakdown.reviews.score = 7;
    breakdown.reviews.note = `${count} reviews — decent, but more would help.`;
  } else if (count >= 1) {
    breakdown.reviews.score = 3;
    breakdown.reviews.note = `Only ${count} review(s) — thin signal for AI ranking.`;
  } else {
    breakdown.reviews.note = 'No reviews found.';
  }

  // Crawler access — can AI bots even reach this site? This is a gate, not a nice-to-have:
  // a site that blocks GPTBot/ClaudeBot/PerplexityBot in robots.txt is invisible to any AI
  // system that crawls or browses live, regardless of how good the content is.
  if (!crawler) {
    breakdown.crawlerAccess.note = 'No website to check — crawler access could not be verified.';
  } else if (!crawler.robotsChecked) {
    breakdown.crawlerAccess.score = 20;
    breakdown.crawlerAccess.note = 'No robots.txt found, which means nothing is explicitly blocking AI crawlers — but adding one that explicitly allows them is still worthwhile.';
  } else if (crawler.blockedBots.length > 0) {
    breakdown.crawlerAccess.note = `robots.txt is blocking AI crawlers: ${crawler.blockedBots.join(', ')}. These bots can't read the site at all, regardless of content quality.`;
  } else {
    breakdown.crawlerAccess.score = 20;
    breakdown.crawlerAccess.note = 'robots.txt does not block known AI crawlers — good.';
  }
  if (crawler?.hasLlmsTxt) {
    breakdown.crawlerAccess.score += 5;
    breakdown.crawlerAccess.note += ' Also has an llms.txt file — a new, still-rare convention that explicitly guides AI agents, a strong signal of AI-readiness.';
  } else if (crawler) {
    breakdown.crawlerAccess.note += ' No llms.txt file found (an emerging, still-uncommon convention for guiding AI agents — not having one is normal for now, but adding one is an easy differentiator).';
  }

  // A site that's up but blocked our scan is NOT the same as a site that's down — say so
  // explicitly rather than let a WAF/bot-block get reported as "your website is broken."
  const scanUnavailable = Boolean(site?.scanBlocked);
  const siteDown = Boolean(site && !site.reachable);

  // Schema markup — base credit for having LocalBusiness structured data at all, plus a bonus
  // for it including machine-readable hours specifically (needed to answer "are they open now").
  if (site?.hasLocalBusinessSchema) {
    breakdown.schema.score = 10;
    breakdown.schema.note = 'Website has LocalBusiness structured data — machine-readable, exactly what AI systems prefer.';
    if (site.hasStructuredHours) {
      breakdown.schema.score += 5;
      breakdown.schema.note += ' It also includes structured hours, so AI can answer "are they open right now" accurately.';
    } else {
      breakdown.schema.note += ' It\'s missing structured hours, though — AI has no reliable way to answer "are they open right now."';
    }
  } else if (scanUnavailable) {
    breakdown.schema.note = "The website is online, but blocked our automated scan (common with security/bot-protection tools) — we couldn't check for structured data. Worth verifying manually.";
  } else if (siteDown) {
    breakdown.schema.note = 'Website not reachable or not provided — could not check for schema markup.';
  } else if (site?.reachable) {
    breakdown.schema.note = 'No LocalBusiness schema found on the website — AI has to guess business details from page text.';
  } else {
    breakdown.schema.note = 'No website provided — could not check for schema markup.';
  }

  // NAP consistency (Google listing vs. website)
  let napPoints = 0;
  const napNotes: string[] = [];
  if (scanUnavailable) {
    napNotes.push("The website is online, but blocked our automated scan, so NAP consistency couldn't be checked automatically.");
  } else if (site?.reachable) {
    const referenceName = place.name || inputBusinessName;
    if (referenceName && site.siteName && namesRoughlyMatch(referenceName, site.siteName)) {
      napPoints += 3;
      napNotes.push('Business name matches between Google and the website title.');
    } else if (site.siteName) {
      napNotes.push(`Business name on the website ("${site.siteName}") doesn't clearly match the Google listing name — worth double-checking.`);
    } else {
      napNotes.push('Could not find a business name on the website to compare.');
    }

    const sitePhone = site.schemaPhone || site.visiblePhone;
    if (place.phone && sitePhone && normalizePhone(place.phone) === normalizePhone(sitePhone)) {
      napPoints += 6;
      napNotes.push('Phone number matches between Google and the website.');
    } else if (place.phone && sitePhone) {
      napNotes.push('Phone number MISMATCH between Google listing and website — this actively confuses AI systems.');
    } else {
      napNotes.push('Could not confirm phone number on the website.');
    }

    const siteAddress = site.schemaAddress || site.visibleAddress;
    if (place.formattedAddress && siteAddress && addressesRoughlyMatch(place.formattedAddress, siteAddress)) {
      napPoints += 6;
      napNotes.push('Address matches between Google and the website.');
    } else if (place.formattedAddress && addressesRoughlyMatch(place.formattedAddress, inputAddress)) {
      napPoints += 3;
      napNotes.push('Address confirmed against your input, but not independently found on the website.');
    } else {
      napNotes.push('Could not confirm a consistent address on the website.');
    }
  } else if (siteDown) {
    napNotes.push('Website was not reachable — NAP consistency could not be checked.');
  } else {
    napNotes.push('No website to compare against — NAP consistency could not be checked.');
  }
  breakdown.nap.score = napPoints;
  breakdown.nap.note = napNotes.join(' ');

  // FAQ / AI-answerable content
  if (site?.hasFaqContent) {
    breakdown.faq.score = 10;
    breakdown.faq.note = "Website has FAQ-style content phrased the way people ask AI assistants questions.";
  } else if (scanUnavailable) {
    breakdown.faq.note = "The website is online, but blocked our automated scan — we couldn't check for FAQ-style content.";
  } else if (siteDown) {
    breakdown.faq.note = 'Website not reachable — could not check for FAQ-style content.';
  } else if (site?.reachable) {
    breakdown.faq.note = "No FAQ-style content found — add plain-language Q&A ('How much does X cost?', 'Do you offer Y?') to give AI something to cite.";
  } else {
    breakdown.faq.note = 'No website provided — could not check for FAQ-style content.';
  }

  breakdown.total =
    breakdown.presence.score +
    breakdown.reviews.score +
    breakdown.schema.score +
    breakdown.nap.score +
    breakdown.faq.score +
    breakdown.crawlerAccess.score;

  return breakdown;
}

const BREAKDOWN_LABELS: Record<keyof Omit<ScoreBreakdown, 'total'>, string> = {
  presence: 'Listed on Google',
  reviews: 'Review signal',
  crawlerAccess: 'AI crawler access',
  schema: 'Website structured data',
  nap: 'Name/address/phone consistency',
  faq: 'AI-answerable content',
};

function buildReportEmail(businessName: string, breakdown: ScoreBreakdown, summary: string | null): { html: string; text: string } {
  const rows = (Object.keys(BREAKDOWN_LABELS) as (keyof typeof BREAKDOWN_LABELS)[]).map((key) => {
    const item = breakdown[key];
    return { label: BREAKDOWN_LABELS[key], score: item.score, max: item.max, note: item.note };
  });

  const html = `
<p>Here's your AI Visibility report for <strong>${escapeHtml(businessName)}</strong>:</p>
<p style="font-size: 28px; font-weight: bold; margin: 16px 0 4px;">${breakdown.total}/100</p>
${summary ? `<p>${escapeHtml(summary).replace(/\n/g, '</p><p>')}</p>` : ''}
<h3 style="margin-top: 24px;">Score breakdown</h3>
<ul>
${rows.map((r) => `<li><strong>${escapeHtml(r.label)}: ${r.score}/${r.max}</strong> — ${escapeHtml(r.note)}</li>`).join('\n')}
</ul>
<p style="margin-top: 24px;">Want help fixing what's holding your score back? I offer a free 30-minute
<a href="https://derekjensen.io/time-back">Time Back session</a> — no pitch, just a walkthrough of what to fix first.</p>
<hr />
<p>— Derek</p>`;

  const text = `Here's your AI Visibility report for ${businessName}:

Score: ${breakdown.total}/100

${summary ? summary + '\n\n' : ''}Score breakdown:
${rows.map((r) => `- ${r.label}: ${r.score}/${r.max} — ${r.note}`).join('\n')}

Want help fixing what's holding your score back? Free 30-minute Time Back session, no pitch:
https://derekjensen.io/time-back

— Derek`;

  return { html, text };
}

async function generateSummary(businessName: string, breakdown: ScoreBreakdown, apiKey: string): Promise<string | null> {
  const prompt = `A local business called "${businessName}" just ran an AI-visibility audit — a check for whether AI assistants like ChatGPT, Perplexity, and Gemini can find and recommend this business when someone asks for a local recommendation.

Score: ${breakdown.total}/100

Breakdown:
- Google presence: ${breakdown.presence.score}/${breakdown.presence.max} — ${breakdown.presence.note}
- Review signal: ${breakdown.reviews.score}/${breakdown.reviews.max} — ${breakdown.reviews.note}
- AI crawler access (robots.txt / llms.txt): ${breakdown.crawlerAccess.score}/${breakdown.crawlerAccess.max} — ${breakdown.crawlerAccess.note}
- Website schema markup: ${breakdown.schema.score}/${breakdown.schema.max} — ${breakdown.schema.note}
- NAP (name/address/phone) consistency: ${breakdown.nap.score}/${breakdown.nap.max} — ${breakdown.nap.note}
- FAQ / AI-answerable content: ${breakdown.faq.score}/${breakdown.faq.max} — ${breakdown.faq.note}

Write a short, plain-English summary (120-180 words) explaining why this business is or isn't visible to AI search right now, in a direct and slightly urgent tone (not alarmist). End with the single highest-priority fix they should make first. No markdown headers, no bullet lists — just a few tight paragraphs a business owner with no technical background can understand.

Important: rely only on what the breakdown notes actually say. If a note says the scan was blocked or couldn't check something, say that a check couldn't be completed — never claim the website is broken, down, or "not working" unless a note explicitly says it wasn't reachable.`;

  const response = await fetchWithTimeout(
    'https://api.anthropic.com/v1/messages',
    {
      method: 'POST',
      headers: {
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 500,
        system: 'You are an AI-search-visibility expert writing directly to a small business owner. Be specific, concrete, and never generic.',
        messages: [{ role: 'user', content: prompt }],
      }),
    },
    12000 // Claude calls can run a bit longer than a plain page fetch
  );

  if (!response || !response.ok) return null;
  const data = await response.json().catch(() => null);
  return data?.content?.[0]?.text || null;
}

export const POST: APIRoute = async ({ request }) => {
  const rateLimit = await checkRateLimit(request, 'ai-visibility-check', {
    limit: 5,
    window: '1 h',
    message: 'Rate limit reached. You can run up to 5 checks per hour.',
  });
  if (!rateLimit.ok) return rateLimit.response;

  const json = await request.json().catch(() => null);
  if (!json) return Response.json({ error: 'Invalid request body.' }, { status: 400 });

  const { businessName, address, websiteUrl, email } = json;

  if (!businessName || typeof businessName !== 'string' || businessName.trim().length < 2)
    return Response.json({ error: 'Please enter a business name.' }, { status: 400 });

  if (!address || typeof address !== 'string' || address.trim().length < 3)
    return Response.json({ error: 'Please enter a city/address.' }, { status: 400 });

  if (!email || typeof email !== 'string' || !email.includes('@'))
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 400 });

  if (containsInjection(businessName) || containsInjection(address))
    return Response.json({ error: 'Input contains disallowed content. Please enter your business name and address naturally.' }, { status: 400 });

  if (websiteUrl && typeof websiteUrl === 'string' && websiteUrl.length > 0 && !isSafeExternalUrl(websiteUrl))
    return Response.json({ error: 'Please enter a valid, public website URL (including https://).' }, { status: 400 });

  const googleApiKey = import.meta.env.GOOGLE_PLACES_API_KEY;
  if (!googleApiKey) return Response.json({ error: 'Service not configured.' }, { status: 500 });

  const place = await lookupGooglePlace(`${businessName.trim()} ${address.trim()}`, googleApiKey);

  const siteUrl = (websiteUrl && websiteUrl.trim()) || place.website;
  // siteUrl may come from Google's own data (place.website) rather than user input — re-check
  // it too, since we don't control what Google has on file for a listing.
  const safeSiteUrl = siteUrl && isSafeExternalUrl(siteUrl) ? siteUrl : undefined;

  // Independent of each other — run concurrently rather than making the visitor wait through
  // both sequentially (the site fetch and the robots.txt/llms.txt checks don't depend on each
  // other's results, only on the same siteUrl).
  const [site, crawler] = await Promise.all([
    safeSiteUrl ? scanSite(safeSiteUrl) : Promise.resolve(null),
    safeSiteUrl ? checkCrawlerAccess(new URL(safeSiteUrl).origin).catch(() => null) : Promise.resolve(null),
  ]);

  const breakdown = computeScore(place, site, address.trim(), businessName.trim(), crawler);

  const anthropicApiKey = import.meta.env.ANTHROPIC_API_KEY;
  const summary = anthropicApiKey ? await generateSummary(businessName.trim(), breakdown, anthropicApiKey) : null;

  // Fire-and-forget: capture the lead in Brevo, don't block the response on it
  const brevoApiKey = import.meta.env.BREVO_API_KEY;
  const senderEmail = import.meta.env.BREVO_SENDER_EMAIL;
  if (brevoApiKey && senderEmail) {
    fetch(`${BREVO_API}/contacts`, {
      method: 'POST',
      headers: { 'api-key': brevoApiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        attributes: { BUSINESS: businessName.trim(), AI_VIS_SCORE: breakdown.total },
        listIds: [AI_VISIBILITY_LIST_ID],
        updateEnabled: true,
      }),
    }).catch(() => {});

    fetch(`${BREVO_API}/smtp/email`, {
      method: 'POST',
      headers: { 'api-key': brevoApiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: [{ email: senderEmail, name: 'Derek Jensen' }],
        sender: { name: 'derekjensen.io', email: senderEmail },
        replyTo: { email },
        subject: `New AI Visibility check: ${businessName.trim()} (${breakdown.total}/100)`,
        htmlContent: `<p>New AI Visibility check submitted:</p><ul><li><strong>Business:</strong> ${escapeHtml(businessName.trim())}</li><li><strong>Email:</strong> ${escapeHtml(email)}</li><li><strong>Score:</strong> ${breakdown.total}/100</li></ul>`,
        textContent: `New AI Visibility check: ${businessName.trim()} | ${email} | Score: ${breakdown.total}/100`,
      }),
    }).catch(() => {});

    // Deliver on what the form promises — send the visitor their own copy of the report.
    const reportEmail = buildReportEmail(place.name || businessName.trim(), breakdown, summary);
    fetch(`${BREVO_API}/smtp/email`, {
      method: 'POST',
      headers: { 'api-key': brevoApiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: [{ email }],
        sender: { name: 'Derek Jensen', email: senderEmail },
        replyTo: { email: senderEmail },
        subject: `Your AI Visibility report: ${breakdown.total}/100`,
        htmlContent: reportEmail.html,
        textContent: reportEmail.text,
      }),
    }).catch(() => {});
  }

  return Response.json({
    businessName: place.name || businessName.trim(),
    score: breakdown.total,
    breakdown,
    summary,
    googleFound: place.found,
    websiteChecked: Boolean(site?.reachable),
  });
};
