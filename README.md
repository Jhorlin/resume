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

## Domain flip (after the No-IP → Route 53 transfer completes)

1. Decide the DNS strategy FIRST: `home.jhorlin.com` / `print.jhorlin.com`
   are dynamic-DNS hostnames on No-IP Plus Managed DNS. If DNS stays on
   No-IP nameservers, do NOT proceed — the custom domain requires the Route
   53 zone to be authoritative.
2. Confirm the registrar transfer finished (No-IP ticket #1065257) and the
   `jhorlin.com` hosted zone exists in the glk AWS account (690429826899).
3. Move nameserver delegation to the Route 53 zone (recreate any needed
   records there first, including replacements for the dynamic-DNS
   hostnames). ACM certificate DNS validation will hang indefinitely if
   delegation still points at No-IP.
4. In `.env`, uncomment `RESUME_DOMAIN=jhorlin.com`.
5. `npx sst deploy --stage production` — SST provisions the ACM cert (DNS
   validation) and alias records for `jhorlin.com` + `www` redirect.

## Content updates

Edit `src/content/resume.ts`; `npm test` validates it; `npm run build`
regenerates the PDF. `content-sources/` is local-only source material and
must never be committed.

## Known issues

- **Chat widget on external origins:** skillfaber's `api.skillfaber.com` currently sends `frame-ancestors 'none'`, so the widget iframe is blocked outside skillfaber.com. Fix lands in the skillfaber repo (CSP allow-list for this site's origins); the site degrades gracefully to a static resume meanwhile.
