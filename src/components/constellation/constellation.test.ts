import { afterEach, describe, expect, it, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Constellation from './constellation';
import { nearestNode, afterHeroPaint } from './interaction';
import { PRODUCTS } from '../../lib/products';

const source = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8');

describe('home constellation placement', () => {
  it('archives the old two home hero placements', () => {
    const home = source('../../app/page.tsx');
    expect(home).not.toContain('<HeroSwitcher');
    expect(home).not.toContain('<JourneyHero');
    expect(home.indexOf('<Constellation')).toBeLessThan(home.indexOf('<SpectrumBar'));
  });
  it('renders an immediate semantic hero and product details', () => {
    const hero = source('./constellation.tsx');
    expect(hero).toContain('<h1');
    expect(hero).toContain('Andiamo Tech');
    expect(hero).toContain('product.valueProp');
    expect(hero).toContain('product.audience');
    expect(hero).toContain('aria-expanded');
  });
  it('keeps the required Rides tagline in canonical data', () => {
    expect(source('../../lib/products.ts')).toContain("tagline: 'Community mobility - for anyone, anywhere.'");
  });
});

describe('semantic and source truth', () => {
  const markup = renderToStaticMarkup(createElement(Constellation));
  it('server renders each product, lifecycle, description, audience and canonical URL without WebGL', () => {
    for (const p of PRODUCTS) {
      expect(markup).toContain(`data-product="${p.key}"`);
      expect(markup).toContain(p.url);
      expect(markup).toContain(p.valueProp);
      expect(markup).toContain(p.audience);
    }
    expect(markup).toContain('<noscript>');
    expect(markup).not.toContain('<canvas');
    expect(markup.match(/<h1/g)).toHaveLength(1);
    expect(markup.match(/<h2/g)).toHaveLength(4);
  });
  it('does not reintroduce unsupported switcher promises or copy violations', () => {
    expect(markup).not.toMatch(/\u2014|\b(first|only)\b|each live at its own home|testimonials/i);
    expect(markup).toContain('Closed beta');
    expect(markup).toContain('Desktop app');
  });
  it('relocates the journey to a distinct Rides route', () => {
    expect(source('../../app/products/rides/page.tsx')).toContain('<JourneyHero');
    expect(source('../hero/journey-hero.tsx')).toContain('Community mobility - for anyone, anywhere.');
  });
  it('Three.js is dynamically loaded and has no provider/data loader', () => {
    expect(source('./constellation.tsx')).toContain("import('./scene')");
    const scene = source('./scene.ts');
    expect(scene).toContain("from 'three'");
    expect(scene).not.toMatch(/fetch\(|TextureLoader|FileLoader|https?:\/\//);
    expect(scene).toContain("webglcontextlost");
    expect(scene).toContain('renderer.dispose()');
    expect(scene).toContain('if (!input.reduced) elapsed += dt');
  });
});

describe('proximity has measurable polarity', () => {
  const nodes = [{ x: 100, y: 100 }, { x: 400, y: 100 }];
  it('approach outside a node can select it', () => expect(nearestNode(200, 100, nodes, 180)).toBe(0));
  it('closer candidate wins', () => expect(nearestNode(340, 120, nodes, 180)).toBe(1));
  it('outside the radius does not change selection', () => expect(nearestNode(700, 500, nodes, 180)).toBeNull());
  it('ties preserve canonical order', () => expect(nearestNode(250, 100, nodes, 180)).toBe(0));
  it('empty inventory does not invent a node', () => expect(nearestNode(0, 0, [], 180)).toBeNull());
});

describe('post-paint mounting custody', () => {
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
  function fixture(supported = true) {
    vi.useFakeTimers();
    let callback: (list: { getEntries(): object[] }) => void = () => {};
    const disconnect = vi.fn();
    vi.stubGlobal('PerformanceObserver', class {
      static supportedEntryTypes = supported ? ['largest-contentful-paint'] : [];
      constructor(cb: typeof callback) { callback = cb; }
      observe = vi.fn(); disconnect = disconnect;
    });
    vi.stubGlobal('requestAnimationFrame', (cb: () => void) => setTimeout(cb, 16));
    vi.stubGlobal('cancelAnimationFrame', clearTimeout);
    return { paint: () => callback({ getEntries: () => [{}] }), disconnect };
  }
  it('does not mount before observed LCP and the quiet paint interval', () => {
    const f = fixture(); const start = vi.fn(); afterHeroPaint(start);
    vi.advanceTimersByTime(5000); expect(start).not.toHaveBeenCalled();
    f.paint(); vi.advanceTimersByTime(815); expect(start).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1); expect(start).toHaveBeenCalledTimes(1);
  });
  it('a later candidate resets the interval', () => {
    const f = fixture(); const start = vi.fn(); afterHeroPaint(start);
    f.paint(); vi.advanceTimersByTime(700); f.paint(); vi.advanceTimersByTime(700);
    expect(start).not.toHaveBeenCalled(); vi.advanceTimersByTime(116); expect(start).toHaveBeenCalledTimes(1);
  });
  it('unmount cancels outstanding work', () => {
    const f = fixture(); const start = vi.fn(); const cancel = afterHeroPaint(start);
    f.paint(); cancel(); vi.runAllTimers(); expect(start).not.toHaveBeenCalled();
  });
  it('unsupported observers keep HTML rather than guessing a mount time', () => {
    fixture(false); const start = vi.fn(); afterHeroPaint(start); vi.runAllTimers(); expect(start).not.toHaveBeenCalled();
  });
});
