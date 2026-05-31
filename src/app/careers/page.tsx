import Link from 'next/link';
import { COMPANY } from '@/lib/company';

export const metadata = {
  title: 'Careers',
  description: `Working at ${COMPANY.legalName}.`,
};

// Scaffold only — content to be filled in when hiring opens.
export default function CareersPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      <span className="text-[10px] uppercase tracking-[0.3em] spectrum-text font-bold">Careers</span>
      <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mt-2 mb-4">
        Not hiring right now.
      </h1>
      <p className="text-base text-slate-400 leading-relaxed mb-8 max-w-xl mx-auto">
        We&apos;re a small team and we&apos;re not actively recruiting. If you think you&apos;re a fit anyway — particularly if you bring something we don&apos;t already have on the team — we&apos;d still like to hear from you.
      </p>
      <Link
        href={`mailto:${COMPANY.helloEmail}?subject=Speculative%20application`}
        className="inline-block px-7 py-3 rounded-pill text-sm font-semibold border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 transition-all"
      >
        Send us a note →
      </Link>
      <p className="text-xs text-slate-600 mt-12">
        When we do open roles, they&apos;ll be listed here first.
      </p>
    </div>
  );
}
