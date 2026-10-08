/**
 * SITE-HOME-FEEDBACK-1008-001, colour addition (Brendan 2026-10-08 16:3x, bus #9503): "is purple the right color? Each
 * app's color scheme should match". No purple anywhere; the site chrome takes the Andiamo wordmark green on a neutral
 * ground; each app tile uses THAT app's own theme token, read from the app's repo (2026-10-08):
 *
 *   site chrome  #33A532  andiamo-site public/brand/wordmark.svg (the leaf "a" fill)
 *   Academy      #3B82D6  academy origin/dev src/app/globals.css --aca-primary-light (Schoolhouse Blue ramp; --aca-primary
 *                         #1E5FA8 is too dark for text on these dark tiles). DECISIONS 2026-07-01, Brendan: "Academy LAUNCH
 *                         color = SCHOOLHOUSE BLUE" (reverses purple). The repo's docs/design-tokens.md still says teal:
 *                         the code and the decision are newer.
 *   Velocity     #00D4FF  Velocity origin/dev src/app/globals.css --vel-accent-500
 *   Rides        #12C04C  Andiamo origin/dev src/app/globals.css --primary (no lime token exists in the Rides code)
 *   Pathfinder   #0EA5E9  Explorer 5614df6 src/index.css --pf-accent-500
 *   Academy mark          academy origin/dev public/brand/andaro/concepts/sleek-blue-no-eyes(-tile).svg, the files the
 *                         Academy app itself uses (replacing the purple concept marks)
 * Written to FAIL on 8285f1e.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { PRODUCTS } from './lib/products';
import { SPECTRUM } from './lib/company';
import { ecosystemApps } from './components/ecosystem/ecosystem-apps';

const TOKENS = { velocity: '#00D4FF', academy: '#3B82D6', andiamo: '#12C04C', pathfinder: '#0EA5E9' } as const;
const SITE_GREEN = '#33A532';
const up = (s: string) => s.toUpperCase();

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : [p];
  });

describe('each app keeps its own colour, from its own repo', () => {
  it('the product registry accents are the app tokens', () => {
    for (const [key, hex] of Object.entries(TOKENS)) expect(up(PRODUCTS.find((p) => p.key === key)!.accent), key).toBe(hex);
  });
  it('the switcher uses the same tokens', () => {
    for (const key of ['academy', 'velocity', 'andiamo'] as const) expect(up(ecosystemApps.find((a) => a.key === key)!.accentColor), key).toBe(TOKENS[key]);
  });
  it('the CSS variables and the four-app spectrum match', () => {
    const g = readFileSync('src/app/globals.css', 'utf8');
    for (const [key, hex] of Object.entries(TOKENS)) expect(up(g.match(new RegExp(`--c-${key}:\\s*(#[0-9a-fA-F]{6})`))![1]), key).toBe(hex);
    expect(SPECTRUM.map(up)).toEqual([TOKENS.velocity, TOKENS.academy, TOKENS.andiamo, TOKENS.pathfinder]);
  });
});

describe('no purple anywhere', () => {
  it('no purple or violet hex, class or asset name in the site source', () => {
    const banned = /6330ff|8b5cf6|a78bfa|a855f7|7c3aed|c084fc|6d28d9|9333ea|violet-|purple/i;
    const hits = files('src').filter((f) => !/\.test\.tsx?$/.test(f) && /\.(tsx?|css)$/.test(f)).filter((f) => banned.test(readFileSync(f, 'utf8')));
    expect(hits).toEqual([]);
  });
  it('Academy shows the blue Andaro mark the Academy app uses', () => {
    for (const f of ['sleek-blue-no-eyes.svg', 'sleek-blue-no-eyes-tile.svg']) expect(existsSync(`public/brand/andaro/concepts/${f}`), f).toBe(true);
    expect(PRODUCTS.find((p) => p.key === 'academy')!.brandMark).toBe('/brand/andaro/concepts/sleek-blue-no-eyes.svg');
    expect(readFileSync('src/components/ecosystem/app-switcher-dark.tsx', 'utf8')).toContain("'/brand/andaro/concepts/sleek-blue-no-eyes-tile.svg'");
  });
});

describe('the site chrome takes the wordmark green', () => {
  it('a --c-site variable carries the wordmark fill, and the home links and Pathfinder pill use it', () => {
    expect(readFileSync('public/brand/wordmark.svg', 'utf8')).toContain(`fill="${SITE_GREEN}"`);
    expect(up(readFileSync('src/app/globals.css', 'utf8').match(/--c-site:\s*(#[0-9a-fA-F]{6})/)![1])).toBe(SITE_GREEN);
    const css = readFileSync('src/components/home-triangle/home-triangle.module.css', 'utf8');
    expect(css).toMatch(/\.tilePanelInner a \{[^}]*color:\s*var\(--c-site\)/);
    expect(css).toMatch(/\.pathfinder \{[^}]*border: 1px solid var\(--c-site\)/);
  });
});
