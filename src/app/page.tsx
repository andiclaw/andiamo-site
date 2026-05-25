import Link from 'next/link';
import { ProductCard } from '@/components/product-card';
import { PRODUCTS } from '@/lib/products';
import { COMPANY, PATENT } from '@/lib/company';

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[1100px] h-[1100px] rounded-full opacity-40"
          style={{
            background:
              'radial-gradient(circle, rgba(56,189,248,0.16) 0%, rgba(34,211,238,0.05) 35%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-[40%] right-[-15%] w-[700px] h-[700px] rounded-full opacity-25"
          style={{
            background:
              'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Rideshare-app deflection — most existing andiamo.tech traffic is
          looking for the Andiamo rideshare/mobility app at app.andiamo.tech.
          Keep this above the fold so they bounce there in one click. */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <a
          href="https://app.andiamo.tech"
          className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 rounded-pill bg-emerald-500/[0.06] border border-emerald-500/20 text-xs sm:text-sm text-emerald-200 hover:bg-emerald-500/[0.10] hover:border-emerald-500/40 transition-all text-center"
        >
          <span className="opacity-80">Looking for the Andiamo rideshare app?</span>
          <span className="font-semibold text-emerald-300">app.andiamo.tech →</span>
        </a>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-12 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-white/[0.04] border hairline mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Delaware Public Benefit Corporation</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-3xl mx-auto leading-[1.05]">
          Tools that respect <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">the people</span> who use them.
        </h1>
        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mt-6 leading-relaxed">
          {COMPANY.shortName} is a small team in {COMPANY.location} building four products: a real-time intel feed, a homeschool platform, a patent-protected mobility network, and an open-source file manager for the Mac.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <Link
            href="/products"
            className="px-7 py-3 rounded-pill text-sm font-semibold grad-cyan-blue text-white shadow-lg shadow-cyan-500/30 transition-all hover:scale-[1.02]"
          >
            See the products →
          </Link>
          <Link
            href="/about"
            className="px-7 py-3 rounded-pill text-sm font-semibold border hairline text-slate-200 hover:text-white hover:border-cyan-500/40 hover:bg-cyan-500/[0.04] transition-all"
          >
            Why a PBC
          </Link>
        </div>
      </section>

      {/* Product strip */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-semibold">Products</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">Four things, built carefully.</h2>
          </div>
          <Link href="/products" className="text-sm text-slate-400 hover:text-cyan-300 hidden sm:inline">All products →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.key} product={p} compact />
          ))}
        </div>
      </section>

      {/* Patent strip */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="rounded-2xl border hairline bg-gradient-to-br from-cyan-500/[0.04] via-transparent to-blue-500/[0.04] p-8 sm:p-10 grid md:grid-cols-[1fr_auto] items-center gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-semibold mb-2">US Patent {PATENT.number}</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-3">
              The mobility rails for Andiamo are patented.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">{PATENT.summary}</p>
          </div>
          <Link
            href="/patent"
            className="px-5 py-2.5 rounded-pill text-sm font-semibold border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 transition-all whitespace-nowrap"
          >
            Read the patent →
          </Link>
        </div>
      </section>

      {/* CTA strip */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="rounded-2xl border hairline bg-white/[0.02] p-8 sm:p-10 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">See something we should fix?</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto mb-6">
            Security finding, content takedown, DMCA notice, or just a bug — one form, routed to the right team.
          </p>
          <Link
            href="/report"
            className="inline-block px-7 py-3 rounded-pill text-sm font-semibold grad-cyan-blue text-white shadow-lg shadow-cyan-500/30 hover:scale-[1.02] transition-all"
          >
            Report an issue →
          </Link>
        </div>
      </section>
    </div>
  );
}
