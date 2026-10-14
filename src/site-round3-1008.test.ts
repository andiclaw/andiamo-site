/**
 * SITE-HOME-FEEDBACK-1008-002, founder feedback round 3 (Brendan 2026-10-08 19:0x on :3019 at 9d5fbed; lead #10246):
 * (1) the bubbles are circles with a status icon, no numbers; (2) section headers on the same scale as the top header;
 * (3) a one-line top header with "Andiamo Tech" removed above it; (4) an animated Enter button, a LIVE status pill read
 * from each app's real health endpoint plus a maintenance flag (never hardcoded; unknown says unknown) and a one-line
 * about; (5) the switcher's Academy line is the locked motto; (6) "A closer look" uses the real screenshots.
 * Written to FAIL on efcce43.
 */
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { HomeExperience } from './components/home-triangle/home-experience';
import { ecosystemApps } from './components/ecosystem/ecosystem-apps';
import { APP_PAGES } from './lib/app-pages';

type Kind = 'active' | 'degraded' | 'offline' | 'maintenance' | 'unknown';
type StatusLib = {
  STATUS_LABEL: Record<Kind | 'checking', string>;
  STATUS_SOURCES: Record<'academy' | 'velocity' | 'andiamo', { url: string; kind: 'ready' | 'health'; id: string }>;
  classify: (key: 'academy' | 'velocity' | 'andiamo', result: { ok: true; httpStatus: number; body: unknown } | { ok: false }, maintenance: boolean) => Kind;
  maintenanceKeys: (raw: string | undefined) => Set<string>;
};
const lib = () => import(/* @vite-ignore */ './lib/app-status') as unknown as Promise<StatusLib>;
const css = () => readFileSync('src/components/home-triangle/home-triangle.module.css', 'utf8');
const home = () => renderToStaticMarkup(createElement(HomeExperience, null, null));
const rule = (sel: string) => css().match(new RegExp(`(?:^|\\n)${sel.replace(/[.*]/g, (c) => `\\${c}`)} \\{([^}]*)\\}`))?.[1] ?? '';
const maxRem = (decl: string) => Number(decl.match(/font-size:\s*clamp\([^,]+,[^,]+,\s*([\d.]+)rem\)/)?.[1]);

describe('(1) circles with a status icon, no numbers', () => {
  it('each bubble is a circle', () => {
    expect(rule('.node')).toMatch(/border-radius:\s*50%/);
    expect(rule('.node')).toMatch(/aspect-ratio:\s*1/);
  });
  it('no 01/02/03 numbers; each bubble carries a status icon', () => {
    const html = home();
    expect(html).not.toMatch(/>0[123]</);
    expect(css()).not.toContain('.nodeNumber');
    for (const k of ['academy', 'velocity', 'andiamo']) expect(html).toMatch(new RegExp(`data-status-icon="${k}"`));
  });
});

describe('(2) section headers on the same scale as the top header', () => {
  it('the section h2 tops out no larger than the hero h1', () => {
    const h1 = maxRem(rule('.heroHeading h1')), h2 = maxRem(rule('.section h2'));
    expect(h1).toBeGreaterThan(0);
    expect(h2).toBeLessThanOrEqual(h1);
  });
});

describe('(3) one-line top header, no "Andiamo Tech" above it', () => {
  it('the hero has no eyebrow, and the heading does not wrap on wide screens', () => {
    const hero = home().split('</section>')[0];
    expect(hero).not.toContain('Andiamo Tech');
    expect(css()).not.toContain('.eyebrow');
    expect(rule('.heroHeading h1')).toMatch(/white-space:\s*nowrap/);
  });
});

// Seen in Chrome at 1440 on 3c6693c (home-1440-andiamo-open.png): the Academy circle rose into the one-line heading.
describe('(3) the Academy circle clears the heading', () => {
  it('the triangle sits at least 4.5rem below the heading on wide screens', () => {
    expect(Number(rule('.triangle').match(/margin:\s*([\d.]+)rem auto 0/)?.[1])).toBeGreaterThanOrEqual(4.5);
  });
});

describe('(4) live status, read from the real endpoints, never hardcoded', () => {
  it('the labels are the five Brendan named, plus a neutral one while the check runs', async () => {
    const { STATUS_LABEL } = await lib();
    expect(STATUS_LABEL).toEqual({
      active: 'Active', degraded: 'Degraded', offline: 'Offline', maintenance: 'Maintenance coming',
      unknown: 'Status unknown', checking: 'Checking status',
    });
  });
  it('each app is read from its own public endpoint: ready where it is public, health where it is not', async () => {
    const { STATUS_SOURCES } = await lib();
    expect(STATUS_SOURCES).toEqual({
      academy: { url: 'https://academy.andiamo.tech/api/ready', kind: 'ready', id: 'academy' },
      velocity: { url: 'https://velocity.andiamo.tech/api/health', kind: 'health', id: 'velocity' },
      andiamo: { url: 'https://rides.andiamo.tech/api/ready', kind: 'ready', id: 'andiamo' },
    });
  });
  it('classification: what the endpoint says, and unknown whenever it says nothing we can trust', async () => {
    const { classify } = await lib();
    const r = (httpStatus: number, body: unknown) => ({ ok: true as const, httpStatus, body });
    expect(classify('academy', r(200, { service: 'academy', state: 'ok' }), false)).toBe('active');
    expect(classify('academy', r(200, { service: 'academy', state: 'degraded' }), false)).toBe('degraded');
    expect(classify('academy', r(503, { service: 'academy', state: 'down' }), false)).toBe('offline');
    expect(classify('andiamo', r(200, { app: 'andiamo', state: 'ok' }), false)).toBe('active');
    expect(classify('andiamo', r(502, 'Bad Gateway'), false)).toBe('offline');
    expect(classify('velocity', r(200, { status: 'ok', service: 'velocity' }), false)).toBe('active');
    // A 200 from something that is not the app (a parked page, a wrong host) proves nothing.
    expect(classify('academy', r(200, { service: 'other', state: 'ok' }), false)).toBe('unknown');
    expect(classify('velocity', r(200, '<html>'), false)).toBe('unknown');
    expect(classify('velocity', r(200, { status: 'starting', service: 'velocity' }), false)).toBe('unknown');
    expect(classify('academy', r(200, { service: 'academy', state: 'mystery' }), false)).toBe('unknown');
    expect(classify('academy', r(404, {}), false)).toBe('unknown');
    expect(classify('academy', { ok: false }, false)).toBe('unknown');
    // The maintenance flag is the operator's word and outranks the probe.
    expect(classify('academy', r(200, { service: 'academy', state: 'ok' }), true)).toBe('maintenance');
  });
  it('the maintenance flag is a runtime setting naming apps, not a constant', async () => {
    const { maintenanceKeys } = await lib();
    expect([...maintenanceKeys(undefined)]).toEqual([]);
    expect([...maintenanceKeys(' velocity , andiamo,nope ')].sort()).toEqual(['andiamo', 'velocity']);
    expect(readFileSync('src/app/api/status/route.ts', 'utf8')).toContain('process.env.SITE_MAINTENANCE_APPS');
  });
  it('the home renders "Checking status" until the browser reads /api/status; no state is baked into the page', () => {
    const html = home();
    expect(html.match(/Checking status/g)?.length).toBe(3);
    for (const word of ['>Active<', '>Degraded<', '>Offline<', '>Maintenance coming<']) expect(html).not.toContain(word);
    expect(readFileSync('src/components/home-triangle/home-experience.tsx', 'utf8')).toContain("'/api/status'");
  });
});

describe('(4) the status route reads only the three fixed endpoints', () => {
  afterEach(() => { vi.unstubAllGlobals(); vi.resetModules(); });
  it('fetches exactly the three sources, whatever the request carries, and is never cached', async () => {
    const seen: string[] = [];
    vi.stubGlobal('fetch', vi.fn(async (u: string) => {
      seen.push(String(u));
      const body = String(u).includes('velocity') ? { status: 'ok', service: 'velocity' } : String(u).includes('rides') ? { app: 'andiamo', state: 'degraded' } : { service: 'academy', state: 'ok' };
      return new Response(JSON.stringify(body), { status: 200, headers: { 'content-type': 'application/json' } });
    }));
    const { GET } = await import(/* @vite-ignore */ './app/api/status/route') as { GET: (r: Request) => Promise<Response> };
    const res = await GET(new Request('http://localhost/api/status?url=https://evil.example'));
    expect(res.headers.get('cache-control')).toMatch(/no-store/);
    const json = await res.json() as { checkedAt: string; apps: Record<string, string> };
    expect(json.apps).toEqual({ academy: 'active', velocity: 'active', andiamo: 'degraded' });
    expect(Number.isNaN(Date.parse(json.checkedAt))).toBe(false);
    expect(seen.sort()).toEqual(['https://academy.andiamo.tech/api/ready', 'https://rides.andiamo.tech/api/ready', 'https://velocity.andiamo.tech/api/health']);
  });
  it('a probe that hangs or throws becomes unknown, and the others still answer', async () => {
    vi.stubGlobal('fetch', vi.fn(async (u: string) => {
      if (String(u).includes('velocity')) throw new Error('timeout');
      return new Response(JSON.stringify(String(u).includes('rides') ? { app: 'andiamo', state: 'ok' } : { service: 'academy', state: 'ok' }), { status: 200 });
    }));
    const { GET } = await import(/* @vite-ignore */ './app/api/status/route') as { GET: (r: Request) => Promise<Response> };
    expect(((await (await GET(new Request('http://localhost/api/status'))).json()) as { apps: unknown }).apps)
      .toEqual({ academy: 'active', velocity: 'unknown', andiamo: 'active' });
  });
});

// Seen on the :3019 preview at 4c176a3: the first read after a slow start timed out, and the route held "unknown" for
// all three apps for its full 60 seconds while every app was answering. A miss must not be held as long as an answer.
describe('(4) a miss is retried soon, an answer is held a minute', () => {
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.resetModules(); });
  it('after a timed-out probe, a read 15 seconds later probes again; a full answer is reused for 60 seconds', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-10-14T07:00:00Z'));
    let fail = true, calls = 0;
    vi.stubGlobal('fetch', vi.fn(async (u: string) => {
      calls++;
      if (fail) throw new Error('timeout');
      const body = String(u).includes('velocity') ? { status: 'ok', service: 'velocity' } : String(u).includes('rides') ? { app: 'andiamo', state: 'ok' } : { service: 'academy', state: 'ok' };
      return new Response(JSON.stringify(body), { status: 200 });
    }));
    const { GET } = await import(/* @vite-ignore */ './app/api/status/route') as { GET: (r: Request) => Promise<Response> };
    const read = async () => ((await (await GET(new Request('http://localhost/api/status'))).json()) as { apps: Record<string, string> }).apps;
    expect(Object.values(await read())).toEqual(['unknown', 'unknown', 'unknown']);
    fail = false;
    vi.setSystemTime(new Date('2026-10-14T07:00:15Z'));
    expect(Object.values(await read())).toEqual(['active', 'active', 'active']);
    expect(calls).toBe(6);
    vi.setSystemTime(new Date('2026-10-14T07:00:55Z'));
    await read();
    expect(calls).toBe(6);
  });
});

describe('(4) an Enter button and a one-line about per app', () => {
  it('each panel has "Enter <app>" to the app and the app summary from its page', () => {
    const html = home();
    for (const [k, name, href] of [['academy', 'Academy', 'https://academy.andiamo.tech'], ['velocity', 'Velocity', 'https://velocity.andiamo.tech'], ['andiamo', 'Rides', 'https://rides.andiamo.tech']]) {
      expect(html, k).toMatch(new RegExp(`<a[^>]*data-enter-app="${k}"[^>]*href="${href}"|<a[^>]*href="${href}"[^>]*data-enter-app="${k}"`));
      expect(html, k).toContain(`Enter ${name}`);
      expect(html, k).toContain(APP_PAGES.find((p) => p.key === k)!.summary);
    }
  });
  it('the Enter animation stops under reduced motion', () => {
    expect(css()).toMatch(/prefers-reduced-motion: reduce\)[^@]*\.enter/);
  });
});

describe('(5) the switcher carries current copy', () => {
  it("Academy's line is the locked motto; the stale Sparks line is gone", () => {
    expect(ecosystemApps.find((a) => a.key === 'academy')!.tagline).toBe('A world of learning. A story of their own.');
    expect(readFileSync('src/components/ecosystem/ecosystem-apps.ts', 'utf8')).not.toMatch(/Sparks to Stars/i);
  });
});

describe('(6) "A closer look" shows the real captures', () => {
  it('the home closer look uses the same captures as the app pages; no placeholder text remains', () => {
    const src = readFileSync('src/app/page.tsx', 'utf8');
    expect(src).not.toMatch(/NEEDS_EVIDENCE|placeholders are not screenshots|capture pending/i);
    expect(src).toContain('APP_PAGES');
    expect(src).toMatch(/screenshot\.src/);
  });
});
