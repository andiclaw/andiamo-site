import Link from 'next/link';
import { ProductShowcase } from '@/components/product-showcase';
import { Reveal } from '@/components/reveal';
import { SpectrumDots, SpectrumBar } from '@/components/spectrum-mark';
import { COMPANY, PATENT, BRAND } from '@/lib/company';
import { PRODUCTS } from '@/lib/products';

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden">
      {/* Ambient backdrop */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1200px] h-[900px] rounded-full opacity-50"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(99,102,241,0.14) 0%, rgba(34,211,238,0.06) 35%, transparent 68%)',
          }}
        />
        <div
          className="absolute top-[55%] right-[-12%] w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)' }}
        />
      </div>

      {/* Rideshare deflection: most legacy andiamo.tech traffic wants the app */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <a
          href="https://app.andiamo.tech"
          className="focusable flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-2.5 rounded-pill bg-emerald-500/[0.06] border border-emerald-500/20 text-xs sm:text-sm text-emerald-200 hover:bg-emerald-500/[0.10] hover:border-emerald-500/40 transition-all text-center"
        >
          <span className="opacity-80">Looking for the Andiamo rideshare app?</span>
          <span className="font-semibold text-emerald-300">app.andiamo.tech →</span>
        </a>
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pt-16 sm:pt-24 pb-20 text-center">
        <Reveal>
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-pill bg-white/[0.04] border hairline mb-8">
            <SpectrumDots size={7} gap={5} />
            <span className="text-[10px] uppercase tracking-[0.3em] text-slate-300">{BRAND.eyebrow}</span>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-white leading-[1.02] max-w-4xl mx-auto">
            Software with an{' '}
            <span className="spectrum-text">obligation</span> to you.
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mt-7 leading-relaxed">
            {BRAND.subhead}
          </p>
        </Reveal>

        <Reveal delay={240}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            <Link href="#products" className="focusable px-7 py-3.5 rounded-pill text-sm font-semibold btn-primary">
              Explore the products
            </Link>
            <Link href="/about" className="focusable px-7 py-3.5 rounded-pill text-sm font-semibold btn-ghost">
              Why a Public Benefit Corp →
            </Link>
          </div>
        </Reveal>

        {/* four-product spectrum legend */}
        <Reveal delay={320}>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {PRODUCTS.map((p) => (
              <div key={p.key} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: p.accent }} />
                <span className="text-xs text-slate-400">{p.name}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <div className="max-w-6xl mx-auto px-6"><SpectrumBar className="opacity-40" /></div>

      {/* ── The promise (manifesto) ──────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] uppercase tracking-[0.3em] spectrum-text font-bold">The promise</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3 mb-5">{BRAND.promiseTitle}</h2>
            <p className="text-base text-slate-400 leading-relaxed">{BRAND.promiseLead}</p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {BRAND.commitments.map((c, i) => (
            <Reveal key={c.n} delay={i * 100}>
              <div className="relative h-full rounded-2xl border hairline bg-white/[0.02] p-7 overflow-hidden accent-card hover:border-white/[0.14] hover:bg-white/[0.04]">
                <div
                  className="absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl opacity-30 pointer-events-none"
                  style={{ background: ['#22d3ee', '#8b5cf6', '#22c55e'][i] }}
                />
                <div className="text-3xl font-black mb-4 spectrum-text">{c.n}</div>
                <h3 className="text-lg font-bold text-white mb-2.5">{c.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────────── */}
      <section id="products" className="max-w-6xl mx-auto px-6 py-20 scroll-mt-20">
        <Reveal>
          <div className="max-w-2xl mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] spectrum-text font-bold">The products</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3 mb-4">Four products, in production.</h2>
            <p className="text-base text-slate-400 leading-relaxed">
              Each one lives at its own home and runs its own roadmap. Pick the one you came for, or look at all four.
            </p>
          </div>
        </Reveal>
        <ProductShowcase />
      </section>

      {/* ── Proof / by the numbers ───────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <Reveal>
          <div className="rounded-3xl border hairline bg-gradient-to-br from-white/[0.03] to-transparent p-8 sm:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              <Stat value="4" label="Products in production" />
              <Stat value="1" label="US patent granted" sub={PATENT.number} />
              <Stat value={String(COMPANY.founded)} label="Founded" sub="Delaware PBC" />
              <Stat value="100%" label="Built in-house" sub={COMPANY.location} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Patent beat ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <Reveal>
          <div className="rounded-3xl border hairline bg-gradient-to-br from-emerald-500/[0.05] via-transparent to-cyan-500/[0.04] p-8 sm:p-12 grid md:grid-cols-[1fr_auto] items-center gap-8">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-300 font-bold">
                US Patent {PATENT.number}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 mb-4">
                The mobility product is patent-backed.
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">{PATENT.summary}</p>
            </div>
            <Link
              href="/patent"
              className="focusable px-6 py-3 rounded-pill text-sm font-semibold border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 transition-all whitespace-nowrap"
            >
              Read the patent →
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ── Studio story ─────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <Reveal>
          <span className="text-[10px] uppercase tracking-[0.3em] spectrum-text font-bold">{BRAND.studioTitle}</span>
          <div className="mt-5 space-y-5">
            {BRAND.studioBody.map((para, i) => (
              <p key={i} className={`leading-relaxed ${i === 0 ? 'text-xl sm:text-2xl text-slate-200 font-medium' : 'text-base text-slate-400'}`}>
                {para}
              </p>
            ))}
          </div>
          <div className="mt-7 flex items-center gap-3 text-sm text-slate-500">
            <SpectrumDots size={6} gap={4} />
            <span>{COMPANY.legalName} · {COMPANY.location}</span>
          </div>
        </Reveal>
      </section>

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <Reveal>
          <div className="relative rounded-3xl border hairline-bold overflow-hidden p-10 sm:p-16 text-center">
            <div className="absolute inset-0 -z-10 spectrum-bg-animated opacity-[0.08]" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">Start with one, or all four.</h2>
            <p className="text-base text-slate-400 max-w-xl mx-auto mb-8">
              Every product is free to try. If you find something we should fix, whether a bug, a vulnerability, or a takedown, one form routes it to the right team.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="#products" className="focusable px-7 py-3.5 rounded-pill text-sm font-semibold btn-primary">
                See the products
              </Link>
              <Link href="/report" className="focusable px-7 py-3.5 rounded-pill text-sm font-semibold btn-ghost">
                Report an issue →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function Stat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div>
      <div className="text-4xl sm:text-5xl font-black spectrum-text leading-none mb-2">{value}</div>
      <div className="text-sm text-slate-300 font-medium">{label}</div>
      {sub && <div className="text-xs text-slate-500 mt-0.5 font-mono">{sub}</div>}
    </div>
  );
}
