/**
 * SITE-HOME-FEEDBACK-1008-001 Part A (Brendan 2026-10-08 16:2x on the :3019 preview, bus #9495):
 *   1. no Enter screen; 2. each tile expands its OWN box on hover or tap (no shared box), reduced motion respected;
 *   3. a smaller hero line; 4. no "Three connected products. Choose one to learn more."; 5. the Pathfinder link is not
 *   dead (it pointed at github.com/andiclaw/pathfinder, 404 on 2026-10-08); 7. the app switcher at TOP LEFT, mirroring
 *   the apps. Item 6 (a page per app) is Part B.
 * Written to FAIL on 169ef24.
 */
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { HomeExperience } from './components/home-triangle/home-experience';
import { PATHFINDER, TRIANGLE_PRODUCTS, tileToggle } from './components/home-triangle/model';

const html = () => renderToStaticMarkup(createElement(HomeExperience, null, createElement('p', null, 'After hero')));
const css = () => readFileSync('src/components/home-triangle/home-triangle.module.css', 'utf8');

describe('1 + 4: straight onto the app picker', () => {
  it('no Enter gate, no Skip intro, no locked content; the subtitle is gone', () => {
    const h = html();
    for (const gone of ['data-entry-gate', 'Skip intro', '>Enter', 'data-locked="true"', 'Three connected products', 'Choose one to learn more']) expect(h, gone).not.toContain(gone);
    expect(h).toContain('id="home-heading"');
    expect(readFileSync('src/app/globals.css', 'utf8')).not.toContain('data-home-entry');
  });
});

describe('2: each tile expands its own box', () => {
  it('every tile owns a panel (its description and a link to its site); there is no shared detail box', () => {
    const h = html();
    expect(h).not.toContain('triangle-detail');
    for (const p of TRIANGLE_PRODUCTS) {
      const li = h.slice(h.indexOf(`data-node-key="${p.key}"`), h.indexOf('</li>', h.indexOf(`data-node-key="${p.key}"`)));
      expect(li, p.key).toContain(`aria-controls="tile-panel-${p.key}"`);
      expect(li, p.key).toContain(`id="tile-panel-${p.key}"`);
      expect(li, p.key).toContain(p.description);
      expect(li, p.key).toContain(`href="${p.href}"`);
    }
  });
  it('tap or click toggles one tile; another tile takes over', () => {
    expect(tileToggle(null, 'academy')).toBe('academy');
    expect(tileToggle('academy', 'academy')).toBe(null);
    expect(tileToggle('academy', 'velocity')).toBe('velocity');
  });
  it('hover expands only on hover-capable pointers; reduced motion turns the animation off', () => {
    const c = css();
    expect(c).toMatch(/@media \(hover: hover\)[^{]*\{[^@]*\.nodeWrap:hover/);
    expect(c).toMatch(/@media \(prefers-reduced-motion: reduce\)[^}]*\.tilePanel[^}]*transition:\s*none/);
  });
});

describe('3: a smaller hero line', () => {
  it('the h1 tops out at 3rem (was clamp(2.5rem, 5vw, 4.8rem))', () => {
    const m = css().match(/\.heroHeading h1 \{[^}]*font-size:\s*clamp\(([\d.]+)rem,\s*[\d.]+vw,\s*([\d.]+)rem\)/);
    expect(m).not.toBe(null);
    expect(Number(m![2])).toBeLessThanOrEqual(3);
    expect(Number(m![1])).toBeLessThanOrEqual(2);
  });
});

describe('5: Pathfinder is not a dead link', () => {
  // Part B (#9530) gave Pathfinder its own page, so the link now goes there (src/site-app-pages-1008.test.ts).
  it('points at a page on this site, which exists', () => {
    expect(PATHFINDER.href).toBe('/products/pathfinder');
    expect(readFileSync('src/components/product-showcase.tsx', 'utf8')).toMatch(/id=\{p\.key\}/);
    expect(html()).toContain('href="/products/pathfinder"');
  });
});

describe('7: the app switcher sits top left, like the apps', () => {
  it('the switcher comes before the wordmark in the header, and its menu opens to the right', () => {
    const header = readFileSync('src/components/header.tsx', 'utf8');
    expect(header.indexOf('<AppSwitcherDark')).toBeGreaterThan(-1);
    expect(header.indexOf('<AppSwitcherDark')).toBeLessThan(header.indexOf('/brand/wordmark.svg'));
    const sw = readFileSync('src/components/ecosystem/app-switcher-dark.tsx', 'utf8');
    expect(sw).toMatch(/position: 'absolute',\s*left: 0,/);
    expect(sw).not.toMatch(/position: 'absolute',\s*right: 0,/);
  });
});
