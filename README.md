# jhorlin.com — Live Resume

Single-page resume. One typed content module (`src/content/resume.ts`,
Zod-validated) renders both the site and the downloadable PDF, so they can
never drift. Chat is skillfaber's embeddable widget — no servers in this repo.

## Stack

Vite · React 19 · Tailwind v4 · shadcn/ui · @react-pdf/renderer · SST v3
(S3 + CloudFront) · CloudWatch RUM (optional) · Vitest · Playwright

## Commands

| Command            | What it does                                  |
| ------------------ | --------------------------------------------- |
| `npm run dev`      | Vite dev server (serves https://localhost:8443 with self-signed certs in gitignored `.certs/`; falls back to HTTP when certs absent; `NO_HTTPS=1` forces plain HTTP — used by e2e) |
| `npm run build`    | PDF → typecheck → production bundle           |
| `npm test`         | Vitest unit suites                            |
| `npm run test:e2e` | Playwright smoke (builds + serves preview)    |
| `npx sst deploy --stage dev` | Deploy dev stage                    |
| `npx sst deploy --stage production` | Deploy production            |

## Configuration (.env — see .env.example)

- `VITE_SKILLFABER_WIDGET_SRC` / `VITE_SKILLFABER_WIDGET_TOKEN` — chat widget
  (dev server); `SKILLFABER_WIDGET_SRC` / `SKILLFABER_WIDGET_TOKEN` feed the
  same values through SST at deploy time. Token absent → no widget, no error.
- `RESUME_DOMAIN` — set to `jhorlin.com` to attach the custom domain.
- `ENABLE_RUM=true` — provision CloudWatch RUM + Cognito guest identity.

## Domain flip (jhorlin.com)

**Verified state — 2026-08-20**

| Item | State |
|---|---|
| Route 53 hosted zone | ✅ `jhorlin.com` → `Z07750323T7G55ZH73TOL` (account 690429826899) |
| ACM certificate | ⏳ `PENDING_VALIDATION` — `jhorlin.com` + `*.jhorlin.com`, created manually, unused |
| **Nameserver delegation** | ❌ **still No-IP** (`ns1-5.no-ip.com`) — this is the blocker |
| Live site | `https://d2vg337n62dalh.cloudfront.net` (no custom domain) |

The zone is authoritative for nobody yet: the world still resolves
`jhorlin.com` through No-IP, so the ACM validation CNAME sitting in Route 53
is invisible to ACM and the certificate will never validate. **Do not set
`RESUME_DOMAIN` until delegation moves** — `sst deploy` will hang waiting on
validation.

### Records that must survive the cutover

Currently served by No-IP and **absent from the Route 53 zone**:

| Hostname | Value | Notes |
|---|---|---|
| `jhorlin.com` | `104.51.180.232` | home IP; intentionally replaced by the CloudFront alias |
| `home.jhorlin.com` | `104.51.180.232` | **dynamic DNS** — breaks on cutover |
| `print.jhorlin.com` | `34.198.182.201` | **dynamic DNS** — breaks on cutover |
| `MX` | `5 mail.jhorlin.com` | target has no A record; already non-functional |

Route 53 dynamic updates are not automatic. Pick one before flipping:

- **CNAME to the No-IP hostname** (recommended) — keep the No-IP dynamic
  hostname (e.g. `something.ddns.net`) updating as it does today and point
  `home`/`print` at it with CNAMEs. No new moving parts.
- **Route 53 updater** — a small client/Lambda calling
  `route53 change-resource-record-sets` when the WAN IP changes.
- **Drop them** — if the hostnames are no longer used.

### Cutover order

1. Pre-stage `home`, `print`, and any MX records in the Route 53 zone so
   nothing breaks the moment delegation moves.
2. At the No-IP registrar, set the nameservers to this zone's four:
   `ns-78.awsdns-09.com`, `ns-636.awsdns-15.net`,
   `ns-1198.awsdns-21.org`, `ns-1867.awsdns-41.co.uk`.
3. Wait for propagation, then confirm:
   `dig +short NS jhorlin.com @8.8.8.8` returns the AWS nameservers.
4. ACM validates on its own within minutes once Route 53 answers.
5. Uncomment `RESUME_DOMAIN=jhorlin.com` in `.env`.
6. `npx sst deploy --stage production` — SST provisions its own DNS-validated
   certificate plus alias records for `jhorlin.com` and the `www` redirect.
   (The manual wildcard cert above is not used by SST; delete it afterward or
   keep it for other subdomains.)

## Content updates

Edit `src/content/resume.ts`; `npm test` validates it; `npm run build`
regenerates the PDF. `content-sources/` is local-only source material and
must never be committed.

## Known issues

- **Chat widget on external origins:** skillfaber's `api.skillfaber.com` currently sends `frame-ancestors 'none'`, so the widget iframe is blocked outside skillfaber.com. Fix lands in the skillfaber repo (CSP allow-list for this site's origins); the site degrades gracefully to a static resume meanwhile.
