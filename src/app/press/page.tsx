import { COMPANY, PATENT } from '@/lib/company';
import { PRODUCTS } from '@/lib/products';

export const metadata = {
  title: 'Press',
  description: `Press kit, founder bio, brand assets, and media contact for ${COMPANY.legalName}.`,
};

export default function PressPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <header className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-semibold">Press</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mt-2 mb-4">
          Press &amp; media kit
        </h1>
        <p className="text-base text-slate-400 leading-relaxed">
          The short version, the talking points, the brand assets, and how to reach a human.
        </p>
      </header>

      {/* The short version */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">The short version</h2>
        <div className="rounded-2xl border hairline bg-white/[0.02] p-6 text-sm text-slate-300 leading-relaxed">
          <p className="mb-3">
            <strong className="text-white">{COMPANY.legalName}</strong> is a Delaware Public Benefit Corporation operating from {COMPANY.location}. Founded in {COMPANY.founded}. Four products under one roof: <strong className="text-white">Velocity</strong> (real-time trend intelligence), <strong className="text-white">Academy</strong> (homeschool platform with 51-state compliance), <strong className="text-white">Andiamo</strong> (patent-protected mobility settlement network, US&nbsp;{PATENT.number}), and <strong className="text-white">Pathfinder</strong> (open-source macOS file manager).
          </p>
          <p>
            The PBC charter binds the company to balance shareholder returns against a stated public benefit: build software that respects the people who use it.
          </p>
        </div>
      </section>

      {/* By the numbers */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">By the numbers</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Stat label="Products shipped" value="4" />
          <Stat label="US patent" value={PATENT.number.replace('US ', '')} mono />
          <Stat label="Founded" value={String(COMPANY.founded)} />
          <Stat label="HQ" value="Skagit Valley" sub="Washington" />
        </div>
      </section>

      {/* Talking points */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Talking points by product</h2>
        <div className="space-y-3">
          {PRODUCTS.map((p) => (
            <div key={p.key} className="rounded-xl border hairline bg-white/[0.02] p-5">
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-base font-semibold text-white">{p.name}</h3>
                <span className="text-xs text-slate-500">— {p.tagline}</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{p.valueProp}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Founder */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Founder</h2>
        <div className="rounded-2xl border hairline bg-white/[0.02] p-6 text-sm text-slate-300 leading-relaxed">
          <div className="font-semibold text-white text-base mb-2">{PATENT.inventor}</div>
          <p className="mb-3 text-slate-400">
            Founder &amp; CEO, {COMPANY.legalName}. Inventor on US {PATENT.number}, which protects the mobility settlement architecture inside the Andiamo product. Based in {COMPANY.location}.
          </p>
          <p className="text-xs text-slate-500 italic">
            Full bio coming soon — email <a href={`mailto:${COMPANY.helloEmail}`} className="text-cyan-400 hover:text-cyan-300">{COMPANY.helloEmail}</a> if you need it for a piece on deadline.
          </p>
        </div>
      </section>

      {/* Brand assets */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-4">Brand assets</h2>
        <p className="text-sm text-slate-400 mb-4">Direct downloads. Use them as-is; don&apos;t recolor the gradient or alter the wordmark spacing.</p>
        <div className="grid grid-cols-2 gap-3">
          <BrandAsset href="/brand/logo-mark.svg" label="Logo mark" sub="SVG · 64×64" />
          <BrandAsset href="/brand/wordmark.svg" label="Wordmark" sub="SVG · 320×64" />
        </div>
      </section>

      {/* Contact */}
      <section>
        <h2 className="text-xl font-bold text-white mb-4">Media contact</h2>
        <div className="rounded-2xl border hairline bg-gradient-to-br from-cyan-500/[0.04] via-transparent to-blue-500/[0.04] p-6 text-sm text-slate-300 leading-relaxed">
          <p className="mb-3">
            Press inquiries, interview requests, fact checks: <a href={`mailto:${COMPANY.helloEmail}?subject=Press%20inquiry`} className="text-cyan-300 hover:text-cyan-200 font-semibold">{COMPANY.helloEmail}</a>
          </p>
          <p className="text-slate-400">
            Same email for partnership and investor inquiries — we route internally. Response within one business day for most asks; same-day for deadline pieces if you say &quot;deadline: [time]&quot; in the subject.
          </p>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, sub, mono }: { label: string; value: string; sub?: string; mono?: boolean }) {
  return (
    <div className="rounded-xl border hairline bg-white/[0.02] p-4">
      <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{label}</div>
      <div className={`text-xl font-bold text-white ${mono ? 'font-mono' : ''}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-0.5">{sub}</div>}
    </div>
  );
}

function BrandAsset({ href, label, sub }: { href: string; label: string; sub: string }) {
  return (
    <a
      href={href}
      download
      className="rounded-xl border hairline bg-white/[0.02] p-4 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all group"
    >
      <div className="h-20 mb-3 flex items-center justify-center bg-black/30 rounded-lg overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={href} alt={label} className="max-h-12 max-w-[80%]" />
      </div>
      <div className="text-sm font-semibold text-white">{label}</div>
      <div className="text-xs text-slate-500 mt-0.5">{sub} · click to download</div>
    </a>
  );
}
