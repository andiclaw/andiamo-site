'use client';

/**
 * The calculator itself. A client component because every number is computed
 * HERE - `compute()` is pure, so the visitor's inputs never leave the browser
 * and the page can honestly say nothing is stored or sent.
 *
 * Ported from the Rides sign-in surface for #163. The form is deliberately
 * short: the engine accepts a dozen inputs, but a founder meeting this tool for
 * the first time needs the six that decide the answer, and sensible zeros for
 * the rest.
 */
import { useState } from 'react';
import { compute, money, type RunwayCalc, type RunwayInput } from '@/lib/runway';
import RunwayIllustration from '@/components/runway-illustration';

interface FieldSpec {
  key: keyof RunwayInput;
  label: string;
  hint: string;
  prefix?: string;
  suffix?: string;
}

const MONEY_FIELDS: FieldSpec[] = [
  { key: 'bootstrap_cash', label: 'Cash in the bank', hint: 'Everything you can actually spend today.', prefix: '$' },
  { key: 'mrr', label: 'Monthly revenue', hint: 'What comes in this month. Zero is a real answer.', prefix: '$' },
  { key: 'mrc', label: 'Monthly costs', hint: 'Everything that goes out, including you.', prefix: '$' },
  { key: 'external_equity_cash', label: 'Equity raised', hint: 'Money already in from investors.', prefix: '$' },
  { key: 'grant_cash', label: 'Grants', hint: 'Awarded and expected to land.', prefix: '$' },
  { key: 'loan_cash', label: 'Loans', hint: 'Borrowed money you have drawn.', prefix: '$' },
];

const RATE_FIELDS: FieldSpec[] = [
  { key: 'growth_pct', label: 'Revenue growth', hint: 'Month over month.', suffix: '%' },
  { key: 'cost_growth_pct', label: 'Cost growth', hint: 'Month over month.', suffix: '%' },
  { key: 'loan_apr_pct', label: 'Loan APR', hint: 'Leave at zero if you have no debt.', suffix: '%' },
  { key: 'loan_term_years', label: 'Loan term', hint: 'In years.', suffix: 'yr' },
];

const EMPTY: Record<string, string> = {};

function Row({ label, value, tone }: { label: string; value: string; tone?: 'good' | 'bad' }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/5 py-2.5">
      <span className="text-sm text-slate-400">{label}</span>
      <span
        className={`text-sm font-semibold tabular-nums ${
          tone === 'bad' ? 'text-rose-300' : tone === 'good' ? 'text-emerald-300' : 'text-slate-100'
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function RunwayCalculator() {
  const [raw, setRaw] = useState<Record<string, string>>(EMPTY);
  const [calc, setCalc] = useState<RunwayCalc | null>(null);

  function set(key: string, value: string) {
    setRaw((r) => ({ ...r, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const input: RunwayInput = {};
    for (const f of [...MONEY_FIELDS, ...RATE_FIELDS]) {
      const v = raw[f.key as string];
      if (v !== undefined && v !== '') {
        (input as Record<string, unknown>)[f.key as string] = Number(v.replace(/,/g, ''));
      }
    }
    input.company_name = raw.company_name || '';
    // Computed here, in this browser. No fetch, no storage.
    setCalc(compute(input));
  }

  const field = (f: FieldSpec) => (
    <label key={f.key as string} className="block">
      <span className="block text-sm font-medium text-slate-200">{f.label}</span>
      <span className="mt-0.5 block text-xs text-slate-500">{f.hint}</span>
      <span className="mt-2 flex items-center rounded-lg border border-white/10 bg-white/5 focus-within:border-cyan-400/60">
        {f.prefix && <span className="pl-3 text-sm text-slate-500">{f.prefix}</span>}
        <input
          inputMode="decimal"
          value={raw[f.key as string] ?? ''}
          onChange={(e) => set(f.key as string, e.target.value)}
          placeholder="0"
          className="w-full bg-transparent px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600"
        />
        {f.suffix && <span className="pr-3 text-sm text-slate-500">{f.suffix}</span>}
      </span>
    </label>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
      <form onSubmit={onSubmit} className="space-y-5">
        <label className="block">
          <span className="block text-sm font-medium text-slate-200">Company name</span>
          <span className="mt-0.5 block text-xs text-slate-500">Optional. Only used to label the result.</span>
          <input
            value={raw.company_name ?? ''}
            onChange={(e) => set('company_name', e.target.value)}
            placeholder="Your company"
            className="mt-2 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-600 focus:border-cyan-400/60"
          />
        </label>

        <div className="grid gap-5 sm:grid-cols-2">{MONEY_FIELDS.map(field)}</div>
        <div className="grid gap-5 sm:grid-cols-2">{RATE_FIELDS.map(field)}</div>

        <button
          type="submit"
          className="focusable rounded-full bg-cyan-400 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Work it out
        </button>
      </form>

      <section aria-live="polite">
        {calc === null ? (
          <p className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-slate-400">
            Fill in what you know and press <strong className="text-slate-200">Work it out</strong>.
            Anything you leave blank counts as zero.
          </p>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-100">{calc.companyName}</h2>
            <Row label="Cash on hand" value={money(calc.totalCash)} />
            <Row label="Monthly burn" value={money(calc.burnInclDebt)} tone={calc.burnInclDebt > 0 ? 'bad' : 'good'} />
            <Row
              label="Runway"
              value={calc.staticRunway === null ? 'Indefinite at these numbers' : `${calc.staticRunway.toFixed(1)} months`}
              tone={calc.staticRunway !== null && calc.staticRunway < 6 ? 'bad' : undefined}
            />
            <Row
              label="Breakeven"
              value={calc.opDate ? `${calc.opDate} (month ${calc.opMonth})` : 'Not reached at these numbers'}
              tone={calc.opDate ? 'good' : 'bad'}
            />
            <Row label="Cash runs out" value={calc.cashoutDate ?? 'Not at these numbers'} />
            <Row label="Funding gap" value={money(calc.fundingGap)} tone={calc.fundingGap > 0 ? 'bad' : 'good'} />
            <Row label="Recommended raise" value={money(calc.recommendedRaise)} />
            <div className="mt-6">
              <RunwayIllustration calc={calc} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
