import Link from 'next/link';
import { COMPANY, PATENT } from '@/lib/company';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <header className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-semibold">About</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mt-2 mb-3">A small team. A public charter.</h1>
        <p className="text-slate-400 leading-relaxed">
          {COMPANY.legalName} is a Delaware Public Benefit Corporation operating out of {COMPANY.location}. Founded in {COMPANY.founded}, we ship four products under one roof.
        </p>
      </header>

      <section className="prose prose-invert max-w-none space-y-5 text-slate-300 leading-relaxed">
        <h2 className="text-xl font-bold text-white">Why a PBC.</h2>
        <p>
          A Public Benefit Corporation has a legally enforceable charter to balance shareholder returns against a stated public benefit. For us that benefit is plain: <strong>build tools that respect the people who use them.</strong> No dark patterns, no data brokerage, no attention farming. The PBC charter exists so the next leadership team can’t quietly drop that commitment when growth gets harder.
        </p>

        <h2 className="text-xl font-bold text-white">Where we are.</h2>
        <p>
          We’re incorporated in Delaware and headquartered in {COMPANY.location}. Most of the team is in the Pacific Northwest; we work distributed and we ship in public.
        </p>

        <h2 className="text-xl font-bold text-white">What we own.</h2>
        <p>
          The mobility settlement architecture inside <Link href="/products" className="text-cyan-300 hover:text-cyan-200">Andiamo</Link> is protected by US Patent <Link href="/patent" className="text-cyan-300 hover:text-cyan-200">{PATENT.number}</Link>. The patent covers smart-contract bid matching, dual-rail payment (fiat or token), a helper fund for subsidized rides, and the on-chain certification model for autonomous vehicles. Everything else — Velocity, Academy, Pathfinder — runs on conventional rails.
        </p>

        <h2 className="text-xl font-bold text-white">How to reach us.</h2>
        <p>
          Email <a href={`mailto:${COMPANY.helloEmail}`} className="text-cyan-300 hover:text-cyan-200">{COMPANY.helloEmail}</a> for general inquiries, partnerships, or press.
          For security findings, content takedown, DMCA notices, or bug reports use the <Link href="/report" className="text-cyan-300 hover:text-cyan-200">issue intake form</Link> — it routes to the right team faster than email.
        </p>
      </section>
    </div>
  );
}
