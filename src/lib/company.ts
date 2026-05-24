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

export type Company = typeof COMPANY;
export type Patent = typeof PATENT;
