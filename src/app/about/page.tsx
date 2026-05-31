import Link from 'next/link';
import { COMPANY, PATENT, SPECTRUM } from '@/lib/company';
import { PageHeader } from '@/components/page-header';
import { Reveal } from '@/components/reveal';
import { SpectrumDots } from '@/components/spectrum-mark';

export const metadata = { title: 'About' };

const SECTIONS = [
  {
    h: 'Why a Public Benefit Corporation.',
    body: (
      <>
        A Public Benefit Corporation has a <strong className="text-slate-200">legally enforceable</strong> charter to balance shareholder returns against a stated public benefit. For us that benefit is plain: build software that respects the people who use it. No dark patterns, no data brokerage, no attention farming. The charter exists so the next leadership team can’t quietly drop that commitment when growth gets harder — it’s a value system with a fiduciary backstop, not a slogan.
      </>
    ),
  },
  {
    h: 'Where we are.',
    body: (
      <>
        Incorporated in Delaware, operating from {COMPANY.location}. Most of the team is in the Pacific Northwest; we work distributed and ship in public.
      </>
    ),
  },
  {
    h: 'What we own.',
    body: (
      <>
        The mobility settlement architecture inside <Link href="/patent" className="text-cyan-300 hover:text-cyan-200">Andiamo</Link> is protected by US Patent <Link href="/patent" className="text-cyan-300 hover:text-cyan-200">{PATENT.number}</Link> — smart-contract bid matching, dual-rail payment (fiat or token), a helper fund for subsidized rides, and an on-chain certification model for autonomous vehicles. Velocity, Academy, and Pathfinder run on conventional rails.
      </>
    ),
  },
  {
    h: 'How to reach us.',
    body: (
      <>
        Email <a href={`mailto:${COMPANY.helloEmail}`} className="text-cyan-300 hover:text-cyan-200">{COMPANY.helloEmail}</a> for general inquiries, partnerships, or press. For security findings, takedown, DMCA, or bug reports use the <Link href="/report" className="text-cyan-300 hover:text-cyan-200">issue intake form</Link> — it routes to the right team faster than email.
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHeader
        eyebrow="About"
        title={<>A small team. <span className="spectrum-text">A public charter.</span></>}
        lead={`${COMPANY.legalName} is a Delaware Public Benefit Corporation operating from ${COMPANY.location}. Founded in ${COMPANY.founded}, we ship four products under one roof — held to one promise.`}
      />

      <div className="space-y-10">
        {SECTIONS.map((s, i) => (
          <Reveal key={s.h} delay={Math.min(i * 60, 200)}>
            <section>
              <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: SPECTRUM[i % SPECTRUM.length] }} />
                {s.h}
              </h2>
              <p className="text-base text-slate-400 leading-relaxed pl-[18px]">{s.body}</p>
            </section>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <div className="mt-14 pt-8 border-t hairline flex items-center gap-3 text-sm text-slate-500">
          <SpectrumDots size={6} gap={5} />
          <span>{COMPANY.legalName} · {COMPANY.location}</span>
        </div>
      </Reveal>
    </div>
  );
}
