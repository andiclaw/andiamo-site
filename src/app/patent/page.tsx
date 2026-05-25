import { COMPANY, PATENT } from '@/lib/company';

export const metadata = {
  title: 'Patent',
  description:
    'US Patent 12,567,119 B1 — Autonomous Transportation Systems and Methods. The smart-contract settlement architecture protecting Andiamo Tech, Inc.\'s mobility product.',
};

export default function PatentPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <header className="mb-10">
        <span className="text-[10px] uppercase tracking-[0.3em] text-cyan-400 font-semibold">United States Patent</span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mt-2 mb-3 font-mono">
          {PATENT.number}
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">{PATENT.title}</p>
      </header>

      <div className="rounded-2xl border hairline bg-white/[0.02] p-6 mb-10 grid sm:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Inventor</div>
          <div className="text-slate-200">{PATENT.inventor}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Filed</div>
          <div className="text-slate-200">{PATENT.filedDisplay}</div>
          <div className="text-[10px] text-slate-500 mt-1">priority chain to Sep 16, 2019</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Awarded</div>
          <div className="text-slate-200">{PATENT.awardedDisplay}</div>
          <div className="text-[10px] text-slate-500 mt-1">18 claims · 29 drawing sheets</div>
        </div>
      </div>

      <section className="space-y-6 text-slate-300 leading-relaxed mb-10">
        <h2 className="text-xl font-bold text-white">What it covers, in one paragraph.</h2>
        <p className="text-base">
          A smart-contract-driven mobility settlement architecture: riders post trip parameters (origin, destination, time window, vehicle preferences), vehicles submit bids (price-per-mile, ETA, vehicle class), the smart contract sorts and presents bids, the rider selects, and an immutable record of the agreement is written to the blockchain. The fare splits automatically across the operator, the city of origin, a helper fund that subsidizes verified low-income rides, and platform maintenance — no manual reconciliation, no escrow agent, no monthly settlement run.
        </p>
      </section>

      <section className="space-y-3 mb-10">
        <h2 className="text-xl font-bold text-white">The three protected components.</h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          The patent describes three architectural tiers that work together to form the protected system:
        </p>
        <div className="grid sm:grid-cols-3 gap-3 mt-4">
          {[
            { tag: 'C1', name: 'Backend infrastructure', body: 'Ethereum-class blockchain, smart contracts, on-chain + off-chain storage, oracle bridges for fiat conversion and identity attestation.' },
            { tag: 'C2', name: 'Application layer', body: 'Mobile, web, and VR interfaces for riders, drivers, advertisers, nonprofits, and government agencies. The user-facing surfaces that read from and write to C1.' },
            { tag: 'C3', name: 'Service provider / API layer', body: 'Integrations with vehicle manufacturers and the vehicles themselves — certification records, telematics handoff, autonomy-level attestation.' },
          ].map((c) => (
            <div key={c.tag} className="rounded-xl border hairline bg-white/[0.02] p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-cyan-400 mb-2">{c.tag}</div>
              <div className="text-sm font-semibold text-white mb-2">{c.name}</div>
              <div className="text-xs text-slate-400 leading-relaxed">{c.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5 text-slate-300 leading-relaxed mb-10">
        <h2 className="text-xl font-bold text-white">The mechanisms that matter.</h2>
        <p className="text-sm">
          A handful of the protected mechanisms have outsized strategic weight. These are the ones that competitors would have to design around — or license:
        </p>

        <div className="space-y-4 mt-4">
          {[
            {
              title: 'Smart-contract bid matching',
              body: 'The user posts trip parameters; vehicles bid in a structured auction; the smart contract sorts and presents bids by user-defined priority; the user selects one; the agreement and its settlement terms are written immutably on-chain. This replaces both the centralized matching algorithm (Uber/Lyft) and the manual booking flow (taxi dispatch) with a deterministic, auditable auction.',
            },
            {
              title: 'Dual payment rails (fiat ↔ native token)',
              body: 'Riders pay with credit/debit (Stripe) or with the native ATS token. The two are interchangeable through an external currency exchange with a small conversion fee. Drivers receive payout in whichever rail they prefer. Users never have to know the blockchain is there.',
            },
            {
              title: 'Automatic four-way payment split',
              body: 'Each fare splits 90% operator / 6% city of origin / 2% helper fund / 2% platform maintenance — at settlement time, on-chain, no manual reconciliation. The city-of-origin slice converts the patent into a structurally-rideshare-friendly arrangement with municipalities.',
            },
            {
              title: 'ATS token economics',
              body: '1 token minted at registration; 1 token earned every 10th completed trip; a maintenance fee on each ride flows to a delegated platform wallet. Fixed-supply outside this minting schedule.',
            },
            {
              title: 'Helper program with verified eligibility',
              body: 'A nonprofit or government agency verifies a rider\'s eligibility for subsidized rides; the helper fund (the 2% slice above) covers the difference; a fair-use queue prevents single-rider monopolization. The first rideshare model that bakes equitable access into the settlement layer rather than bolting it on as a marketing program.',
            },
            {
              title: 'Vehicle certification on-chain',
              body: 'Vehicle certifications (DOT, SAE autonomy level 0-5, insurance, inspection history) are stored on-chain. Test-track verification is itself a smart contract. A regulator querying the chain gets a single canonical answer.',
            },
            {
              title: 'Multi-vehicle hail / linked-trip chaining',
              body: 'Trips that span multiple vehicles — e.g. car → light rail → car — are bid and settled as a single linked transaction. Transit-station handoffs and schedule-based vehicles participate in the same auction model.',
            },
            {
              title: 'Transit governance tokens',
              body: 'Governance tokens tied to voter registration give riders a structured voice in how the transit-authority integration is configured for their region.',
            },
            {
              title: 'Delegated custodial accounts',
              body: 'For web2 users, the system operator holds a delegated account on the user\'s behalf (a hash of the user\'s signature combined with the contract address). This lets the blockchain economics run invisibly under a conventional Stripe checkout — no wallet, no seed phrase, no crypto vocabulary forced on the rider.',
            },
          ].map((m) => (
            <div key={m.title} className="rounded-xl border hairline bg-white/[0.02] p-5">
              <h3 className="text-sm font-semibold text-white mb-2">{m.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5 text-slate-300 leading-relaxed mb-10">
        <h2 className="text-xl font-bold text-white">Web2 by default. dApp on request.</h2>
        <p className="text-sm">
          The patent’s dual-mode design is the production deployment choice we made. The default user experience is a conventional rideshare app: open the app, request a ride, pay with the card on file. An embedded custodial wallet is created silently on registration; the blockchain runs in the background.
        </p>
        <p className="text-sm">
          Users who want a true dApp experience connect their own wallet (MetaMask, WalletConnect, hardware) and the app becomes a full dApp — bids, settlements, and governance votes all signed from their wallet. Both modes are interchangeable; a user can flip between them without losing trip history or credits.
        </p>
      </section>

      <section className="space-y-3 mb-10">
        <h2 className="text-xl font-bold text-white">What this means for the rest of {COMPANY.shortName}.</h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          The patent applies specifically to <strong>Andiamo</strong> — our zone-mobility product at <code className="text-cyan-300">app.andiamo.tech</code>. The other three things {COMPANY.shortName} ships — Velocity, Academy, and Pathfinder — are conventional software products with no patent encumbrance.
        </p>
        <p className="text-sm text-slate-300 leading-relaxed">
          If you operate a mobility business — fleet, ride-hail, micromobility, transit — and any of the mechanisms above describe what you do or want to do, we should talk. Email <a href={`mailto:${COMPANY.helloEmail}`} className="text-cyan-300 hover:text-cyan-200">{COMPANY.helloEmail}</a> with subject "Patent — licensing inquiry."
        </p>
      </section>

      <div className="flex flex-wrap gap-3 pt-6 border-t hairline">
        <a
          href={PATENT.usptoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill text-sm font-semibold border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 transition-all"
        >
          View on Google Patents →
        </a>
        <a
          href={`https://patentcenter.uspto.gov/applications/search?q=${encodeURIComponent(PATENT.number)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill text-sm font-semibold border hairline text-slate-300 hover:text-white hover:border-white/[0.15] transition-all"
        >
          Look up on USPTO Patent Center →
        </a>
        <a
          href={`mailto:${COMPANY.helloEmail}?subject=Patent%20%E2%80%94%20licensing%20inquiry`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-pill text-sm font-semibold border hairline text-slate-300 hover:text-white hover:border-white/[0.15] transition-all"
        >
          Licensing inquiry →
        </a>
      </div>
    </div>
  );
}
