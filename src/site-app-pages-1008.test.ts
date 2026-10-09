/**
 * SITE-HOME-FEEDBACK-1008-001 Part B (Brendan 16:5x "go for now", DECISIONS 2026-10-08 16:5x; lead #9530): a dedicated
 * page per app with REAL screenshots, features and benefits, in the app's own palette. Every sentence must be true of the
 * shipped product, so every feature line carries its source (R2 reads them). Pathfinder covers only release 1.3.7, which
 * is a source candidate, unsigned and unpublished (Explorer docs/release-notes-v1.3.7.md at e45b191): its page says so
 * and shows no screenshot until a real capture of a built app exists (the share holds none).
 * Written to FAIL on dbf3761.
 */
import { existsSync, readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { PRODUCTS } from './lib/products';
import { HomeExperience } from './components/home-triangle/home-experience';
import { PATHFINDER } from './components/home-triangle/model';

type Page = {
  key: string; summary: string; status: string;
  screenshot: { src: string; alt: string; source: string } | null;
  features: Array<{ text: string; source: string }>;
};
const pages = () => import(/* @vite-ignore */ './lib/app-pages') as unknown as Promise<{ APP_PAGES: Page[] }>;
const KEYS = ['academy', 'velocity', 'andiamo', 'pathfinder'];

describe('one page per app', () => {
  it('four pages, one route that renders each, statically generated', async () => {
    const { APP_PAGES } = await pages();
    expect(APP_PAGES.map((p) => p.key)).toEqual(KEYS);
    const route = readFileSync('src/app/products/[app]/page.tsx', 'utf8');
    expect(route).toContain('generateStaticParams');
    expect(route).toContain('APP_PAGES');
  });
  it('each page takes its colour from the app token in the product registry (no colour of its own)', () => {
    const route = readFileSync('src/app/products/[app]/page.tsx', 'utf8');
    expect(route).toMatch(/product\.accent/);
    expect(route).not.toMatch(/#[0-9a-fA-F]{6}/);
  });
});

describe('every claim has a source; no em dash', () => {
  it('each feature line names where it is true; the summary and status too', async () => {
    for (const p of (await pages()).APP_PAGES) {
      expect(p.features.length, p.key).toBeGreaterThan(0);
      for (const f of p.features) {
        expect(f.source.length, `${p.key}: ${f.text}`).toBeGreaterThan(10);
        expect(f.text).not.toMatch(/—/);
      }
      expect(p.summary).not.toMatch(/—/);
    }
  });
  it('Pathfinder says it is not yet released, and claims nothing beyond the 1.3.7 notes', async () => {
    const pf = (await pages()).APP_PAGES.find((p) => p.key === 'pathfinder')!;
    expect(pf.status).toMatch(/not yet (released|published)/i);
    for (const f of pf.features) expect(f.source).toContain('release-notes-v1.3.7.md');
    expect(pf.screenshot).toBe(null);
  });
});

describe('real screenshots only', () => {
  it('Academy, Velocity and Rides show a capture of their live public page; the file exists and is a PNG', async () => {
    for (const p of (await pages()).APP_PAGES.filter((x) => x.key !== 'pathfinder')) {
      expect(p.screenshot, p.key).not.toBe(null);
      const file = `public${p.screenshot!.src}`;
      expect(existsSync(file), file).toBe(true);
      expect(readFileSync(file).subarray(1, 4).toString(), file).toBe('PNG');
      expect(p.screenshot!.source).toMatch(/^https:\/\/(academy|velocity|rides)\.andiamo\.tech\/, captured 2026-10-08/);
      expect(p.screenshot!.alt.length).toBeGreaterThan(10);
    }
  });
});

describe('the home links into the pages', () => {
  it('each tile panel links to its page; the Pathfinder pill and the registry point at /products/pathfinder', () => {
    const html = renderToStaticMarkup(createElement(HomeExperience, null, null));
    for (const k of ['academy', 'velocity', 'andiamo']) expect(html, k).toContain(`href="/products/${k}"`);
    expect(PATHFINDER.href).toBe('/products/pathfinder');
    expect(PRODUCTS.find((p) => p.key === 'pathfinder')!.url).toBe('/products/pathfinder');
  });
});
