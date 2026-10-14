# Homepage UI capture custody (draft, 2026-09-26)

The homepage deliberately shows four `NEEDS_EVIDENCE` slots, not images. The owner asked for real product UI, but no approved packet in this task binds a source build, exact route, synthetic fixture, privacy review and final image hash. The 2026-09-07 site handoff explicitly says the prior four Home previews were interface illustrations and that the legacy `PRODUCTS.capture` filenames were not proof of genuine Home captures. That finding is a scope limit, not evidence that no genuine image can ever be supplied.

| Product | Current Home state | Source build/route | Fixture and privacy | Approved image SHA-256 |
|---|---|---|---|---|
| Academy | NEEDS_EVIDENCE | Missing | Synthetic family only, no real child name, face or family data; review missing | Missing |
| Velocity | NEEDS_EVIDENCE | Missing | Public or synthetic route evidence missing | Missing |
| Rides | NEEDS_EVIDENCE | Missing | Closed-beta synthetic route evidence missing | Missing |
| Pathfinder | NEEDS_EVIDENCE | Missing | Synthetic local workspace evidence missing | Missing |

The existing `public/brand/captures/*.jpg` files remain unchanged and are **not** used by this Home. A byte inventory of the three legacy JPEGs examined, which does not confer approval:

| Legacy file | SHA-256 |
|---|---|
| `public/brand/captures/academy.jpg` | `885aab67d5a2087a9117bf6ca0d1131f2bcd4e087fa648a21a5b76159e75259a` |
| `public/brand/captures/velocity.jpg` | `cadeca67d7592d7c404a2012e1952e12ff226cedd75c0225fc97f794a00cc551` |
| `public/brand/captures/andiamo.jpg` | `069f714160c2dd49311d9a92e78e8f488a827d282b431543090f1d6ad426eb3d` |

To replace a slot, a separate capture packet must identify the exact product repository commit and build, route and viewport, fixture identity, privacy review (especially Academy), final file bytes/hash and reviewer acceptance. No product account, customer data, live capture, generation or image mutation was used for this draft.

## 2026-10-14: the closer look shows the app-page captures (SITE-HOME-FEEDBACK-1008-002 item 6)

Brendan asked on 2026-10-08 (round 3, item 6) for "A closer look" to use the updated screenshots. The home now shows the same three captures the app pages have used since SITE-HOME-FEEDBACK-1008-001 Part B. Each is a capture of the app's own PUBLIC home page (no account, no customer data), at 1440 by 900, taken 2026-10-08, with its source in `src/lib/app-pages.ts`. Academy's page shows two sample children from its own public marketing page, not a family's data. Pathfinder has no capture: release 1.3.7 is unsigned and unpublished, and its card says so.

| Capture | SHA-256 |
|---|---|
| `public/products/academy/home-1440.png` | `d1e495c2f8508b7e0caecc268b45b20f471aa007cda60c6980b13df50e16e243` |
| `public/products/velocity/home-1440.png` | `9e582324909d75d5b2a3e9e9a3a9d0235bddef9e5ae7aa38a7f3ba14d8fbec2c` |
| `public/products/andiamo/home-1440.png` | `455b649c0a3486f50c549937d0ebd4e04676823da63c81b0e0c0aabea372d928` |

The legacy `public/brand/captures/*.jpg` files above remain unapproved and unused. Reviewer acceptance of these three captures on the home: pending (R1 in Chrome, R2 on the claims).
