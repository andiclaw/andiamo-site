---
title: Site bounded Rides slogan and missing-capture custody return
date: 2026-09-07
author: gpt-dev-build-2
audience: Main, Agent Lead, independent Claude reviewer
project: andiamo-site
status: lead_review requested, never done
---

## SUMMARY

Three production lines now use the owner-recorded Rides slogan, **Mobility with Meaning.**: canonical product data, ecosystem label, and the Rides metadata title (derived from canonical data). Existing JourneyHero and Home already consume these values. No hero reconstruction, page deletion, geometry, image, icon, pricing or business-model change.

Four Home interface previews remain **Interface illustration**, not screenshots. The new adjacent capture-provenance.json records 4/4 missing approved capture packets and the exact retained illustration bytes/source references. No current approved local demo capture packet was supplied; this is not an exhaustive claim that no demo exists. No source capture, new brand art, product authentication, customer access or provider request occurred. The absent brand directory and unreceived car original remain NEEDS_EVIDENCE, not invented assets.

## MC and exact custody

- Existing sole card SITE-HERO-3D-SWITCHER-001, in_progress at pickup, no dependencies, task-card link null, gpt-dev-build-2, exact visibleThreadId 01a000fc-58c1-72f3-8a89-41dd46cd61a0. Full description/comment read through read-only local MC. Claim operation VULCAN-RETURN-SITE-ROUTE-20260907-001. Worker requests lead_review; Lead must fresh-read and publish the transition, never done.
- Baseline a546775cf93bef48287fd023c1e5aee960cd47df / tree efdc6d7a6e757ff06dab0d54308d6a7c3cdc237f. Pablo's original branch/worktree remains untouched and clean, 0/0 after fetch.
- Source/test/manifest commit **0f7e708d89622fe7000f7ff3e90248218f817fa1**, tree **e5e62ad66941713c36251c6a7747d2a1d2619968**. This return is appended in a following evidence-only commit; final pushed tip is supplied in the Main/Lead packet, avoiding self-referential commit claims.
- Branch gpt-dev-build-2/SITE-HERO-3D-SWITCHER-001-20260907; new isolated worktree /Volumes/Scratch/codex-worktrees/site-hero-source-capture-20260907. Existing dependencies linked read-only; no installation. No second shared worker worktree. Lead approved attributed publication from its existing routing worktree.
- Primary Site main8986d1e24392d8242e11975c02675150b8747644 remains 0/0 with origin/main, unrelated .claude/launch.json and tsconfig.tsbuildinfo modified. No primary files/index changed.
- Shared primary main remains 0/1 with origin/main, six other-seat staged paths preserved: ops/reports/decisions/decision-list-2026-09-07.html; ops/reports/stripe-health-2026-09-06.md; pathfinder-agent-active-context/patches/2026-09-06-INTEGRATION-watcher-plus-seatbus.patch; 2026-09-06-appicon-match-canonical-brand.patch; 2026-09-06-appicon-on-integration.patch; 2026-09-07-appicon-on-integration.patch. Pathfinder patches are Pablo's custody; report authorship not independently resolved, so all are excluded.

## Source evidence

Exact CoFounder census read and SHA reverified: /Users/andiclaw/.codex/visualizations/2026/08/14/01a000fc-541f-7c11-959f-5ee072a82fd6/pf-site-owner-census-2026-09-07.md, SHA 5eed2410e7a4aa6878c0a5af435a142b63a52c0087a8e0704a52350e00b2b294. Its Source register and controls section, owner-word receipt and September 6 Rides directive were read. The latter records the exact slogan including its period. Missing companion filenames inferred during preflight were not treated as new authority; Lead supplied the authoritative census location/register.

Historical /Volumes/Scratch/site-space-final-evidence/source-custody.json was read, not rewritten. Its a546 source/build/browser evidence remains historical. No prior browser result, owner decision or independent acceptance is transferred to this amendment. Existing legacy PRODUCTS.capture fields are outside this Home capture remainder; they are not used as proof of genuine Home previews. Wider product-page claims and the full AND-RIDES-BRAND-LANDING-DIRECTIVE-001 remain uncompleted by this slice.

Paths below are relative to the task worktree, SHA-256 of exact source bytes:

| Path | SHA-256 |
|---|---|
| src/app/products/rides/page.tsx | 7c8814e61e69c01560ba0dd16e6549be97e50db9df0b8317575e751ce748cdda |
| src/lib/products.ts | 8373b28e5f2e2e64b24890ac36f1dea3ed112452481597e48ffc4a6a2e22e5e9 |
| src/components/ecosystem/ecosystem-apps.ts | 5e3b5492966577708eaed8274eaa17fa8ec7a7c92c5e6979a2a687cdf246e527 |
| src/components/constellation/constellation.test.ts | 50e9fd734720265bee1ea8b8cb2b21a2f62f13e33bde26fe0f319888d32c94ca |
| src/components/constellation/orbital.test.ts | 4ffb8fe414e62688164f604aa7d154d0e8fd83cf8f8c6cd1df29a8725e27db1f |
| src/components/constellation/source-capture.test.ts | 884be2cba4c7a11314e22200ffe316f3343976316e2cb3964ed85f00c628cc08 |
| src/components/constellation/capture-provenance.json | 0ed58be17a9bdac39fa04a4eabcd862096d96fcbc22ba4929f46101714035a52 |

## Tests and observed controls

All runs local/offline, no cache-heavy build. Commands run in task worktree unless noted:

```sh
node node_modules/vitest/vitest.mjs run src/components/constellation/source-capture.test.ts --no-cache --maxWorkers=1 --minWorkers=1 -t 'exact owner slogan|same slogan|server renders the slogan'
node node_modules/vitest/vitest.mjs run --no-cache --maxWorkers=1 --minWorkers=1
node node_modules/typescript/bin/tsc --noEmit --incremental false
node scripts/check-copy.mjs
git diff --check
git diff --cached --check
```

- Fail-first BEFORE source edits on exact a546 bytes: selected four tests executed, **4 failed**, 5 other new tests excluded by selection. Failures respectively observed old canonical tagline, old ecosystem tagline, old metadata title, and real server-rendered old Rides node text. Ordinary assertion failures, not it.fails/expected-fail annotations.
- Current full automatic discovery: **5 files / 50 unique tests pass, 0 skipped** = 41 existing + 9 new. Two existing literal expectations updated for the owner-superseded wording; canonical-data substitution control strengthened to include metadata title. Existing behavior tests retained.
- Fresh baseline replay in the preserved original a546 worktree with --no-cache: **4 files / 41 tests pass**, original worktree stays clean. This is newly rerun unit evidence, distinct from historical browser measurements.
- New permanent controls execute actual product/ecosystem modules, transpiled actual page metadata with closed imports, and React server rendering of actual Constellation. They verify slogan in node and disclosure, existing beta label, and exactly four honest illustration labels.
- Missing-capture register control verifies all four exact assets/source records against current Home data and file hashes. Known-good register passes; omitted/duplicated product, substituted hash/path/source commit, relabeled screenshot, invented receipt and false CAPTURED state each make the verifier fail. This verifies this explicit missing-evidence register, not a general-purpose capture approval system.
- TypeScript ran independently exit0 with incremental=false (no tracked tsbuildinfo write); copy guard exit0; unstaged/staged diff checks exit0.
- Scoped lint is **unmeasured**: no checked-in ESLint configuration or dependency exists, matching the baseline's disclosed lint-config gap. No interactive next lint setup or dependency installation was attempted.
- No new browser screenshot, WebGL/DPR/layout/overflow/focus measurement, LCP/CLS/FPS distribution or real build result is claimed. Server-rendered markup is not rendered desktop/mobile visual approval.

## Preservation, residuals, rollback and route

Exact Git diff against a546 proves public assets, home-products.ts, company motto, Home page/Why sections, worlds/scene/CSS and relocated JourneyHero unchanged. Existing purpose/geometry tests pass. No Explorer, CC-797, Velocity or other-product changes. Site source checkout added less than a few MiB; Scratch remains approximately 11 GiB free, Data20 GiB. No heavy slot allocated or used. No full build, local server, export, deploy, canonical merge, DB/product mutation, credential, customer, account, spend or outbound action.

Residual: four genuine app captures require an approved synthetic local demo/build/route packet and privacy review; the exact attached brand originals/car remain missing. World form remains the existing disclosed interpretation, not newly approved by owner. Independent Claude review and exact-tip owner visual approval remain required. Same-family worker validation is provisional; do not treat the bounded copy fix as full hero or brand acceptance.

Rollback: revert the source/test commit on a separately authorized branch; archive this appended evidence only if desired. No live state or data rollback exists. Do not revert or replace the original candidate, historical evidence or other-seat dirt. Return lead_review through Lead's approved attributed publication/MC contract; do not self-close.

NEXT_ROUTE=Main/Agent Lead -> independent Claude review of exact new tip; then separately authorized capture/brand-master and owner visual gates. No self-dispatch.

Model: role contract requests GPT-5.6 Terra; actual runtime model identifier is not exposed here and is not independently asserted. tokens: approximately 20k for this bounded return (estimate, not provider metering); Lead may record the attributed return ledger row through its approved metadata route.
