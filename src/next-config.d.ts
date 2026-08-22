/**
 * Ambient type for the plain-JS next.config.js so importing it from TypeScript
 * (src/security-headers.test.ts) is typed rather than implicit `any`.
 * SITE-SEC-BASELINE-HEADERS-001: keeps `tsc --noEmit` green.
 *
 * Only the surface the test uses is declared: the async `headers()` factory
 * Next calls to build the response-header groups.
 */
declare module '*/next.config.js' {
  interface NextHeaderEntry {
    key: string;
    value: string;
  }
  interface NextHeaderGroup {
    source: string;
    headers: NextHeaderEntry[];
  }
  const config: {
    headers: () => Promise<NextHeaderGroup[]>;
    [key: string]: unknown;
  };
  export default config;
}
