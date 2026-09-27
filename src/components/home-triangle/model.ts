import { PRODUCTS } from '../../lib/products';

export type TriangleKey = 'academy' | 'velocity' | 'andiamo';

// Names, destinations and colors stay bound to the site's existing product registry.
// The short descriptors are candidate homepage copy, pending independent claim review.
const descriptions: Record<TriangleKey, string> = {
  academy: 'Learning and family planning tools.',
  velocity: 'News and signal intelligence.',
  andiamo: 'Community mobility, in closed beta.',
};

export const TRIANGLE_PRODUCTS = (['academy', 'velocity', 'andiamo'] as const).map(key => {
  const product = PRODUCTS.find(item => item.key === key);
  if (!product) throw new Error(`Missing homepage product: ${key}`);
  return { key, name: product.name, href: product.url, accent: product.accent, description: descriptions[key] };
});

export const PATHFINDER = (() => {
  const product = PRODUCTS.find(item => item.key === 'pathfinder');
  if (!product) throw new Error('Missing homepage product: pathfinder');
  return { name: product.name, href: product.url };
})();

export type CaptureStatus = 'NEEDS_EVIDENCE';
export type CaptureKey = TriangleKey | 'pathfinder';

// Do not promote legacy /brand/captures/* files to verified app screenshots.
// Each slot needs exact source/build, route, fixture/privacy and byte hash review.
export const CAPTURE_SLOTS: ReadonlyArray<{ key: CaptureKey; name: string; status: CaptureStatus }> = [
  ...TRIANGLE_PRODUCTS.map(({ key, name }) => ({ key, name, status: 'NEEDS_EVIDENCE' as const })),
  { key: 'pathfinder', name: PATHFINDER.name, status: 'NEEDS_EVIDENCE' },
];

export function touchAction(armed: TriangleKey | null, key: TriangleKey): 'reveal' | 'open' {
  return armed === key ? 'open' : 'reveal';
}

export function autoEnter(visited: boolean, reducedMotion: boolean): boolean {
  return visited || reducedMotion;
}

export function allowDepth(reducedMotion: boolean, hasWebGL: boolean): boolean {
  return !reducedMotion && hasWebGL;
}
