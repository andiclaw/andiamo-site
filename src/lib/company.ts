export const COMPANY = {
  legalName: 'Andiamo Tech, Inc.',
  shortName: 'Andiamo Tech',
  pbcLine: 'A Delaware Public Benefit Corporation, operating from Washington State.',
  location: 'Skagit Valley, Washington',
  founded: 2024,
  supportEmail: 'support@andiamo.tech',
  helloEmail: 'hello@andiamo.tech',
  domain: 'andiamo.tech',
} as const;

export const PATENT = {
  number: 'US 12,567,119 B1',
  title: 'Autonomous Transportation Systems and Methods',
  awardedISO: '2026-03-03',
  awardedDisplay: 'March 3, 2026',
  inventor: 'Brendan Joseph McGoffin',
  filedDisplay: 'August 1, 2024',
  summary:
    'A smart-contract-driven mobility settlement architecture: riders post trip parameters, vehicles bid, and an immutable on-chain record splits payment between the operator, the city of origin, a helper fund for subsidized rides, and platform maintenance. The same rails work in pure web2 (custodial wallet) or dApp (BYO wallet) mode.',
  usptoUrl: 'https://patents.google.com/patent/US12567119B1/',
} as const;

/**
 * The four-product spectrum — the signature brand device. Each product owns
 * a color; the umbrella brand is the spectrum of all four. Order matters:
 * it reads left-to-right cyan→violet→green→amber in the hero gradient.
 */
export const SPECTRUM = ['#22D3EE', '#8B5CF6', '#22C55E', '#F59E0B'] as const;
export const SPECTRUM_GRADIENT =
  'linear-gradient(90deg, #22D3EE 0%, #6366F1 34%, #22C55E 67%, #F59E0B 100%)';

/**
 * Marketing copy — single source of truth for the brand narrative so the
 * voice stays consistent across pages and the OG image.
 */
export const BRAND = {
  eyebrow: 'Public Benefit Corporation',
  headline: 'Software with an obligation to you.',
  subhead:
    'We are a Delaware Public Benefit Corporation — legally bound to weigh your interests against our own. Four products, built to that standard, by a small team in the Skagit Valley.',
  // The PBC promise, made concrete. Three binding commitments.
  promiseTitle: 'A promise with legal teeth.',
  promiseLead:
    '“Public Benefit Corporation” is not a marketing badge. It is a corporate charter that gives our directors a fiduciary duty to a stated public benefit — not to profit alone. Ours is plain: build software that respects the people who use it. In practice, that means three things we have put in writing.',
  commitments: [
    {
      n: '01',
      title: 'We don’t farm your attention.',
      body: 'No infinite scroll engineered to trap you, no dark patterns, no engagement metric dressed up as a feature. Our products are designed to help you finish and leave.',
    },
    {
      n: '02',
      title: 'We don’t broker your data.',
      body: 'We don’t sell it, rent it, or assemble shadow profiles. You can export everything we hold about you, and you can delete it. The default is the private one.',
    },
    {
      n: '03',
      title: 'We can’t quietly walk this back.',
      body: 'The next leadership team inherits the same charter. This is the point of incorporating as a PBC: the values survive a change of management, a funding round, or a hard quarter.',
    },
  ],
  studioTitle: 'Why we exist.',
  studioBody: [
    'Andiamo Tech started with a patent and a frustration. The best tools for the things we cared about — getting around our county, teaching our kids, seeing what actually matters in the noise, managing our own files — were extractive, abandoned, or simply didn’t exist.',
    'So we built them. Four products, each shipped to the same standard, each held to the same promise. We incorporated as a Public Benefit Corporation so that promise outlives any one of us.',
  ],
} as const;

export type Company = typeof COMPANY;
export type Patent = typeof PATENT;
