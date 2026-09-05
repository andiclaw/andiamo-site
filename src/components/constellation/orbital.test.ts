import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Constellation from './constellation';
import { COMPANY } from '../../lib/company';
import { HOME_PRODUCTS } from './home-products';

const read = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');
describe('owner-directed orbital home', () => {
  it('uses the exact motto without the superseded introduction', () => {
    const html = renderToStaticMarkup(createElement(Constellation));
    expect(html).toContain(COMPANY.motto);
    expect(html).not.toContain('Technology for people');
  });
  it('renders four disclosure buttons and honestly labelled interface previews', () => {
    const html = renderToStaticMarkup(createElement(Constellation));
    expect(html.match(/<button /g)).toHaveLength(4);
    expect(html.match(/data-interface-preview/g)).toHaveLength(4);
    expect(html.match(/Interface illustration/g)).toHaveLength(4);
    expect(html).not.toContain('/brand/captures/');
  });
  it('uses real spherical geometry instead of the prior tiny octahedrons', () => {
    expect(read('./scene.ts')).toContain('SphereGeometry');
    expect(read('./scene.ts')).not.toContain('OctahedronGeometry');
  });
  it('makes visual purpose the next section without duplicate product showcases', () => {
    const home = read('../../app/page.tsx');
    expect(home).toContain('Why we built each tool');
    expect(home).not.toMatch(/ProductShowcase|missionTitle|impactScales|Every product is free to try/);
  });
  it('binds all four authored previews to frozen source identities and owned assets', () => {
    expect(HOME_PRODUCTS).toHaveLength(4);
    for (const product of HOME_PRODUCTS) {
      expect(product.preview.kind).toBe('authored-illustration');
      expect(product.preview.sourceCommit).toMatch(/^[a-f0-9]{40}$/);
      expect(product.preview.sourcePaths.length).toBeGreaterThan(0);
      for (const path of [product.preview.asset, product.art]) {
        const svg = read(`../../../public${path}`);
        expect(svg).toContain('<svg');
        expect(svg).not.toMatch(/<script|<foreignObject|href=|https?:\/\/(?!www.w3.org)/);
      }
    }
  });
  it('omits stale marketing claims and fictional account metrics from the new home', () => {
    const html = renderToStaticMarkup(createElement(Constellation));
    expect(html).not.toMatch(/compliant in every state|43 sources|every 15 minutes|ATS token|real-time|free to try/i);
    for (const p of HOME_PRODUCTS) {
      const svg = read(`../../../public${p.preview.asset}`);
      expect(svg).not.toMatch(/MARIA|GPT|BTC|rating|fare|\$\d|\d%|compliant/i);
    }
  });
  it('keeps Rides canonical identity visible even when another disclosure is selected', () => {
    const html = renderToStaticMarkup(createElement(Constellation));
    const rides = html.slice(html.indexOf('data-product="andiamo"'), html.indexOf('data-product="pathfinder"'));
    expect(rides.slice(0, rides.indexOf('</button>'))).toContain('Community mobility');
    expect(rides).toContain('Community mobility - for anyone, anywhere.');
    expect(rides).toContain('Closed beta');
  });
  it('gives each product a distinct purpose and a distinct authored visual', () => {
    expect(new Set(HOME_PRODUCTS.map(p => p.heading)).size).toBe(4);
    expect(new Set(HOME_PRODUCTS.map(p => read(`../../../public${p.art}`))).size).toBe(4);
  });
  it('keeps disclosure separate from explicit navigation', () => {
    const html = renderToStaticMarkup(createElement(Constellation));
    for (const match of html.matchAll(/<button [\s\S]*?<\/button>/g)) expect(match[0]).not.toContain('href=');
    for (const p of HOME_PRODUCTS) expect(html).toContain(`href="${p.url}"`);
  });
  it('uses readable small-text accents independently of the orb brand colors', () => {
    const luminance = (hex: string) => {
      const [r, g, b] = hex.match(/[a-f0-9]{2}/gi)!.map(c => {
        const s = parseInt(c, 16) / 255;
        return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4;
      });
      return .2126 * r + .7152 * g + .0722 * b;
    };
    const contrast = (hex: string) => (luminance(hex) + .05) / (luminance('#0a0f1a') + .05);
    expect(contrast('#6330ff')).toBeLessThan(4.5);
    for (const p of HOME_PRODUCTS) expect(contrast(p.textAccent)).toBeGreaterThanOrEqual(4.5);
    expect(read('../../app/page.tsx')).toContain("'--accent': product.textAccent");
  });
});
