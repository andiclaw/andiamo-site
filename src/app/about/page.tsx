import Link from 'next/link';
import { COMPANY, PATENT, SPECTRUM } from '@/lib/company';
import { PageHeader } from '@/components/page-header';
import { Reveal } from '@/components/reveal';
import { SpectrumDots } from '@/components/spectrum-mark';

export const metadata = { title: 'About' };

const SECTIONS = [
  {
    h: 'What we do.',
    body: (
      <>
        We build applications that directly support people and solve problems businesses and communities run into every day. The work spans trend intelligence, education, mobility, and developer tools, but the throughline is the same: start with a real problem, then build something useful and build it well.
      </>
    ),
  },
  {
    h: 'Where we are.',
    body: (
      <>
        Headquartered in {COMPANY.location}, in the Skagit Valley. Most of the team is in the Pacific Northwest; we work distributed and ship in public.
      </>
    ),
  },
  {
    h: 'How we are organized.',
    body: (
      <>
        We are incorporated as a Delaware Public Benefit Corporation. That gives our directors a duty to a stated public benefit, not to profit alone: no dark patterns, no data brokerage, no attention farming. The charter keeps that commitment in place through a change of leadership or a hard quarter.
      </>
    ),
  },
  {
    h: 'What we own.',
    body: (
      <>
        The mobility settlement architecture inside <Link href="/patent" className="text-cyan-300 hover:text-cyan-200">Andiamo</Link> is protected by US Patent <Link href="/patent" className="text-cyan-300 hover:text-cyan-200">{PATENT.number}</Link>, covering smart-contract bid matching, dual-rail payment (fiat or token), a helper fund for subsidized rides, and an on-chain certification model for autonomous vehicles. Velocity, Academy, and Pathfinder run on conventional rails.
      </>
    ),
  },
  {
    h: 'How to reach us.',
    body: (
      <>
        Email <a href={`mailto:${COMPANY.supportEmail}`} className="text-cyan-300 hover:text-cyan-200">{COMPANY.supportEmail}</a> for general inquiries, partnerships, or press. For security findings, takedown, DMCA, or bug reports, the <Link href="/report" className="text-cyan-300 hover:text-cyan-200">issue intake form</Link> routes to the right team faster than email.
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <PageHeader
        eyebrow="About"
        title={<>Building software to <span className="spectrum-text">better the world.</span></>}
        lead={`${COMPANY.legalName} builds applications that directly support people and solve everyday problems for businesses and communities. Founded in ${COMPANY.founded} and headquartered in ${COMPANY.location}.`}
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
