import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HomeExperience } from './home-experience';
import { CAPTURE_SLOTS, PATHFINDER, TRIANGLE_PRODUCTS, allowDepth } from './model';

const page = () => readFileSync('src/app/page.tsx', 'utf8');

describe('SITE-HOME-TRIANGLE-REDESIGN-001 homepage contract', () => {
  it('has one entry-led triangle instead of the old stacked hero flows', () => {
    expect(page()).toContain('<HomeExperience');
    expect(page()).not.toContain('<HeroSwitcher');
    expect(page()).not.toContain('<JourneyHero');
  });

  // SITE-HOME-FEEDBACK-1008-001 (Brendan 10-08): no Enter gate and no shared detail box; each tile owns its panel
  // (src/site-feedback-1008.test.ts pins the new behaviour).
  it('server-renders the three named corners, the lower Pathfinder link, and no entry gate', () => {
    const html = renderToStaticMarkup(createElement(HomeExperience, null, createElement('p', null, 'After hero')));
    expect(html).not.toContain('data-entry-gate');
    expect(html).toContain('data-home-content');
    expect((html.match(/data-node-key=/g) ?? [])).toHaveLength(3);
    for (const product of TRIANGLE_PRODUCTS) {
      expect(html).toContain(`data-node-key="${product.key}"`);
      expect(html).toContain(`aria-controls="tile-panel-${product.key}"`);
      expect(html).toContain(product.name);
    }
    expect(html.indexOf(PATHFINDER.href)).toBeGreaterThan(html.indexOf('data-node-key="andiamo"'));
    expect(readFileSync('src/components/home-triangle/home-experience.tsx', 'utf8')).toContain("event.key === 'Escape'");
  });

  it('keeps the exact connected three separate from Pathfinder and preserves canonical destinations', () => {
    expect(TRIANGLE_PRODUCTS.map(product => product.key)).toEqual(['academy', 'velocity', 'andiamo']);
    expect(new Set(TRIANGLE_PRODUCTS.map(product => product.href)).size).toBe(3);
    expect(TRIANGLE_PRODUCTS.every(product => product.href.startsWith('https://'))).toBe(true);
    expect(PATHFINDER.href).not.toBe(TRIANGLE_PRODUCTS[0].href);
  });

  it('gates depth on WebGL and reduced motion', () => {
    expect(allowDepth(false, true)).toBe(true);
    expect(allowDepth(false, false)).toBe(false);
    expect(allowDepth(true, true)).toBe(false);
  });

  it('does not promote unverified legacy art or image files to real UI captures', () => {
    expect(CAPTURE_SLOTS).toHaveLength(4);
    expect(CAPTURE_SLOTS.every(slot => slot.status === 'NEEDS_EVIDENCE')).toBe(true);
    expect(page()).not.toContain('/brand/captures/');
    expect(page()).not.toContain('<ProductCapture');
    expect(page()).toContain('These placeholders are not screenshots.');
  });

  it('takes PBC and mission text from the named company and brand sources', () => {
    expect(page()).toContain('{BRAND.pbcTitle}');
    expect(page()).toContain('{BRAND.pbcBody}');
    expect(page()).toContain('{BRAND.missionTitle}');
    expect(page()).toContain('{BRAND.missionLead}');
  });

  it('does not carry the old blanket live, price or screenshot assertions into the new Home', () => {
    const source = page() + readFileSync('src/components/home-triangle/home-experience.tsx', 'utf8');
    for (const unsupported of ['Every product is free to try', 'Four products, each live', 'real app captures', 'The live Rides beta']) {
      expect(source).not.toContain(unsupported);
    }
  });

  it('keeps a reduced-motion route', () => {
    expect(readFileSync('src/components/home-triangle/home-triangle.module.css', 'utf8')).toMatch(/prefers-reduced-motion:\s*reduce/);
  });

  it('holds each image slot and keeps the inventoried legacy bytes unapproved', () => {
    const manifest = readFileSync('docs/SITE-HOME-TRIANGLE-REDESIGN-001-capture-custody.md', 'utf8');
    for (const slot of CAPTURE_SLOTS) {
      expect(manifest).toContain(`| ${slot.name} | NEEDS_EVIDENCE |`);
    }
    for (const file of ['academy.jpg', 'velocity.jpg', 'andiamo.jpg']) {
      const bytes = readFileSync(`public/brand/captures/${file}`);
      const sha = createHash('sha256').update(bytes).digest('hex');
      expect(manifest).toContain(`| \`public/brand/captures/${file}\` | \`${sha}\` |`);
    }
    expect(manifest).toContain('are **not** used by this Home');
  });
});
