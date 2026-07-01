/**
 * andiamo.tech App Stack, App Registry (canonical roster).
 *
 * Mirrors academy's ACA-APPSWITCHER-REVISE-001 registry: the 3 public products
 * (Academy, Velocity, Andiamo). AndiHub is internal-only and intentionally
 * excluded. This is the apex company site, so the switcher's job is to let a
 * visitor jump to a product; the andiamo.tech company link is the current site
 * and renders as the active item.
 *
 * Resolution order for each app's href:
 *   1. NEXT_PUBLIC_APP_URL_{KEY} env var (e.g. NEXT_PUBLIC_APP_URL_VELOCITY)
 *      for staging/preview deploys.
 *   2. Production HTTPS URL.
 *   3. LAN-host fallback when NEXT_PUBLIC_USE_LAN_SWITCHER=1 is set.
 */

const LAN_HOST = process.env.NEXT_PUBLIC_SWITCHER_LAN_HOST || '192.168.1.101';
const USE_LAN = process.env.NEXT_PUBLIC_USE_LAN_SWITCHER === '1';

function resolveHref(key: 'VELOCITY' | 'ACADEMY' | 'ANDIAMO', prodUrl: string, port: number): string {
  const override = process.env[`NEXT_PUBLIC_APP_URL_${key}`];
  if (override) return override;
  if (USE_LAN) return `http://${LAN_HOST}:${port}`;
  return prodUrl;
}

export interface EcosystemApp {
  key: string;
  title: string;
  tagline: string;
  href: string;
  port: number;
  icon: string;
  accentColor: string;
  status: 'active' | 'building' | 'queued';
}

export const ecosystemApps: EcosystemApp[] = [
  {
    key: 'academy',
    title: 'Academy',
    tagline: 'From Sparks to Stars',
    href: resolveHref('ACADEMY', 'https://academy.andiamo.tech', 3006),
    port: 3006,
    icon: 'A',
    accentColor: '#6330FF',
    status: 'active',
  },
  {
    key: 'velocity',
    title: 'Velocity',
    tagline: 'Trend intelligence',
    href: resolveHref('VELOCITY', 'https://velocity.andiamo.tech', 3003),
    port: 3003,
    icon: 'V',
    accentColor: '#22D3EE',
    status: 'active',
  },
  {
    // The Andiamo mobility product is branded "Go" on its own surfaces; the
    // parent company / ecosystem stays Andiamo (this apex site).
    key: 'andiamo',
    title: 'Go',
    tagline: 'Community mobility',
    href: resolveHref('ANDIAMO', 'https://app.andiamo.tech', 3007),
    port: 3007,
    icon: 'G',
    accentColor: '#22C55E',
    status: 'active',
  },
];
