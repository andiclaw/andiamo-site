export const COMPANY = {
  legalName: 'Andiamo Tech, Inc.',
  shortName: 'Andiamo Tech',
  motto: 'Building software to better the world.',
  pbcLine: 'A Delaware Public Benefit Corporation, headquartered in Sedro-Woolley, Washington.',
  location: 'Sedro-Woolley, Washington',
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
  eyebrow: 'Building software to better the world',
  headline: 'Software that solves real, everyday problems.',
  subhead:
    'We build applications that directly support people and tackle the problems businesses and communities run into every day. Four products so far, each aimed at a real need.',
  // Mission strip, the "what we do" framing that leads the page.
  missionTitle: 'Forward-focused, problem-first.',
  missionLead:
    'We start with a problem a real person or community is living with, then build the software that solves it. Our work spans trend intelligence, education, mobility, and developer tools, but the throughline is the same: make something useful, and make it well.',
  // Impact section intro.
  impactTitle: 'How the work helps.',
  impactLead:
    'Every product is built to matter at three scales at once: the person using it, the community around them, and the wider world.',
  impactScales: [
    { key: 'person', label: 'For a person' },
    { key: 'community', label: 'For a community' },
    { key: 'world', label: 'For the world' },
  ],
  // PBC is a supporting detail now, not the headline.
  pbcTitle: 'Built as a Public Benefit Corporation.',
  pbcBody:
    'We are incorporated as a Delaware Public Benefit Corporation, which gives our directors a duty to a stated public benefit and not to profit alone. In practice it means we do not farm attention, we do not broker your data, and the commitment is written into the charter so it outlasts any one of us.',
  studioTitle: 'Why we exist.',
  studioBody: [
    'Andiamo Tech started with a short list of tools we wished existed. The software for the things we cared about, getting around our county, teaching our kids, cutting through the noise, managing our own files, was either extractive, abandoned, or missing.',
    'So we built our own. Four products so far, each aimed at a problem people actually have, and each built to last.',
  ],
} as const;

export type Company = typeof COMPANY;
export type Patent = typeof PATENT;
