// Registry of clients with a gated /audits/[slug]/ area.
// Add one entry per client, then set the matching env var (in .env locally,
// and in Vercel → Project → Settings → Environment Variables for production)
// to that client's passcode.
export interface AuditClient {
  slug: string;
  name: string;
  /** Name of the env var holding this client's passcode. */
  envVar: string;
}

export const auditClients: Record<string, AuditClient> = {
  'absolute-integrated-health': {
    slug: 'absolute-integrated-health',
    name: 'Absolute Integrated Health',
    envVar: 'AUDIT_PASSWORD_ABSOLUTE_INTEGRATED_HEALTH',
  },
};

export function getAuditClient(slug: string): AuditClient | undefined {
  return auditClients[slug];
}
