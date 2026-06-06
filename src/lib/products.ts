export type ProductStatus = 'live' | 'beta' | 'building' | 'soon';

export interface Product {
  key: 'velocity' | 'academy' | 'andiamo' | 'pathfinder';
  name: string;
  tagline: string;
  valueProp: string;
  bullets: string[];
  url: string;
  status: ProductStatus;
  accent: string; // hex
  licenseLine: string;
  audience: string;
  /** How the product helps at three scales. Drives the impact section. */
  impact: { person: string; community: string; world: string };
}

export const PRODUCTS: Product[] = [
  {
    key: 'velocity',
    name: 'Velocity',
    tagline: 'Trend intelligence the moment a story breaks.',
    valueProp:
      'A real-time intel feed that scores momentum across security, markets, news, weather, and your own watchlists, so you see a story closer to minute one than hour six.',
    bullets: [
      '43 sources refreshed every 15 minutes',
      '0–100 composite score per story (volume, reach, recency, trust)',
      'Personal radar, watchlists, push alerts',
      'API + MCP + SDK for the agents that work for you',
    ],
    url: 'https://velocity.andiamo.tech',
    status: 'live',
    accent: '#22D3EE',
    licenseLine: 'Closed source · subscription tiers from $0/mo',
    audience: 'Traders, security teams, founders, journalists, and AI agents.',
    impact: {
      person: 'Cuts through the noise so you act on what matters instead of doomscrolling for it.',
      community: 'Gives local teams and newsrooms an early read on threats, weather, and emergencies in their area.',
      world: 'Shortens the gap between a signal breaking and the people who need it being able to respond.',
    },
  },
  {
    key: 'academy',
    name: 'Academy',
    tagline: 'Homeschool, compliant in every state.',
    valueProp:
      'A learning platform that handles the regulatory side of homeschooling: 50-state requirements, recordkeeping, assessment prep, and progress reports, so families can spend more time on the kids and less on the paperwork.',
    bullets: [
      '51-state compliance catalog (and growing)',
      'Per-student lessons, assignments, and milestones',
      'Standardized test prep aligned to state requirements',
      'Parent reports + portfolio export at the click of a button',
    ],
    url: 'https://academy.andiamo.tech',
    status: 'live',
    accent: '#8B5CF6',
    licenseLine: 'Closed source · per-family subscription',
    audience: 'Homeschool parents, microschools, and tutoring co-ops.',
    impact: {
      person: 'Gives a parent back the hours that compliance paperwork used to eat, so they can teach.',
      community: 'Lets microschools and co-ops run by the book without hiring an administrator to do it.',
      world: 'Makes a rigorous, lawful education reachable for families the traditional system leaves behind.',
    },
  },
  {
    key: 'andiamo',
    name: 'Andiamo',
    tagline: 'Mobility, settled on rails the patent covers.',
    valueProp:
      'A zone-mobility platform where riders post trips, operators bid, and a smart contract splits each fare across the operator, the city, a helper fund for subsidized rides, and platform maintenance.',
    bullets: [
      'Patent-protected smart-contract bid architecture (US 12,567,119 B1)',
      'Dual rails: pay with card or with the native ATS token',
      'Built-in helper program for verified low-income riders',
      'Web2 by default, dApp-ready when you bring your own wallet',
    ],
    url: 'https://app.andiamo.tech',
    status: 'building',
    accent: '#22C55E',
    licenseLine: 'Closed source · open API once GA',
    audience: 'Riders, fleet operators, transit authorities, and cities.',
    impact: {
      person: 'Gets someone without a car to work, school, or the doctor, with a fare they can actually afford.',
      community: 'Keeps a share of every fare in the city of origin and funds subsidized rides for neighbors who need them.',
      world: 'Shows mobility can be settled fairly and transparently, with equity built into the payment rails rather than bolted on.',
    },
  },
  {
    key: 'pathfinder',
    name: 'Pathfinder',
    tagline: 'A premium file manager for the Mac.',
    valueProp:
      'A native macOS file manager (Tauri + Rust) for people who spend their day in the filesystem: dual-pane, tabs, command palette, live folder-watch, git status, agent detection, and an integrated code editor.',
    bullets: [
      'Tabs, dual-pane, command palette, Quick Look (⌥Space)',
      'Live folder-watch with +/- diffs and per-file git status',
      'Smart tagger, folder-size heatmap, file diff/compare',
      'Detects active Claude Code / Codex / OpenClaw / MCP sessions',
    ],
    url: 'https://github.com/andiclaw/pathfinder',
    status: 'beta',
    accent: '#F59E0B',
    licenseLine: 'Open source · MIT',
    audience: 'Developers, power users, and anyone who Finder has let down.',
    impact: {
      person: 'Gives anyone who lives in their files a faster, calmer way to find and manage them.',
      community: 'Ships free and open source, so any developer can use it, learn from it, or build on it.',
      world: 'Adds a capable, privacy-respecting tool to the commons instead of locking it behind a paywall.',
    },
  },
];

export const STATUS_LABEL: Record<ProductStatus, string> = {
  live: 'Live',
  beta: 'Beta',
  building: 'Building',
  soon: 'Coming soon',
};

export const STATUS_COLOR: Record<ProductStatus, string> = {
  live: '#22C55E',
  beta: '#F59E0B',
  building: '#3B82F6',
  soon: '#94A3B8',
};

export function getProduct(key: Product['key']): Product {
  const p = PRODUCTS.find((x) => x.key === key);
  if (!p) throw new Error(`Unknown product: ${key}`);
  return p;
}
