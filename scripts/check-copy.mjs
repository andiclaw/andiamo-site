#!/usr/bin/env node
/**
 * SITE-COPY-EMDASH-APEX-001 - house copy rule guard for the storefront.
 *
 * The apex <title> shipped an em dash on the company's top-level marketing
 * page. The repo source had already been corrected; the LIVE page had not,
 * because the site was undeployed. So this guard has two halves, and both
 * matter:
 *
 *   SOURCE  - scan src/ for em dashes so the rule cannot regress in the repo.
 *   LIVE    - `--live` fetches the real apex and checks what is actually being
 *             SERVED, because for this card the repo diff is not the evidence.
 *
 * Usage: node scripts/check-copy.mjs [--live]
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const EM_DASH = '—';
const SRC = 'src';
const EXTS = new Set(['.ts', '.tsx', '.md', '.json']);

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else if (EXTS.has(extname(p))) out.push(p);
  }
  return out;
}

const findings = [];
for (const file of walk(SRC)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (line.includes(EM_DASH)) findings.push(`${file}:${i + 1} em dash`);
  });
}

if (findings.length) {
  console.error(`Copy guard FAILED (${findings.length}):`);
  for (const f of findings) console.error(`- ${f}`);
} else {
  console.log(`Copy guard passed (source): no em dashes under ${SRC}/.`);
}

let liveFail = 0;
if (process.argv.includes('--live')) {
  const html = await fetch('https://andiamo.tech/').then((r) => r.text());
  const grab = (re) => (html.match(re) || [])[1] ?? null;
  const checks = {
    title: grab(/<title>([^<]*)<\/title>/i),
    'og:title': grab(/<meta[^>]+property="og:title"[^>]+content="([^"]*)"/i),
    'og:description': grab(/<meta[^>]+property="og:description"[^>]+content="([^"]*)"/i),
    description: grab(/<meta[^>]+name="description"[^>]+content="([^"]*)"/i),
  };
  console.log('\nLIVE apex:');
  for (const [k, v] of Object.entries(checks)) {
    if (v === null) { console.log(`  ${k}: (absent)`); continue; }
    const bad = v.includes(EM_DASH);
    if (bad) liveFail += 1;
    console.log(`  ${bad ? 'EM DASH' : 'ok     '} ${k}: ${v.slice(0, 90)}`);
  }
  if (liveFail) {
    console.error(`\n${liveFail} live tag(s) still serve an em dash.`);
    console.error('If source is clean, the site is UNDEPLOYED - the fix does not count until it ships.');
  }
}

process.exit(findings.length || liveFail ? 1 : 0);
