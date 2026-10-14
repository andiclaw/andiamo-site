import { APP_PAGES } from '../../lib/app-pages';
import { PRODUCTS } from '../../lib/products';

export type TriangleKey = 'academy' | 'velocity' | 'andiamo';

// Names, destinations and colors stay bound to the site's existing product registry. The one-line about is each app's
// summary on its own page (src/lib/app-pages.ts), which restates the app's live public page.
export const TRIANGLE_PRODUCTS = (['academy', 'velocity', 'andiamo'] as const).map(key => {
  const product = PRODUCTS.find(item => item.key === key);
  const page = APP_PAGES.find(item => item.key === key);
  if (!product || !page) throw new Error(`Missing homepage product: ${key}`);
  return { key, name: product.name, href: product.url, accent: product.accent, about: page.summary };
});

export const PATHFINDER = (() => {
  const product = PRODUCTS.find(item => item.key === 'pathfinder');
  if (!product) throw new Error('Missing homepage product: pathfinder');
  return { name: product.name, href: product.url };
})();

/** Click or tap on a tile: open it, close it if it is already open, or move to it from another tile. */
export function tileToggle(open: TriangleKey | null, key: TriangleKey): TriangleKey | null {
  return open === key ? null : key;
}

export function allowDepth(reducedMotion: boolean, hasWebGL: boolean): boolean {
  return !reducedMotion && hasWebGL;
}
