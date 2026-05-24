import { ReportForm } from '@/components/report-form';
import { COMPANY } from '@/lib/company';

export const metadata = {
  title: 'Report an issue',
  description: 'Security findings, DMCA notices, content takedown, and bug reports for Andiamo Tech products.',
};

interface SearchParams {
  searchParams?: Promise<{ product?: string }>;
}

export default async function ReportPage({ searchParams }: SearchParams) {
  const params = (await searchParams) ?? {};
  const defaultProduct = params.product;

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-8">
        <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-semibold">Report an issue</span>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-2 mb-3">
          One form. We route it.
        </h1>
        <p className="text-slate-400 leading-relaxed">
          Whether it’s a vulnerability, a DMCA notice, a takedown request, or just a bug — fill this out and the right team picks it up. Everything lands at <span className="text-slate-300">{COMPANY.supportEmail}</span>.
        </p>
      </header>

      <ReportForm defaultProduct={defaultProduct} />

      <div className="mt-10 pt-6 border-t hairline text-xs text-slate-500 space-y-2 leading-relaxed">
        <p><strong className="text-slate-400">Security reports:</strong> we publish a coordinated-disclosure response within 72 hours. We don’t pursue good-faith researchers acting within the bounds of our security policy.</p>
        <p><strong className="text-slate-400">DMCA notices:</strong> we follow 17 U.S.C. § 512 takedown/counter-notice procedure. Include all six statutory elements or the notice may be returned.</p>
        <p><strong className="text-slate-400">PGP / signal:</strong> available on request — reply to our confirmation email and we’ll send the fingerprint.</p>
      </div>
    </div>
  );
}
