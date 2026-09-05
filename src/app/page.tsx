import Link from 'next/link';
import { ProductShowcase } from '@/components/product-showcase';
import { Reveal } from '@/components/reveal';
import { SpectrumDots, SpectrumBar } from '@/components/spectrum-mark';
import { COMPANY, PATENT, BRAND } from '@/lib/company';
import { PRODUCTS } from '@/lib/products';
import Constellation from '@/components/constellation/constellation';


export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden">
      <Constellation />

      <div className="max-w-6xl mx-auto px-6"><SpectrumBar className="opacity-40" /></div>

      {/* ── Mission strip ────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <Reveal>
          <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-300 font-bold">What we do</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 mb-5">{BRAND.missionTitle}</h2>
          <p className="text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">{BRAND.missionLead}</p>
        </Reveal>
      </section>

      {/* ── Products ─────────────────────────────────────────── */}
      <section id="products" className="max-w-6xl mx-auto px-6 py-12 scroll-mt-20">
        <Reveal>
          <div className="max-w-2xl mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-300 font-bold">The products</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3 mb-4">Four products, each at its own stage.</h2>
            <p className="text-base text-slate-400 leading-relaxed">
              Each one lives at its own home and runs its own roadmap. Pick the one you came for, or look at all four.
            </p>
          </div>
        </Reveal>
        <ProductShowcase />
      </section>

      {/* ── Impact: person / community / world ───────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <Reveal>
          <div className="max-w-2xl mb-14">
            <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-300 font-bold">Why it matters</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white mt-3 mb-4">{BRAND.impactTitle}</h2>
            <p className="text-base text-slate-400 leading-relaxed">{BRAND.impactLead}</p>
          </div>
        </Reveal>

        <div className="space-y-4">
          {PRODUCTS.map((p, i) => (
            <Reveal key={p.key} delay={Math.min(i * 60, 180)}>
              <div className="rounded-2xl border hairline bg-white/[0.02] p-6 sm:p-8">
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.accent }} />
                  <span className="text-sm font-bold text-white">{p.name}</span>
                  <span className="text-xs text-slate-500">{p.tagline}</span>
                </div>
                <div className="grid sm:grid-cols-3 gap-5">
                  {BRAND.impactScales.map((scale) => (
                    <div key={scale.key}>
                      <div
                        className="text-[10px] uppercase tracking-widest font-semibold mb-1.5"
                        style={{ color: p.accent }}
                      >
                        {scale.label}
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {p.impact[scale.key as 'person' | 'community' | 'world']}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── PBC supporting band (demoted) ────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <Reveal>
          <div className="rounded-2xl border hairline bg-white/[0.02] p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-5">
            <SpectrumDots size={8} gap={6} />
            <div>
              <h2 className="text-lg font-bold text-white mb-2">{BRAND.pbcTitle}</h2>
              <p className="text-sm text-slate-400 leading-relaxed max-w-3xl">{BRAND.pbcBody}</p>
              <Link href="/about" className="focusable inline-block mt-3 text-sm text-cyan-400 hover:text-cyan-300">
                More about the company →
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Patent beat ──────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <Reveal>
          <div className="rounded-2xl border hairline bg-gradient-to-br from-emerald-500/[0.05] via-transparent to-cyan-500/[0.04] p-6 sm:p-8 grid md:grid-cols-[1fr_auto] items-center gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-emerald-300 font-bold">
                US Patent {PATENT.number}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-2 mb-3">
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

      {/* ── Final CTA ────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <Reveal>
          <div className="relative rounded-3xl border hairline-bold overflow-hidden p-10 sm:p-16 text-center">
            <div className="absolute inset-0 -z-10 opacity-[0.10]" />
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
