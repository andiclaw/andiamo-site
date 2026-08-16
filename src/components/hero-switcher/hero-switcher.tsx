'use client';

import Link from 'next/link';
import { useState } from 'react';
import { PRODUCTS, STATUS_LABEL, type Product } from '@/lib/products';
import { ProductCapture } from './product-capture';

/**
 * AND-SITE-HERO-SWITCHER-3D-001: the app switcher IS the hero.
 *
 * Brendan's six items:
 *  1. Lead with the product a visitor can use, not the holding company. The
 *     order puts app.andiamo.tech (Andiamo Rides) first as the large lead card.
 *  2. No rainbow gradient text. The heading is one colour; each product's own
 *     colour appears only where it means something (its card, its orb).
 *  3. The switcher sits at the very top of the page.
 *  4. 3D and floating in space: a perspective scene, cards lifted on the z-axis
 *     with soft shadows. On hover each card rises and GLOWS ITS OWN APP COLOUR
 *     as an orb behind the clickable title area.
 *  5. Depth, not debris: the background is static depth (layered radial
 *     glows), no drifting particles.
 *  6. Real captures of the real apps (see ProductCapture); WebP/AVIF with a
 *     JPEG fallback, re-taken whenever an app changes.
 *
 * Server-friendly: the cards, links and captions are all in the markup. The
 * only client behaviour is the hover lift, which is progressive.
 */

// Lead with the usable product. Andiamo Rides (app.andiamo.tech) first, then
// the rest in stage order.
const ORDER: Product['key'][] = ['andiamo', 'academy', 'velocity', 'pathfinder'];
const ORDERED = ORDER.map((k) => PRODUCTS.find((p) => p.key === k)!).filter(Boolean);
const LEAD = ORDERED[0];
const REST = ORDERED.slice(1);

export default function HeroSwitcher() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Static depth: layered radial glows, no moving parts (item 5). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-[-8%] h-[820px] w-[1200px] -translate-x-1/2 rounded-full opacity-60"
          style={{ background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.10) 0%, rgba(99,102,241,0.06) 38%, transparent 70%)' }}
        />
        <div
          className="absolute right-[-14%] top-[42%] h-[560px] w-[560px] rounded-full opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.10) 0%, transparent 70%)' }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-8 pt-14 sm:pt-20">
        {/* Heading: one colour, no rainbow (item 2). */}
        <div className="mb-10 max-w-2xl">
          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            Andiamo Tech
          </p>
          <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
            Pick a product. Start using it.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Four products, each live at its own home. Jump straight in, the real
            thing is one click away.
          </p>
        </div>

        {/* 3D scene: perspective + floating cards (item 4). */}
        <div style={{ perspective: '1600px' }}>
          <div className="grid gap-5 lg:grid-cols-2">
            <HeroCard product={LEAD} lead />
            <div className="grid gap-5 sm:grid-cols-1">
              {REST.map((p) => (
                <HeroCard key={p.key} product={p} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroCard({ product, lead = false }: { product: Product; lead?: boolean }) {
  const [hover, setHover] = useState(false);
  const accent = product.accent;

  return (
    <a
      href={product.url}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="focusable group relative block rounded-3xl border bg-[#080d17] transition-transform duration-300 will-change-transform"
      style={{
        borderColor: hover ? `${accent}66` : 'rgba(255,255,255,0.08)',
        transform: hover
          ? 'translateZ(40px) translateY(-6px) rotateX(2deg)'
          : 'translateZ(0) translateY(0) rotateX(0deg)',
        transformStyle: 'preserve-3d',
        boxShadow: hover
          ? `0 40px 90px -40px ${accent}88, 0 12px 30px -18px rgba(0,0,0,0.8)`
          : '0 24px 60px -40px rgba(0,0,0,0.9)',
      }}
    >
      {/* Orb: glows the product's own colour behind the title on hover (item 4). */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-8 top-8 z-0 h-40 w-40 rounded-full blur-3xl transition-opacity duration-300"
        style={{ background: accent, opacity: hover ? 0.28 : 0 }}
      />

      <div className="relative z-10 p-6 sm:p-7">
        <div className="mb-4 flex items-center gap-3">
          {product.brandMark ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={product.brandMark} alt="" aria-hidden width={26} height={26} className="h-6.5 w-6.5 rounded-lg" style={{ width: 26, height: 26 }} />
          ) : (
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
          )}
          <span className="text-sm font-bold text-white">{product.name}</span>
          <span
            className="inline-flex items-center gap-1.5 rounded-pill px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: accent, background: `${accent}14`, border: `1px solid ${accent}33` }}
          >
            {STATUS_LABEL[product.status]}
          </span>
          <span className="ml-auto text-xs font-medium text-slate-400 transition-colors group-hover:text-white">
            {product.url.replace('https://', '')} →
          </span>
        </div>

        <p className={`mb-5 font-bold leading-tight text-white ${lead ? 'text-xl sm:text-2xl' : 'text-lg'}`}>
          {product.tagline}
        </p>

        {/* Real capture of the real app (item 6). */}
        <div
          className="overflow-hidden rounded-xl border"
          style={{ borderColor: `${accent}2b` }}
        >
          <ProductCapture product={product} />
        </div>

        {product.captureCaption && (
          <p className="mt-2.5 text-[11px] text-slate-500">{product.captureCaption}</p>
        )}
      </div>
    </a>
  );
}
