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
