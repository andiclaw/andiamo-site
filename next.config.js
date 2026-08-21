/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    // SITE-SEC-BASELINE-HEADERS-001 (F12). The storefront shipped four headers
    // and neither HSTS nor CSP. Measured live 2026-08-19 before changing
    // anything:
    //   apex + www          -> HTTPS 200, NO HSTS, NO CSP
    //   app/academy/velocity-> HTTPS 200, already max-age=31536000;
    //                          includeSubDomains, and their own CSP
    //   rides.              -> 000 (not provisioned yet; Brendan owns DNS+TLS)
    //   andiamo./sentinel./hub./mc./api. -> do not exist over http OR https
    //   http://andiamo.tech -> 301 to https already
    //
    // includeSubDomains is therefore SAFE: every subdomain that exists already
    // serves HTTPS, and no http-only subdomain exists to be broken by it. It is
    // also a small benefit for rides.andiamo.tech, which will be forced to
    // HTTPS from its first day.
    //
    // STAGED max-age, per the card. One day, not one year, for the FIRST
    // deployment: HSTS is a promise a browser remembers, so if anything about
    // the apex TLS or the www redirect chain is subtly wrong, a year-long
    // commitment makes the mistake last a year for every returning visitor.
    // RAMP TO 31536000 (matching the other three hosts) once the live apex has
    // been verified serving this correctly. See SITE-SEC-BASELINE-HEADERS-001.
    //
    // NO `preload`. Submission to the browser preload list is effectively
    // irreversible and is a deliberate decision for Brendan, not a side effect
    // of a header card.
    const HSTS_STAGED = 'max-age=86400; includeSubDomains';

    // The storefront loads NOTHING external: dependencies are next, react,
    // three and postmark (server-side only), and the only external URLs in src
    // are anchor hrefs. So every fetching directive can be 'self'.
    //
    // script-src keeps 'unsafe-inline' and it is load-bearing: these pages are
    // statically prerendered, so Next's inline bootstrap cannot carry a
    // per-request nonce, and the JSON-LD block is an inline script too. This
    // was proven the expensive way on the Rides app in
    // AND-SEC-CSP-TIGHTENING-001, where a nonce policy would have blanked every
    // prerendered page. Everything else is locked down: no external script
    // origin can be introduced, framing and plugins are refused outright, and
    // form submissions cannot leave the origin.
    const CSP = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "worker-src 'self' blob:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: HSTS_STAGED },
          { key: 'Content-Security-Policy', value: CSP },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
