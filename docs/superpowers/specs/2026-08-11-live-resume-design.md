# Live Resume — Design

**Date:** 2026-08-11
**Status:** Approved pending user review
**Repo:** `~/projects/resume` (fresh)

## Goal

A live resume site at **jhorlin.com** for two audiences: recruiters/hiring
managers (30-second skim, PDF download, contact) and personal-brand visitors
(the site itself demonstrates craft — typed content pipeline, IaC deploy,
embedded AI chatbot). The chatbot answers questions about Jhorlin's experience,
backed by skillfaber's embeddable widget.

## Stack (decided)

- **Frontend:** Vite + React 19 + Tailwind CSS v4 + shadcn/ui, TypeScript strict
- **Infra:** SST v3 — single `StaticSite` (S3 + CloudFront + ACM + Route 53)
- **PDF:** `@react-pdf/renderer` at build time
- **Chat:** skillfaber embeddable widget (script tag, publishable token)
- **Analytics:** CloudWatch RUM

## Architecture

```
┌─ this repo ─────────────────────────────────┐
│  src/content/resume.ts  ← single source     │
│    ├→ single-page SPA (site)                │
│    └→ scripts/build-pdf.tsx → public/*.pdf  │
│  index.html ← skillfaber embed.js + token   │
│  sst.config.ts → StaticSite + RUM           │
└─────────────────────────────────────────────┘
Chat rides skillfaber's existing prod infra — no servers here.
```

## Content model

`src/content/resume.ts` exports typed data; everything renders from it:

- `profile` — name, headline, location, links (GitHub, LinkedIn), contact
- `highlights` — 3–4 skim bullets for the top of the page
- `experience[]` — role, company, dates, achievement bullets
- `projects[]` — name, description, outcomes, tech, links (skillfaber featured)
- `skills` — grouped by category

Seed content: `JhorlinResume.docx` (Gmail, sent 2024-01-22, thread
"Jhorlin Resume" — user downloads it into the repo), then updated with
2024–2026 work. Current role: **Architect II at PDI Technologies** (PDIQ is
his current job's flagship work); **skillfaber** is his independent side
venture. A Zod schema validates the content module.

Featured credentials (both in `projects[]` and their `experience[]` entries):

- **PDIQ (PDI Technologies — current role, Architect II)** — enterprise RAG
  assistant on AWS, co-authored AWS ML Blog post ([link](https://aws.amazon.com/blogs/machine-learning/how-pdi-built-an-enterprise-grade-rag-system-for-ai-applications-with-aws/),
  byline: Jhorlin De Armas, PDI Architect II). Serverless ingestion
  (EventBridge/Lambda/ECS crawlers for Confluence, SharePoint, Azure DevOps,
  web), Aurora PostgreSQL vectors, Bedrock (Nova + Titan Embeddings V2).
  Quantified: summary-prepended chunking raised answer approval 60% → 79%.
- **Skillfaber** — AI agent factory on Bedrock (SST v3, React 19): roles,
  RAG knowledge bases, serverless MCP skills, embeddable widget — the same
  widget powering this site's chatbot (self-referential proof).

## Site structure

Single scrolling page: Hero (name, headline, CTAs: download PDF / open chat)
→ Highlights → Experience → Projects → Skills → Contact footer.
Dark/light theme toggle (shadcn pattern), defaults to `prefers-color-scheme`.
No router in v1; sections can graduate to routes later.

## PDF pipeline

`scripts/build-pdf.tsx` renders the same `resume.ts` data via
`@react-pdf/renderer` to `public/JhorlinDeArmas-Resume.pdf` before
`vite build`. Site and PDF cannot drift.

## Chatbot integration

One script tag, env-gated:

```html
<script src="https://skillfaber.com/embed.js"
        data-skillfaber-token="wgt_…" async></script>
```

- Token provided by user (publishable by design — bound to a role, abuse
  bounded by the role's widget caps): `wgt_uRfKmSxU6fYPs8kqxJvPTxm2iklZy9Uq`
- Injected only when `VITE_SKILLFABER_WIDGET_TOKEN` is set; absent token →
  static site, no error (mirrors skillfaber's own silent no-op pattern)
- The widget supplies its own launcher/panel/streaming UI; this repo builds
  no chat UI
- **Subresource Integrity:** deliberately not used. SRI pins a content hash,
  and `embed.js` changes on every skillfaber deploy — pinning would silently
  break the widget on each release. The script is first-party (Jhorlin owns
  skillfaber and its deploy pipeline), which is the trust SRI substitutes
  for. Same posture as Stripe.js/Intercom-style first-party embeds.
- **Verify early:** widget loads and streams on a non-skillfaber origin
  (CORS/allowed-origins on the widget Lambda URL). If blocked, fix lands in
  skillfaber, not here.
- Role/skill-book curation for resume Q&A happens in the skillfaber repo
  (out of scope here; token already exists)

## Infra & deploy

`sst.config.ts`: one `StaticSite` with custom domain `jhorlin.com`, with
`www.jhorlin.com` as a redirect alias to the apex (Route 53 + ACM). Domain attach waits on the in-flight
No-IP → Route 53 transfer (ticket #1065257); until then deploy to the
CloudFront default URL — transfer never blocks development. CloudWatch RUM
app monitor declared in the same config; RUM snippet env-gated like the
widget.

## Error handling

- Content: Zod validation at build — malformed content fails the build,
  never ships
- Widget/RUM: missing env → feature silently absent, site fully functional
- SPA on CloudFront: 404 → `index.html` rewrite (StaticSite `errorPage`)

## Testing

- **Vitest:** content passes Zod (dates present, URLs valid); PDF build
  produces a nonzero file
- **Playwright smoke:** page renders all sections, PDF link returns 200,
  theme toggle flips class, no console errors
- Widget behavior is skillfaber's test surface, not this repo's

## Out of scope (v1)

Router/multi-page, blog, case-study pages, contact form, custom chat UI,
skillfaber role/book changes.
