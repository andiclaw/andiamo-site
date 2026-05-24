# andiamo-site

The corporate website for **Andiamo Tech, Inc.** — the Delaware Public Benefit Corporation behind Velocity, Academy, Andiamo (mobility), and Pathfinder.

Lives at the `andiamo.tech` apex once DNS cuts over from the legacy Bubble.io app. See [`CUTOVER_PLAYBOOK.md`](./CUTOVER_PLAYBOOK.md).

## Stack

- Next.js 15 (App Router, `output: 'standalone'`)
- React 18 · TypeScript 5
- Tailwind CSS 3.4
- Postmark for the `/report` intake form (optional in dev)

No database. No auth. Static + edge-friendly.

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Hero · 4-product strip · patent badge · founder note · CTA |
| `/products` | All 4 products in detail with status badges and report links |
| `/about` | PBC explanation, location, what we own |
| `/patent` | US 12,567,119 B1 — summary + USPTO link |
| `/report` | Single intake → `support@andiamo.tech` (security / DMCA / takedown / bug / other) |
| `/privacy`, `/terms`, `/cookies` | Legal — corporate site scope only |

## Dev

```bash
npm install
npm run dev
# → http://localhost:3019
```

Without `POSTMARK_SERVER_TOKEN`, the `/report` API logs submissions instead of sending and returns `{ ok: true, dev: true }`.

## Env

| Var | Required | Purpose |
| --- | --- | --- |
| `POSTMARK_SERVER_TOKEN` | prod | Server token for transactional sends |
| `SUPPORT_TO_EMAIL` | optional | Override report destination (default `support@andiamo.tech`) |
| `SUPPORT_FROM_EMAIL` | optional | Override From: (default `noreply@andiamo.tech`) |

## Build & deploy

```bash
# Local prod build
npm run build && npm start

# Build the Docker image
docker build -t andiamo-site:dev .
docker run --rm -p 3019:3019 -e POSTMARK_SERVER_TOKEN=$POSTMARK_SERVER_TOKEN andiamo-site:dev
```

For Azure ACR + App Service deploy see [`CUTOVER_PLAYBOOK.md`](./CUTOVER_PLAYBOOK.md).

## Editing content

- **Products** (status, value prop, bullets, URLs, license line): [`src/lib/products.ts`](src/lib/products.ts)
- **Company name, patent, contact email**: [`src/lib/company.ts`](src/lib/company.ts)
- **Legal copy** (privacy/terms/cookies): [`src/lib/legal-docs.ts`](src/lib/legal-docs.ts) — bump `UPDATED_ISO` when you change anything

## Conventions

- **No third-party trackers.** No analytics, no ad pixels, no session replay. Cookie policy says zero cookies; keep it that way.
- **No CMS yet.** All content is in TypeScript. Add a CMS only if/when editing frequency justifies it.
- **Static labels for product status.** We do not ping live `/api/health` from the marketing site — too easy to false-red during deploys. Update `STATUS_LABEL` in `products.ts` when a product ships.

## Related MC tasks

| Task | Status | Notes |
| --- | --- | --- |
| [CC-1103](mc://CC-1103) | `lead_review` | This repo — scaffold + cutover. |
| [CC-1107](mc://CC-1107) | `completed` | Bundle ID rename `com.andiclaw.*` → `tech.andiamo.*` across all 4 sibling products (Velocity, Academy, Andiamo, Pathfinder). Done in the 2026-05-23 sweep. |
| [CC-1108](mc://CC-1108) | `queued` (Brendan) | Counsel review of LLC → Tech, Inc. PBC entity correction across all 3 SaaS legal docs. Must clear before any prod re-acceptance prompt ships. |

## License

UNLICENSED — proprietary to Andiamo Tech, Inc. The brand assets and copy are not for redistribution. The code itself may be opened later under MIT; ask first.
