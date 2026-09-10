import type { Metadata } from 'next';
import { PageHeader } from '@/components/page-header';
import { RunwayCalculator } from './calculator';

export const metadata: Metadata = {
  title: 'Runway calculator',
  description:
    'A free runway, breakeven and funding-gap calculator for founders. Runs entirely in your browser. No account, nothing saved, nothing sent.',
};

/**
 * SITE-RUNWAY-CALCULATOR-STARTUP-RESOURCE-001 — Brendan #163, verbatim: "yes move
 * that to the andiamo.tech site as a startup resource".
 *
 * It lived behind the Rides sign-in, where the people it is useful to could not
 * reach it. Here it is public, and it computes in the visitor's browser: the
 * engine (src/lib/runway.ts) is pure, so this page needs no API route, stores
 * nothing, and sends nothing anywhere. That is a promise the page makes in
 * writing, so it has to stay true - if a future version posts these numbers to a
 * server, the sentence below has to change with it.
 */
export default function RunwayResourcePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <PageHeader
        eyebrow="Free resource"
        title="Runway calculator"
        lead={
          <>
            How long your money lasts, when you break even, and what you would have to raise to
            get there. A free tool from Andiamo Tech, for founders who are doing this the hard
            way.
          </>
        }
      />

      <p className="mb-10 text-sm text-slate-400">
        Everything below is worked out in your own browser. There is no account, nothing is
        saved, and none of these numbers leave this page.
      </p>

      <RunwayCalculator />
    </div>
  );
}
