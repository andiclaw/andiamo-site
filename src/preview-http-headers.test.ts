/**
 * Lead #9452: the local preview (pm2 andiamo-site-preview, http://192.168.1.101:3019, plain http on a LAN IP) rendered
 * with no CSS for Brendan. The CSP's upgrade-insecure-requests makes the browser rewrite every /_next asset to https on
 * an address that has no TLS. The fix is a PREVIEW-ONLY switch, SITE_PREVIEW_HTTP=1, that drops upgrade-insecure-requests
 * and HSTS. Nothing else changes, and with the switch unset the production headers are byte-identical to what the site
 * served before this change (values pinned below as served by 2372bff, curl -I, 2026-10-07 23:5x).
 *
 * next.config.js headers() are baked in at `next build`, so the switch must be set at build time for the preview.
 * Written to FAIL on 2372bff.
 */
import { spawnSync } from 'node:child_process';
import { afterEach, describe, expect, it } from 'vitest';
import nextConfig from '../next.config.js';

const PROD = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
  'strict-transport-security': 'max-age=31536000; includeSubDomains',
  'content-security-policy':
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
};

async function headers(): Promise<{ source: string; map: Record<string, string>; order: string[] }> {
  const groups = await nextConfig.headers();
  expect(groups.length).toBe(1);
  const map: Record<string, string> = {};
  for (const h of groups[0].headers) map[h.key.toLowerCase()] = h.value;
  return { source: groups[0].source, map, order: groups[0].headers.map((h) => h.key) };
}

afterEach(() => {
  delete process.env.SITE_PREVIEW_HTTP;
});

describe('production (switch unset): byte-identical to what the site serves today', () => {
  it('the same six headers, same values, same order, same route', async () => {
    const h = await headers();
    expect(h.source).toBe('/(.*)');
    expect(h.map).toEqual(PROD);
    expect(h.order).toEqual(['X-Content-Type-Options', 'X-Frame-Options', 'Referrer-Policy', 'Permissions-Policy', 'Strict-Transport-Security', 'Content-Security-Policy']);
  });
  it('only exactly "1" turns the preview on: "", "0", "true", "yes" all leave production untouched', async () => {
    for (const v of ['', '0', 'true', 'yes', ' 1']) {
      process.env.SITE_PREVIEW_HTTP = v;
      expect((await headers()).map, JSON.stringify(v)).toEqual(PROD);
    }
  });
});

describe('preview (SITE_PREVIEW_HTTP=1): drops exactly upgrade-insecure-requests and HSTS', () => {
  it('no HSTS; the CSP minus upgrade-insecure-requests; the other four headers unchanged', async () => {
    process.env.SITE_PREVIEW_HTTP = '1';
    const { map } = await headers();
    expect(map['strict-transport-security']).toBeUndefined();
    expect(map['content-security-policy']).toBe(PROD['content-security-policy'].replace('; upgrade-insecure-requests', ''));
    expect(map['content-security-policy']).not.toContain('upgrade-insecure-requests');
    for (const k of ['x-content-type-options', 'x-frame-options', 'referrer-policy', 'permissions-policy'] as const) expect(map[k]).toBe(PROD[k]);
  });
});

describe('the switch can never reach production by config', () => {
  it('nothing but next.config.js and tests names SITE_PREVIEW_HTTP (no Dockerfile, workflow or infra file)', () => {
    // git grep exits 1 when nothing matches; only the output matters.
    const r = spawnSync('git', ['grep', '-l', 'SITE_PREVIEW_HTTP', '--', '.', ':!next.config.js', ':!*.test.ts', ':!*.md'], { encoding: 'utf8' });
    expect(r.error).toBeUndefined();
    expect(r.stdout).toBe('');
  });
});
