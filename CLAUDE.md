
## Disk discipline (standing, fleet law — OPS-SCRATCH-DISCIPLINE-CLAUDEMD-001, 2026-08-23)
- Before ANY build, export, staging, or bulk-file step: `export TMPDIR=/Volumes/Scratch/tmp` (create it
  if absent). /private/var/folders on the boot disk is where the 306-file ENOSPC integrity incident
  happened — never stage bulk work there.
- Build outputs (.next, dist, cargo target, tauri target) go to /Volumes/Scratch (the ACA_BUILD_DIR
  pattern). Caches too: `npm_config_cache=/Volumes/Scratch/caches/npm`,
  `CARGO_TARGET_DIR=/Volumes/Scratch/caches/cargo-target` where applicable.
- Check `df -h /` BEFORE any operation that writes >1GB. STOP under 5G free and report, rather than
  starting an operation that can die mid-write.


## Token ledger (standing return protocol — OPS-TOKEN-LEDGER-001)
Every dispatch/return/review event writes ONE row to MC token_ledger:
`INSERT INTO token_ledger (seat,model,event,tokens_k,task_id) VALUES ('<seat>','<model>','dispatch|return|review', NN, '<CARD-ID>');`
plus the footer line `tokens: ~NNNk` in the return brief. Nothing more (scope fence: no triggers, no UI, no rollups).


## Standing fleet laws — the instrument family (ratified 08-07 → 08-23, landed 08-23)

**The family, in one line each. Every one was learned from a green result that was wrong:**
- A **guard** never observed to fire is not a control.
- A **test** that cannot fail is not a test.
- A **filter** never observed to match is not a measurement.
- A **clearance** from an instrument that cannot see the defect is not a clearance.
- A **control** whose pass and fail look identical is not a control.

### OPS-POSITIVE-CONTROL-RULE-001 — zero needs a positive control
Any result reported as ZERO / CLEAN / EMPTY / NO-MATCHES ships with **one row proven to match the
filter**. Show the query finding something before you report it finding nothing. *A filter that
matches nothing is indistinguishable from a clean result — both render as zero, and only a positive
control tells them apart.* Applies to coverage counts, audit queries, security scans, evidence
checks, image sweeps, and any close-out asserting an absence.

### OPS-CLEARANCE-MUST-MATCH-DEFECT-CLASS-001 — which pass cleared it, and could it see?
Any "cleared by a later pass" logic **must check WHICH pass and whether that pass could see that
defect class**. Mechanical clears and judgment clears are reported **separately and never merged**.
A scanner cannot clear a judgment finding; a judgment pass cannot clear a defect class it did not
examine. (Origin: 25 of 26 concealed CRITICALs were "cleared" by a scanner that checks em dashes and
answer-key membership and cannot know whether a question passage exists. The return itself said so —
and the query shape overrode the caveat silently. A true sentence in a brief cannot defend against a
join that ignores it.)

### OPS-F9-E3-STANDING-RULE-001 — authz / session / child-safety changes
Any change touching **authz, session or relationship checks, or child-safety detection** must ship a
behavior-level test **proven to FAIL against the pre-change code** (stash-and-run), and must get
**cross-model independent review before merge**. Mock-shape assertions are not coverage for these
classes. (Both CRITs shipped with fully green suites: the tests asserted the shape of a Prisma query
or the detector's own regex list, so **the test encoded the bug**.)

### OPS-CROSS-MODEL-REVIEW-ROUTE-001 — fail-closed reviewer route
The operative route is `shared/business-thread/CROSS-MODEL-REVIEW-ROUTE.md`. The lead, not the
author, dispatches one independent reviewer and records a durable verdict for the **exact current
base/head/diff**. `review-seat-r2` is mandatory for child-safety acceptance; `gpt-dev-build-2` may
review security-sensitive code only when its actual model family differs from every author. An author,
implementation contributor, or same-model-family seat cannot review the change. Absent, mismatched,
stale, or non-accept review blocks merge and close; capacity pressure escalates, never self-certifies.

### OPS-GATES-RUN-ALL-TARGETS-001 — gates must collect everything
Rust gates run `cargo clippy --all-targets` and `cargo test --all-targets`. Node gates run the
full-suite script, **never a bare glob** (`tests/*.test.ts` misses subdirectories, so fixes ship
untested behind a green suite — use `test:all`). **After adding a test, the suite total MUST MOVE**;
a flat total is a red flag, not a null result — assert the count.

### OPS-FLEET-BUILD-ETIQUETTE-001 — shared-machine builds
1. **Never run a build or push under a backgrounded or timeboxed command.** A killed build leaves a
   corrupt artifact directory and the next seat inherits a red gate it did not cause.
2. **Never build or push a repo another seat is actively building.** Coordinate or wait.
Joins the standing worktree etiquette: stage by explicit path, never `git add -A`, never `git stash`
in a shared worktree.

### OPS-CUSTODIAL-HANDLE-RULE-001 — write under your own handle
A lane acting **custodially** for an absent seat **labels itself** (`gpt-lead-for-r2`, or an
equivalent explicit custodial handle) — never as the absent seat, in the board, the ledger, or a
commit author field. Our close discipline rests on knowing who verified what, and an
independent-review verdict is worth exactly the independence of the reviewer.
