import Link from 'next/link';
import JourneyScene from './journey-scene';
import JourneyDepth from './journey-depth';
import { PATENT, BRAND } from '@/lib/company';
import { PRODUCTS } from '@/lib/products';

/**
 * The Rides product journey, relocated from the company home.
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
 * The beta button retains the source-defined product URL. Host provisioning and
 * deployment verification are separate gates; this page collects no addresses.
 */

const BETA_URL = PRODUCTS.find((p) => p.key === 'andiamo')!.url;

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

        <h1 className="text-4xl font-black text-white sm:text-6xl">Rides</h1>
        <p className="mt-3 mb-8 text-lg text-emerald-300">Community mobility - for anyone, anywhere.</p>
        <h2 className="text-balance text-3xl font-black leading-[1.05] text-white sm:text-5xl">
          One trip. Every mode.{' '}
          <span className="text-emerald-300">All the way home.</span>
        </h2>

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
