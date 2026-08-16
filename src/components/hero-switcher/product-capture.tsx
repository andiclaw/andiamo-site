import { PRODUCT_MOCKUP } from '@/lib/product-mockups';
import type { Product } from '@/lib/products';

/**
 * The real visual for a product card.
 *
 * If the product has a `capture` (a real screenshot of the live public
 * surface, AND-SITE-HERO-SWITCHER-3D-001 item 6), serve it as a
 * <picture> with AVIF -> WebP -> JPEG so modern formats win and older
 * clients still get a real image. These are real pixels of the real app,
 * re-taken whenever the app changes.
 *
 * A product with no reachable public surface (Pathfinder: the repo is not
 * public) falls back to its code-accurate SVG mockup rather than a faked
 * screenshot.
 */
export function ProductCapture({ product }: { product: Product }) {
  if (product.capture) {
    const base = `/brand/captures/${product.capture}`;
    return (
      <picture>
        <source srcSet={`${base}.avif`} type="image/avif" />
        <source srcSet={`${base}.webp`} type="image/webp" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${base}.jpg`}
          alt={product.captureCaption ?? `${product.name}, live`}
          width={1200}
          loading="lazy"
          decoding="async"
          className="block w-full h-auto"
        />
      </picture>
    );
  }

  const Mockup = PRODUCT_MOCKUP[product.key];
  return Mockup ? <Mockup /> : null;
}
