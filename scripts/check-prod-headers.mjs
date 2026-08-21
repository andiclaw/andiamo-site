#!/usr/bin/env node
/**
 * SITE-SEC-BASELINE-HEADERS-001 - production header check for apex, www and app.
 *
 * The card requires the check to run against PRODUCTION, because a header is a
 * deploy artifact: it can be correct in next.config.js and absent from the live
 * response for as long as the site goes undeployed. This script is the thing
 * that tells the truth about what is actually being served.
 *
 * Usage:  node scripts/check-prod-headers.mjs [--json]
 * Exit:   0 all required headers present · 1 something is missing
 */
const HOSTS = ['andiamo.tech', 'www.andiamo.tech', 'app.andiamo.tech'];

const REQUIRED = [
  'strict-transport-security',
  'content-security-policy',
  'x-content-type-options',
  'x-frame-options',
  'referrer-policy',
];

async function headersFor(host) {
  const res = await fetch(`https://${host}/`, { redirect: 'follow' });
  const out = {};
  for (const [k, v] of res.headers) out[k.toLowerCase()] = v;
  return { status: res.status, headers: out };
}

const results = [];
let failures = 0;

for (const host of HOSTS) {
  try {
    const { status, headers } = await headersFor(host);
    const missing = REQUIRED.filter((h) => !headers[h]);
    if (missing.length) failures += 1;
    results.push({ host, status, missing, hsts: headers['strict-transport-security'] ?? null });
  } catch (err) {
    failures += 1;
    results.push({ host, status: 0, missing: REQUIRED, error: String(err?.message ?? err) });
  }
}

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(results, null, 2));
} else {
  for (const r of results) {
    const state = r.missing.length === 0 ? 'OK  ' : 'MISS';
    console.log(`${state} ${r.host} (${r.status})${r.missing.length ? ` missing: ${r.missing.join(', ')}` : ''}`);
    if (r.hsts) console.log(`       HSTS: ${r.hsts}`);
  }
}

if (failures > 0) {
  console.error(`\n${failures} host(s) missing required headers.`);
  console.error('If next.config.js already sets them, the site is UNDEPLOYED, not misconfigured.');
  process.exit(1);
}
console.log('\nAll required headers present on all hosts.');
