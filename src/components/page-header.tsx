import type { ReactNode } from 'react';
import { Reveal } from './reveal';
import { SpectrumBar } from './spectrum-mark';

/**
 * Shared page header used by every sub-page so the brand is consistent and
 * new pages inherit it for free. Spectrum eyebrow + display title + optional
 * lead, with a scroll-reveal and a spectrum divider underneath.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
  bar = true,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  bar?: boolean;
}) {
  return (
    <header className="mb-12">
      <Reveal>
        <span className="text-[10px] uppercase tracking-[0.3em] spectrum-text font-bold">{eyebrow}</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mt-3 mb-4 leading-[1.05]">
          {title}
        </h1>
        {lead && <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl">{lead}</p>}
        {children}
      </Reveal>
      {bar && <SpectrumBar className="opacity-30 mt-8" />}
    </header>
  );
}

/**
 * Section heading used within a page body (smaller than PageHeader).
 */
export function SectionHeading({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="mb-6">
      {eyebrow && (
        <span className="text-[10px] uppercase tracking-[0.3em] spectrum-text font-bold">{eyebrow}</span>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">{title}</h2>
    </div>
  );
}
