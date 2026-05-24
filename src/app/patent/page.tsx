import { COMPANY, PATENT } from '@/lib/company';

export const metadata = { title: 'Patent' };

export default function PatentPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <header className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-semibold">Patent</span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2 mb-3">{PATENT.number}</h1>
        <p className="text-base text-slate-300 leading-relaxed">{PATENT.title}</p>
      </header>

      <div className="rounded-2xl border hairline bg-white/[0.02] p-6 mb-8 grid sm:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Inventor</div>
          <div className="text-slate-200">{PATENT.inventor}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Filed</div>
          <div className="text-slate-200">{PATENT.filedDisplay}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Awarded</div>
          <div className="text-slate-200">{PATENT.awardedDisplay}</div>
        </div>
      </div>

      <section className="prose prose-invert max-w-none space-y-5 text-slate-300 leading-relaxed">
        <h2 className="text-xl font-bold text-white">What it covers.</h2>
        <p>{PATENT.summary}</p>

        <h2 className="text-xl font-bold text-white">Where it lives.</h2>
        <p>
          The patent is implemented inside <strong>Andiamo</strong>, our zone-mobility product. The other three things {COMPANY.shortName} builds — Velocity, Academy, and Pathfinder — are conventional software with no patent encumbrance.
        </p>

        <h2 className="text-xl font-bold text-white">Read it.</h2>
        <p>
          Full text and 29 drawing sheets are public on the USPTO record.
        </p>
      </section>

      <div className="mt-8">
        <a
          href={PATENT.usptoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill text-sm font-semibold border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 transition-all"
        >
          View on Google Patents →
        </a>
      </div>
    </div>
  );
}
