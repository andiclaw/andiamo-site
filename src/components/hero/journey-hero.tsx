import Link from 'next/link';
import JourneyScene from './journey-scene';
import JourneyDepth from './journey-depth';
import { PATENT, BRAND } from '@/lib/company';
import { PRODUCTS } from '@/lib/products';

/**
 * The apex hero (AND-SITE-HERO-JOURNEY-BETA-001).
 *
 * The journey runs corner to corner BEHIND the message; the tagline, the primary
 * "Apply for Beta Access" button and the patent link sit centred over it.
 *
 * BINDING, and structural rather than promised: every word here is server-rendered
 * HTML. The tagline, the button and the patent link exist in the markup for
 * crawlers and for anyone whose canvas never starts. The SVG journey renders with
 * no JavaScript at all, and the three.js layer only adds motion along the same
 * route and draws no text.
 *
 * The beta button wires to the beta path, `rides.andiamo.tech` (AND-REBRAND-GO-TO-RIDES-001;
 * `app.andiamo.tech` 301s there), which is
 * the closed-beta landing with the real waitlist form, its one-line privacy
 * notice and its unchecked consent box. No new collector was invented here, and
 * this site does not gather addresses of its own.
 */

const BETA_URL = 'https://rides.andiamo.tech';

/**
 * CONSTRAINT COLLISION, resolved deliberately and flagged rather than dropped.
 * AND-TECH-ROOT-CONSTELLATION-001 requires the Academy CTA above the fold "at
 * EQUAL weight". This card requires a single LARGE PRIMARY "Apply for Beta
 * Access" centred over the journey. Both cannot be literally true at once.
 * Academy is kept above the fold and plainly visible, but subordinate to the
 * beta primary, because this card is the later instruction and names its primary
 * explicitly. Raised for the lead rather than silently resolved.
 */
// Sourced from the product record, not hardcoded, so it cannot drift.
const ACADEMY_URL = PRODUCTS.find((p) => p.key === 'academy')!.url;

export default function JourneyHero() {
  return (
    <section className="relative isolate min-h-[78vh] overflow-hidden">
      <JourneyScene />
      <JourneyDepth />

      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-300">
          {BRAND.eyebrow}
        </p>

        <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
          One trip. Every mode.{' '}
          <span className="text-emerald-300">All the way home.</span>
        </h1>

        <p className="mt-6 max-w-xl text-balance text-base leading-relaxed text-slate-300 sm:text-lg">
          Buses, cars, and the aircraft that are coming, chained into a single
          journey that ends at your door.
        </p>

        <a
          href={BETA_URL}
          className="focusable mt-10 inline-flex items-center justify-center rounded-pill px-10 py-5 text-lg font-bold btn-primary"
        >
          Apply for Beta Access
        </a>

        <p className="mt-5 text-sm text-slate-300">
          Already know what you need?{' '}
          <a href={ACADEMY_URL} className="focusable font-semibold text-emerald-300 underline underline-offset-4 hover:text-emerald-200">
            Start with Academy
          </a>
        </p>

        <p className="mt-6 text-xs text-slate-400">
          <Link
            href="/patent"
            className="underline decoration-slate-600 underline-offset-4 transition-colors hover:text-emerald-300"
          >
            {PATENT.number}
          </Link>
        </p>
      </div>
    </section>
  );
}
