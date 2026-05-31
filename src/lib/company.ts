export const COMPANY = {
  legalName: 'Andiamo Tech, Inc.',
  shortName: 'Andiamo Tech',
  pbcLine: 'A Delaware Public Benefit Corporation, operating from Washington State.',
  location: 'Skagit Valley, Washington',
  founded: 2024,
  supportEmail: 'support@andiamo.tech',
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
    'A smart-contract settlement architecture for mobility. Riders post trip parameters, vehicles bid, and an immutable on-chain record splits payment between the operator, the city of origin, a helper fund for subsidized rides, and platform maintenance. The same rails work in conventional web2 mode (custodial wallet) or dApp mode (bring your own wallet).',
  usptoUrl: 'https://patents.google.com/patent/US12567119B1/',
} as const;

/**
 * The four-product spectrum. Each product owns a color; the umbrella brand
 * is the set of all four. Order reads cyan, violet, green, amber.
 */
export const SPECTRUM = ['#22D3EE', '#8B5CF6', '#22C55E', '#F59E0B'] as const;
export const SPECTRUM_GRADIENT =
  'linear-gradient(90deg, #22D3EE 0%, #6366F1 34%, #22C55E 67%, #F59E0B 100%)';

/**
 * Marketing copy. Single source of truth for the brand narrative so the
 * voice stays consistent across pages and the OG image.
 */
export const BRAND = {
  eyebrow: 'Public Benefit Corporation',
  headline: 'Software with an obligation to you.',
  subhead:
    'We are a Delaware Public Benefit Corporation, which means our directors have a legal duty to weigh your interests alongside the bottom line. We build four products to that standard, from the Skagit Valley.',
  promiseTitle: 'A promise with legal weight.',
  promiseLead:
    'A Public Benefit Corporation has a charter that gives its directors a duty to a stated public benefit, not to profit alone. Ours is to build software that respects the people who use it. Here is what that means in practice.',
  commitments: [
    {
      n: '01',
      title: 'We do not farm your attention.',
      body: 'No infinite scroll built to trap you, no dark patterns, no engagement metric dressed up as a feature. We want our products to help you finish and move on.',
    },
    {
      n: '02',
      title: 'We do not broker your data.',
      body: 'We do not sell it, rent it, or build shadow profiles. You can export what we hold about you, and you can delete it. The default setting is the private one.',
    },
    {
      n: '03',
      title: 'This is hard to walk back.',
      body: 'The next leadership team inherits the same charter. That is the reason we incorporated as a PBC: so the commitment survives a change of management or a hard quarter.',
    },
  ],
  studioTitle: 'Why we exist.',
  studioBody: [
    'Andiamo Tech started with a patent and a short list of tools we wished existed. The software for the things we cared about, getting around our county, teaching our kids, cutting through the noise, managing our own files, was either extractive, abandoned, or missing.',
    'So we built our own. Four products, each held to the same standard and the same promise. We incorporated as a Public Benefit Corporation so that promise can outlast any one of us.',
  ],
} as const;

export type Company = typeof COMPANY;
export type Patent = typeof PATENT;
