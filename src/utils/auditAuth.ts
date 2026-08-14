// Shared by src/middleware.ts and the /audits/[client]/login page.
export async function hashPasscode(slug: string, passcode: string): Promise<string> {
  const data = new TextEncoder().encode(`${slug}:${passcode}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export const AUDIT_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days
