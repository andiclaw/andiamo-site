# andiamo.tech Apex Cutover Playbook

**Status:** DRAFT — do not execute DNS flip without explicit Brendan approval.
**Last updated:** 2026-05-23

**Related MC tasks:**
- [CC-1103](mc://CC-1103) — this repo (scaffold + cutover)
- [CC-1107](mc://CC-1107) — **completed** — bundle ID rename `com.andiclaw.*` → `tech.andiamo.*` across the 4 sibling products
- [CC-1108](mc://CC-1108) — **queued (Brendan)** — counsel review of LLC → Andiamo Tech, Inc. PBC entity correction across all 3 SaaS legal docs (privacy/terms/cookies). Should clear before this site is hit by users who will read the corporate identity here vs the product legal pages there.

## What we're cutting over

| Item | From | To |
| --- | --- | --- |
| `andiamo.tech` apex | Cloudflare proxy → Bubble.io app (`x-bubble-perf` headers, `andiamo-97554_live_u2main` cookies) | Azure App Service `andiclaw-prod-andiamo-site` running this Next.js repo |
| `www.andiamo.tech` | (currently same Bubble) | Same App Service (redirect to apex) |

**Not changed:** every subdomain stays exactly where it is.
- `app.andiamo.tech` → Andiamo mobility app (Azure App Service `andiclaw-prod-andiamo`)
- `velocity.andiamo.tech` → Velocity App Service
- `academy.andiamo.tech` → Academy App Service

## Pre-flight (do these in order)

### 1. Repo + image
- [ ] `npm run typecheck && npm run lint && npm run build` clean locally
- [ ] `docker build -t andiclawprodacr.azurecr.io/andiamo-site:0.1.0 .`
- [ ] `az acr login -n andiclawprodacr`
- [ ] `docker push andiclawprodacr.azurecr.io/andiamo-site:0.1.0`

### 2. App Service (Brendan, via Azure portal or CLI)
- [ ] Create `andiclaw-prod-andiamo-site` Linux App Service on the existing `andiamo-prod` P1v3 plan
- [ ] Set container image: `andiclawprodacr.azurecr.io/andiamo-site:0.1.0`
- [ ] Required app settings:
  - `POSTMARK_SERVER_TOKEN` → KV reference (`@Microsoft.KeyVault(...)`)
  - `SUPPORT_TO_EMAIL` = `support@andiamo.tech` (optional override)
  - `WEBSITES_PORT` = `3019`
  - `WEBSITES_ENABLE_APP_SERVICE_STORAGE` = `false`
- [ ] Identity → System-assigned managed identity ON, granted `AcrPull` on the registry + `get` on the relevant Key Vault secret
- [ ] After firewall hits a new outbound IP, add to PG firewall (matters for any future DB binding — none today)

### 3. Staging custom domain (test BEFORE flipping apex)
- [ ] Add a staging custom hostname: `new.andiamo.tech` (or `staging.andiamo.tech`)
- [ ] Add `CNAME new → andiclaw-prod-andiamo-site.azurewebsites.net` in DNS
- [ ] Add Azure-managed TLS cert + bind
- [ ] Visit `https://new.andiamo.tech` and verify:
  - [ ] `/` renders hero, 4 product cards, patent strip, founder note, CTA
  - [ ] `/products` shows all 4 products with correct status badges
  - [ ] `/about` renders without console errors
  - [ ] `/patent` shows correct number + USPTO link works
  - [ ] `/report` form submits successfully end-to-end → confirm email lands in `support@andiamo.tech`
  - [ ] `/privacy`, `/terms`, `/cookies` render
  - [ ] `/sitemap.xml` and `/robots.txt` serve correctly
  - [ ] Lighthouse: Perf > 90, A11y > 95, SEO > 95 on mobile
  - [ ] No mixed-content warnings; no console errors
- [ ] Run an external scan (e.g. observatory.mozilla.org) and confirm A+ grade

### 4. Content review with Brendan
- [ ] Walk through every page with Brendan; confirm copy, status badges, founder quote
- [ ] Get explicit "ship it" — written in chat or commit message

## DNS cutover (only after pre-flight is green)

### Before
Record DNS state:
```bash
dig andiamo.tech +short
dig www.andiamo.tech +short
# Save output to shared/2026-XX-XX-andiamo-tech-dns-before.txt
```

### The flip
**In Cloudflare (or wherever DNS lives):**

1. Change `andiamo.tech` A/AAAA/CNAME record from the Bubble origin to the App Service.
   - Azure-recommended approach: `ALIAS andiamo.tech → andiclaw-prod-andiamo-site.azurewebsites.net` (if registrar supports ALIAS/ANAME), otherwise hard A record to the App Service inbound IP.
   - **Lower TTL to 300s at least 24h BEFORE** the flip so rollback is fast.

2. Change `www.andiamo.tech` CNAME the same way.

3. In Azure App Service, add `andiamo.tech` and `www.andiamo.tech` as custom hostnames; bind Azure-managed cert; configure HTTPS redirect.

### After (within 15 minutes)
- [ ] `curl -sI https://andiamo.tech` returns 200 with `x-powered-by` absent (we strip it) and no `x-bubble-perf`
- [ ] Hero loads; click `/products`; submit a test report
- [ ] `dig andiamo.tech +short` resolves to App Service IP
- [ ] Cert is valid (no warnings)

### After (within 24h)
- [ ] Web Archive snapshot of homepage filed
- [ ] Search Console: submit new sitemap, request re-index
- [ ] Inspect server logs for 4xx/5xx surge

## Rollback

Keep the Bubble origin warm for **7 days** post-cutover.

```bash
# Revert DNS — exact opposite of the flip
# Apex → original Cloudflare IPs (104.16.x / 104.19.x, see before-snapshot)
# www → original Cloudflare CNAME target
```

If rollback is needed:
1. Flip DNS back (5 min)
2. Wait one TTL window (300s)
3. Verify Bubble app responds
4. Post-mortem before re-attempt

## Day-30 cleanup

- [ ] Take the Bubble app to read-only / archive
- [ ] Cancel the Bubble subscription if no longer needed
- [ ] Update the shared `ecosystem-apps-public.ts`:
  - `andiamo` entry's `href` → `https://app.andiamo.tech` (mobility app)
  - Add new `andiamo-tech` corporate entry pointing at `https://andiamo.tech`
- [ ] Re-vendor the updated registry into the 3 SaaS app repos via each repo's `vendor:mailer` / equivalent re-vendor flow (the per-app `app-switcher-dark.tsx` + `ecosystem-apps.ts` are vendored from `shared/`).

## Risk register

| Risk | Mitigation |
| --- | --- |
| DNS propagation slow → split-brain users | TTL lowered to 300s 24h prior; rollback ready |
| App Service cold start spikes | P1v3 plan + Always On enabled; pre-warm before flip |
| Postmark not configured → /report 503s | App setting `POSTMARK_SERVER_TOKEN` validated during pre-flight |
| Lost SEO juice from Bubble redirects | 301 redirect map authored from a crawl of the live Bubble site (TODO before cutover) |
| Cert provisioning lag (Azure-managed cert can take ~15 min) | Bind on staging hostname first; reuse cert flow |
| Bubble cookies linger in browsers | Harmless — they will not be sent to the new origin (different cookie scope) |

## Who signs off

- **Technical readiness:** Claude (assistant) — confirms checklists pass
- **Content / brand:** Brendan
- **Go / no-go on flip:** Brendan only

## Contact for cutover-day issues

`support@andiamo.tech` — but if the form is down, email Brendan directly.
