import { defineMiddleware } from 'astro:middleware';
import { getAuditClient } from '@data/audit-clients';
import { hashPasscode } from '@utils/auditAuth';

// Gates every /audits/<client>/... page behind a per-client passcode.
// Deployed via the Vercel adapter, this compiles to real Vercel Edge Middleware,
// so it runs in front of the prerendered static audit pages too — not just SSR routes.

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  if (!pathname.startsWith('/audits/')) {
    return next();
  }

  const segments = pathname.split('/').filter(Boolean); // ['audits', slug, ...rest]
  const slug = segments[1];
  const client = slug ? getAuditClient(slug) : undefined;

  // Unknown client slug — nothing to gate, let it 404 normally.
  if (!client) {
    return next();
  }

  const loginPath = `/audits/${slug}/login`;
  if (pathname === loginPath) {
    return next();
  }

  const expectedPasscode = import.meta.env[client.envVar as keyof ImportMetaEnv] as string | undefined;

  // No passcode configured for this client yet — fail closed (deny) rather than leave it open.
  if (!expectedPasscode) {
    const next_param = encodeURIComponent(pathname + context.url.search);
    return context.redirect(`${loginPath}?next=${next_param}&unconfigured=1`);
  }

  const cookieName = `audit_${slug}`;
  const cookieValue = context.cookies.get(cookieName)?.value;
  const expectedHash = await hashPasscode(slug, expectedPasscode);

  if (cookieValue && cookieValue === expectedHash) {
    return next();
  }

  const next_param = encodeURIComponent(pathname + context.url.search);
  return context.redirect(`${loginPath}?next=${next_param}`);
});
