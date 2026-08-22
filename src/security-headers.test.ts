/**
 * SITE-SEC-BASELINE-HEADERS-001 - storefront baseline header coverage.
 *
 * The storefront had NO tests at all, so `npm test` exited 1 on "no test files
 * found". These are its first, and they guard the thing most likely to be
 * dropped by a future next.config edit: the headers are invisible in the UI, so
 * nothing else would notice their absence until a scan.
 */
import { describe, it, expect } from 'vitest';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import nextConfig from '../next.config.js';

type HeaderEntry = { key: string; value: string };

async function headerMap(): Promise<Record<string, string>> {
  const groups = await (nextConfig as { headers: () => Promise<Array<{ headers: HeaderEntry[] }>> }).headers();
  const out: Record<string, string> = {};
  for (const g of groups) for (const h of g.headers) out[h.key.toLowerCase()] = h.value;
  return out;
}

describe('baseline security headers', () => {
  it('serves HSTS with includeSubDomains', async () => {
    const h = await headerMap();
    expect(h['strict-transport-security']).toBeDefined();
    expect(h['strict-transport-security']).toContain('includeSubDomains');
  });

  it('does NOT preload: that is effectively irreversible and is a deliberate decision', async () => {
    const h = await headerMap();
    expect(h['strict-transport-security']).not.toContain('preload');
  });

  it('HSTS is the fleet-standard one year, ramped after live verification', async () => {
    // Staged at max-age=86400 for the first deploy, then RAMPED to 31536000 on
    // 2026-08-21 once `check:prod-headers` passed exit 0 against the live apex,
    // www and app. Now matches app/academy/velocity.
    const h = await headerMap();
    expect(h['strict-transport-security']).toContain('max-age=31536000');
  });

  it('keeps the pre-existing four headers', async () => {
    const h = await headerMap();
    expect(h['x-content-type-options']).toBe('nosniff');
    expect(h['x-frame-options']).toBe('DENY');
    expect(h['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(h['permissions-policy']).toBeDefined();
  });
});

describe('storefront CSP is restrictive', () => {
  it('allows no external origin anywhere: the site loads nothing off-origin', async () => {
    const csp = (await headerMap())['content-security-policy'];
    expect(csp).toBeDefined();
    // No https:// host allowances at all, and no wildcards.
    expect(csp).not.toMatch(/https:\/\//);
    expect(csp).not.toContain('*');
  });

  it('refuses framing, plugins and off-origin form posts', async () => {
    const csp = (await headerMap())['content-security-policy'];
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("form-action 'self'");
    expect(csp).toContain("base-uri 'self'");
  });

  it("keeps script inline, which is load-bearing for prerendered Next pages", async () => {
    // Proven the expensive way in AND-SEC-CSP-TIGHTENING-001: a nonce policy
    // blanks statically prerendered pages, because their HTML is built once and
    // cannot carry a per-request nonce. Documented rather than silently left in.
    const csp = (await headerMap())['content-security-policy'];
    expect(csp).toContain("script-src 'self' 'unsafe-inline'");
  });
});

describe('house copy rule', () => {
  it('no em dash in the layout metadata (title, description, OG)', async () => {
    // Read the source rather than import it: layout.tsx uses the `@/` alias,
    // and wiring a vite alias for one assertion is more config than the check
    // is worth. The live-serving half is covered by scripts/check-copy.mjs --live.
    const { readFileSync } = await import('node:fs');
    const src = readFileSync(new URL('./app/layout.tsx', import.meta.url), 'utf8');
    const metaBlock = src.slice(src.indexOf('export const metadata'), src.indexOf('export default'));
    expect(metaBlock.length).toBeGreaterThan(0);
    // The em dash is written as its escape (U+2014) so this assertion does not
    // itself trip the source half of scripts/check-copy.mjs, which scans for
    // the literal character. Behaviourally identical.
    expect(metaBlock).not.toContain('\u2014');
  });
});
