# Live Resume Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A single-page live resume at jhorlin.com — typed content rendering both the site and a build-time PDF, with skillfaber's chat widget embedded — deployed to AWS via SST.

**Architecture:** One TypeScript content module (`src/content/resume.ts`, Zod-validated) feeds a Vite/React 19 SPA and a `@react-pdf/renderer` build step. No servers: SST `StaticSite` (S3 + CloudFront), skillfaber's widget supplies all chat behavior via one injected script tag, CloudWatch RUM (env-gated) supplies analytics.

**Tech Stack:** Vite 7, React 19, TypeScript (strict), Tailwind CSS v4 (`@tailwindcss/vite`), shadcn/ui, Zod 4, @react-pdf/renderer 4, tsx, Vitest 3, Playwright, SST v3.

## Global Constraints

- Node >= 20.11 (`import.meta.dirname` is used)
- TypeScript `strict: true`; build must pass `tsc` with no errors
- Spec: `docs/superpowers/specs/2026-08-11-live-resume-design.md`
- `content-sources/` is gitignored and must NEVER be committed (contains references' personal phone numbers); references never appear in site/PDF content
- Widget token is publishable by design — it may appear in client HTML, but keep it in `.env` (gitignored) not in source, so stages can differ. Value: `wgt_uRfKmSxU6fYPs8kqxJvPTxm2iklZy9Uq` (prod)
- Widget src: `https://skillfaber.com/embed.js`
- Missing widget/RUM env vars → feature silently absent, never an error
- Generated PDF path is exactly `public/JhorlinDeArmas-Resume.pdf` (gitignored; built by `npm run build:pdf`)
- Domain (`jhorlin.com`) attaches ONLY when `RESUME_DOMAIN` env is set — the Route 53 transfer (No-IP ticket #1065257) is still in flight; never hardcode the domain into `sst.config.ts`
- Commit after every task; commit messages end with the project's standard Co-Authored-By trailer

---

### Task 1: Project scaffold (Vite + React 19 + Tailwind v4, strict TS)

**Files:**
- Create: `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`
- Modify: `.gitignore`

**Interfaces:**
- Produces: `@/*` path alias → `src/*` (used by every later task); `npm run dev|build|test` scripts; Tailwind + shadcn CSS tokens in `src/index.css`; dark mode via `dark` class on `<html>` (FOUC-free inline script in `index.html`).

- [ ] **Step 1: Write `package.json`**

```json
{
  "name": "resume",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "engines": { "node": ">=20.11" },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^19.1.0",
    "react-dom": "^19.1.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.1.0",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "@vitejs/plugin-react": "^5.0.0",
    "happy-dom": "^18.0.0",
    "tailwindcss": "^4.1.0",
    "typescript": "^5.8.0",
    "vite": "^7.0.0",
    "vitest": "^3.2.0",
    "zod": "^4.0.0"
  }
}
```

(`build:pdf` is added to the build chain in Task 8; e2e and sst scripts in Tasks 9–10.)

- [ ] **Step 2: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noEmit": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] },
    "types": ["vite/client"]
  },
  "include": ["src", "scripts", "tests", "e2e", "vite.config.ts", "vitest.config.ts", "playwright.config.ts"],
  "exclude": ["sst.config.ts"]
}
```

- [ ] **Step 3: Write `vite.config.ts` and `vitest.config.ts`**

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
});
```

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  test: { include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"] },
});
```

- [ ] **Step 4: Write `index.html`** (title/meta + FOUC-free theme bootstrap)

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Jhorlin De Armas — Software Architect</title>
    <meta
      name="description"
      content="Software architect specializing in AI and serverless systems on AWS. 20 years of experience. Ask my AI assistant anything."
    />
    <script>
      document.documentElement.classList.toggle(
        "dark",
        localStorage.theme === "dark" ||
          (!("theme" in localStorage) && matchMedia("(prefers-color-scheme: dark)").matches)
      );
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Write `src/index.css`** (Tailwind v4 + shadcn tokens, light & dark)

```css
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --secondary: oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent: oklch(0.97 0 0);
  --accent-foreground: oklch(0.205 0 0);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.922 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.556 0 0);
}

@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground antialiased;
  }
}
```

- [ ] **Step 6: Write `src/vite-env.d.ts`, `src/main.tsx`, `src/App.tsx`**

```ts
// src/vite-env.d.ts
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SKILLFABER_WIDGET_SRC?: string;
  readonly VITE_SKILLFABER_WIDGET_TOKEN?: string;
  readonly VITE_RUM_APP_MONITOR_ID?: string;
  readonly VITE_RUM_REGION?: string;
  readonly VITE_RUM_IDENTITY_POOL_ID?: string;
  readonly VITE_RUM_GUEST_ROLE_ARN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
```

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

```tsx
// src/App.tsx
export default function App() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-bold tracking-tight">Jhorlin De Armas</h1>
    </main>
  );
}
```

- [ ] **Step 7: Append build/test artifacts to `.gitignore`**

Append these lines (keep existing content):

```
public/JhorlinDeArmas-Resume.pdf
playwright-report/
test-results/
coverage/
```

- [ ] **Step 8: Install and verify**

Run: `npm install && npm run build`
Expected: `tsc` clean, `vite build` emits `dist/` with no errors.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: scaffold Vite + React 19 + Tailwind v4 with strict TS"
```

---

### Task 2: shadcn/ui setup (button, badge, separator, card)

**Files:**
- Create: `components.json`, `src/lib/utils.ts`
- Create (via CLI): `src/components/ui/button.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/separator.tsx`, `src/components/ui/card.tsx`

**Interfaces:**
- Produces: `<Button variant size asChild>`, `<Badge variant>`, `<Separator />`, `<Card>/<CardHeader>/<CardTitle>/<CardDescription>/<CardContent>` from `@/components/ui/*`; `cn()` from `@/lib/utils`.

- [ ] **Step 1: Write `components.json`**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 2: Write `src/lib/utils.ts`**

```ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 3: Add components via CLI (installs clsx/tailwind-merge/cva/lucide-react itself)**

Run: `npx shadcn@latest add -y button badge separator card`
Expected: four files under `src/components/ui/`, deps added to `package.json`.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add shadcn/ui (button, badge, separator, card)"
```

---

### Task 3: Content schema (Zod, TDD)

**Files:**
- Create: `src/content/schema.ts`
- Test: `tests/schema.test.ts`

**Interfaces:**
- Produces: `resumeSchema` (Zod), types `Resume`, `Experience`, `Project`, `Link` from `@/content/schema`. Months are `"YYYY-MM"` strings; `end: null` means "Present".

- [ ] **Step 1: Write the failing test**

```ts
// tests/schema.test.ts
import { describe, it, expect } from "vitest";
import { resumeSchema } from "../src/content/schema";

const valid = {
  profile: {
    name: "Test Person",
    headline: "Engineer",
    location: "Orlando, FL",
    email: "test@example.com",
    links: [{ label: "LinkedIn", url: "https://linkedin.com/in/test" }],
    education: { school: "UCF", degree: "BS Computer Science", year: 2006 },
  },
  highlights: ["one", "two", "three"],
  experience: [
    {
      company: "Acme",
      role: "Architect",
      location: "Remote",
      start: "2024-03",
      end: null,
      achievements: ["did a thing"],
    },
  ],
  projects: [
    {
      name: "Proj",
      description: "desc",
      outcomes: ["shipped"],
      tech: ["TypeScript"],
      links: [{ label: "Site", url: "https://example.com" }],
    },
  ],
  skills: [{ category: "Languages", items: ["TypeScript"] }],
};

describe("resumeSchema", () => {
  it("accepts a valid resume", () => {
    expect(() => resumeSchema.parse(valid)).not.toThrow();
  });

  it("rejects non-YYYY-MM dates", () => {
    const bad = structuredClone(valid);
    bad.experience[0]!.start = "March 2024";
    expect(() => resumeSchema.parse(bad)).toThrow();
  });

  it("rejects invalid URLs", () => {
    const bad = structuredClone(valid);
    bad.profile.links[0]!.url = "not-a-url";
    expect(() => resumeSchema.parse(bad)).toThrow();
  });

  it("requires at least 3 highlights", () => {
    const bad = structuredClone(valid);
    bad.highlights = ["only", "two"];
    expect(() => resumeSchema.parse(bad)).toThrow();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/schema.test.ts`
Expected: FAIL — cannot resolve `../src/content/schema`.

- [ ] **Step 3: Write `src/content/schema.ts`**

```ts
import { z } from "zod";

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "expected YYYY-MM");

export const linkSchema = z.object({
  label: z.string().min(1),
  url: z.url(),
});

export const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().min(1),
  start: month,
  end: month.nullable(),
  achievements: z.array(z.string().min(1)).min(1),
});

export const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  outcomes: z.array(z.string().min(1)),
  tech: z.array(z.string().min(1)).min(1),
  links: z.array(linkSchema),
});

export const resumeSchema = z.object({
  profile: z.object({
    name: z.string().min(1),
    headline: z.string().min(1),
    location: z.string().min(1),
    email: z.email(),
    links: z.array(linkSchema).min(1),
    education: z.object({
      school: z.string().min(1),
      degree: z.string().min(1),
      year: z.number().int(),
    }),
  }),
  highlights: z.array(z.string().min(1)).min(3).max(5),
  experience: z.array(experienceSchema).min(1),
  projects: z.array(projectSchema).min(1),
  skills: z.array(
    z.object({ category: z.string().min(1), items: z.array(z.string().min(1)).min(1) })
  ).min(1),
});

export type Resume = z.infer<typeof resumeSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Link = z.infer<typeof linkSchema>;
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- tests/schema.test.ts`
Expected: 4 passing.

- [ ] **Step 5: Commit**

```bash
git add tests/schema.test.ts src/content/schema.ts
git commit -m "feat: add Zod content schema for resume data"
```

---

### Task 4: Resume content + date formatting (TDD)

**Files:**
- Create: `src/content/resume.ts`, `src/lib/dates.ts`
- Test: `tests/content.test.ts`, `tests/dates.test.ts`

**Interfaces:**
- Consumes: `resumeSchema`, `Resume` from Task 3.
- Produces: `resume: Resume` (validated at module load — import fails loudly if content is bad) from `@/content/resume`; `formatMonth(ym: string): string` and `formatRange(start: string, end: string | null): string` from `@/lib/dates` (e.g. `formatRange("2024-03", null)` → `"Mar 2024 – Present"`).

- [ ] **Step 1: Write the failing dates test**

```ts
// tests/dates.test.ts
import { describe, it, expect } from "vitest";
import { formatMonth, formatRange } from "../src/lib/dates";

describe("dates", () => {
  it("formats a YYYY-MM month", () => {
    expect(formatMonth("2024-03")).toBe("Mar 2024");
  });

  it("formats a closed range", () => {
    expect(formatRange("2017-01", "2024-01")).toBe("Jan 2017 – Jan 2024");
  });

  it("formats an open range as Present", () => {
    expect(formatRange("2024-03", null)).toBe("Mar 2024 – Present");
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/dates.test.ts`
Expected: FAIL — cannot resolve `../src/lib/dates`.

- [ ] **Step 3: Write `src/lib/dates.ts`**

```ts
const FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export function formatMonth(ym: string): string {
  return FMT.format(new Date(`${ym}-01T00:00:00Z`));
}

export function formatRange(start: string, end: string | null): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : "Present"}`;
}
```

- [ ] **Step 4: Write the failing content test**

```ts
// tests/content.test.ts
import { describe, it, expect } from "vitest";
import { resume } from "../src/content/resume";
import { resumeSchema } from "../src/content/schema";

describe("resume content", () => {
  it("passes the schema", () => {
    expect(() => resumeSchema.parse(resume)).not.toThrow();
  });

  it("is reverse-chronological", () => {
    const starts = resume.experience.map((e) => e.start);
    const sorted = [...starts].sort((a, b) => b.localeCompare(a));
    expect(starts).toEqual(sorted);
  });

  it("features PDI as current and Kazzcade ending 2024-01", () => {
    const pdi = resume.experience.find((e) => e.company.includes("PDI"));
    const kazzcade = resume.experience.find((e) => e.company === "Kazzcade");
    expect(pdi?.start).toBe("2024-03");
    expect(pdi?.end).toBeNull();
    expect(kazzcade?.end).toBe("2024-01");
  });
});
```

- [ ] **Step 5: Write `src/content/resume.ts`** (full content — seeded from `content-sources/JhorlinResume-extracted.txt`, PDIQ AWS blog, and skillfaber; NO references section)

```ts
import { resumeSchema, type Resume } from "./schema";

const data: Resume = {
  profile: {
    name: "Jhorlin De Armas",
    headline: "Software Architect — AI & Serverless on AWS",
    location: "Lake Mary, FL",
    email: "jhorlin@gmail.com",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/jhorlin/" },
      {
        label: "AWS ML Blog (PDIQ)",
        url: "https://aws.amazon.com/blogs/machine-learning/how-pdi-built-an-enterprise-grade-rag-system-for-ai-applications-with-aws/",
      },
    ],
    education: {
      school: "University of Central Florida",
      degree: "BS in Computer Science",
      year: 2006,
    },
  },
  highlights: [
    "20 years shipping software — the last decade architecting serverless and AI systems on AWS.",
    "Co-author of the AWS Machine Learning Blog post on PDIQ, PDI's enterprise RAG system (answer approval 60% → 79%).",
    "Creator of skillfaber, an AI agent factory on Amazon Bedrock — the assistant on this page runs on it.",
    "Builder of teams: hired, mentored, and ran paid internship programs on modern serverless stacks.",
  ],
  experience: [
    {
      company: "PDI Technologies",
      role: "Architect II",
      location: "Alpharetta, GA (remote)",
      start: "2024-03",
      end: null,
      achievements: [
        "Architected PDIQ, PDI's multi-tenant AI assistant platform on AWS (200k+ lines of TypeScript): composable assistants built from knowledge bases, models, guardrails, and agent tools, streaming chat via CloudFront and Lambda Function URLs — co-authored the AWS Machine Learning Blog post on its RAG architecture.",
        "Designed the 'one pipeline, many crawlers' ingestion architecture: containerized crawlers (Confluence, SharePoint, Jira, ServiceNow, Azure DevOps, web, and more) write raw content to S3 while a single processing service owns chunking, summary-prepended embeddings (answer approval 60% → 79%), image captioning, and video indexing.",
        "Built an AWS-native agent-tool framework contemporaneous with MCP's release: Lambda functions self-describe via JSON Schema and are discovered at runtime by resource tag — extended cross-account so customers can expose their own Lambdas as agent tools.",
        "Embedded AI support agents into Salesforce Lightning (LWC + Screen Flows) backed by the PDIQ RAG, with a JWT identity bridge spanning Salesforce, Cvent, and Entra ID — agents automate case triage, comments, email, and knowledge retrieval.",
        "Led the PDI-wide support rollout: trained a team of 8 new-graduate offshore engineers — fundamentals first, then AI-augmented development with Claude Code; the proof of concept became PDI's internal support harness.",
        "Architected MyPDI, PDI's unified customer portal (~45 contributors): Single-SPA micro frontends composed via native ES import maps, runtime app registration with no shell redeploys, and the AI assistant integrated as 'chat as a service.'",
        "Built an AI legal workbench over PDI's contract corpus: natural language compiled to search queries, parallel fan-out Q&A streaming across selected contracts, live prompt administration, and durable audit trails.",
      ],
    },
    {
      company: "Kazzcade",
      role: "Director of Software Development",
      location: "Lake Mary, FL",
      start: "2017-01",
      end: "2024-01",
      achievements: [
        "Owned architecture, delivery, and cost for Kazzcade's lead-distribution platform and vendor portal on a fully serverless AWS stack (AppSync, Lambda, Aurora PostgreSQL, DynamoDB, SQS, EventBridge, CloudFront, Cognito, QuickSight, Redshift, Fargate, Athena).",
        "Built a code generator that reads Salesforce metadata and emits Liquibase schemas, Apex triggers with unit tests, and a Go ORM — replicating Salesforce data to Aurora with sub-second latency, bypassing API limits and per-seat licensing.",
        "Designed a buyer-rewards ledger on Amazon QLDB with USDC (Circle) escrow and Plaid payouts — cryptographically auditable end to end.",
        "Hired and mentored the engineering team; ran a paid internship program teaching serverless best practices on AWS.",
        "Implemented granular observability with X-Ray and CloudWatch alarms on uptime, latency, error rate, and queue depth.",
      ],
    },
    {
      company: "Under Armour",
      role: "Team Lead",
      location: "Baltimore, MD",
      start: "2016-01",
      end: "2017-11",
      achievements: [
        "Led the endless-aisle team: in-store purchasing across 11 microservices (Node.js; gRPC internally, REST at the aggregation layer) on Docker/Kubernetes with Kafka messaging.",
        "Designed JWT-based authentication for the external-facing service, eliminating stateful session verification.",
      ],
    },
    {
      company: "Riptide Software",
      role: "Sr. Architect",
      location: "Oviedo, FL",
      start: "2013-03",
      end: "2016-01",
      achievements: [
        "Architected the Elements e-learning platform as AWS microservices (Elastic Beanstalk, Node.js) with an HTML5 SPA courseware framework extending AngularJS.",
        "Built the Learning Record Store (Node.js + MongoDB) with live WebSocket dashboards, multi-tenant OAuth2, and a scaffolding tool that spins up a courseware project in minutes.",
        "Introduced functional reactive programming (RxJS) to stream learner events and trigger corrective feedback in real time.",
      ],
    },
    {
      company: "NCR Corporation",
      role: "Sr. Software Engineer",
      location: "Lake Mary, FL",
      start: "2010-09",
      end: "2013-03",
      achievements: [
        "Built airline check-in for web and cross-platform mobile (Knockout, jQuery Mobile, PhoneGap; Spring Web Flow/MVC).",
        "Built hotel kiosk applications (Silverlight; WPF with Unity DI) and an n-tier room-notification system (WCF), with CI and unit-tested MSI packaging.",
      ],
    },
    {
      company: "Toptech Systems",
      role: "Software Developer",
      location: "Longwood, FL",
      start: "2007-09",
      end: "2010-09",
      achievements: [
        "Ported QNX C systems to object-oriented Linux C++; built a client/server bill-of-lading reconciliation tool (C++ server, C# client, SOAP).",
        "Halved deployment time and recovered 200 MB by converting static libraries to shared objects.",
      ],
    },
    {
      company: "Highwinds Software",
      role: "Software Developer",
      location: "Winter Park, FL",
      start: "2006-03",
      end: "2007-09",
      achievements: [
        "Optimized a 130 GB on-disk data structure in multithreaded C++ — doubled storage capacity and cut drive lookup time by three seconds while preserving response time.",
      ],
    },
  ],
  projects: [
    {
      name: "PDIQ — Enterprise RAG at PDI",
      description:
        "AI assistant that turns PDI's scattered enterprise knowledge into one searchable chat, published as an AWS Machine Learning Blog case study.",
      outcomes: [
        "Answer approval raised from 60% to 79% via summary-prepended chunking",
        "Four crawler types ingest Confluence, SharePoint, Azure DevOps, and web content",
      ],
      tech: ["Amazon Bedrock", "Nova", "Titan Embeddings V2", "Aurora PostgreSQL", "EventBridge", "Lambda", "ECS"],
      links: [
        {
          label: "AWS ML Blog post",
          url: "https://aws.amazon.com/blogs/machine-learning/how-pdi-built-an-enterprise-grade-rag-system-for-ai-applications-with-aws/",
        },
      ],
    },
    {
      name: "Skillfaber",
      description:
        "AI agent factory on Amazon Bedrock: compose roles, RAG knowledge bases, and serverless MCP skills into deployable agents. The chat widget on this site is a skillfaber agent.",
      outcomes: [
        "Multi-tenant agent platform with embeddable chat widgets",
        "Powers the assistant answering questions on this page",
      ],
      tech: ["SST v3", "React 19", "Amazon Bedrock", "DynamoDB", "Lambda"],
      links: [{ label: "skillfaber.com", url: "https://skillfaber.com" }],
    },
    {
      name: "MyPDI — unified portal",
      description:
        "PDI's unified customer experience: a micro frontend platform where remote apps, their routes, and navigation are registered at runtime from data — no shell redeploys — with the AI assistant available everywhere as 'chat as a service.'",
      outcomes: [
        "~45 contributors building against one shell with guaranteed runtime singletons via native ES import maps",
        "Tenant admins add applications through a UI, not a deploy",
      ],
      tech: ["Single-SPA", "React", "import maps", "AppSync", "Cognito", "SST v3"],
      links: [],
    },
    {
      name: "AI legal workbench",
      description:
        "Search-and-interrogate workbench over PDI's contract corpus: natural language compiled into inspectable search queries, and fan-out Q&A that streams parallel answers across every selected contract.",
      outcomes: [
        "One question, N contracts, N streaming answers — replacing contract-by-contract review",
        "Prompt-as-configuration: legal can tune AI behavior live, no deploys",
      ],
      tech: ["Amazon Bedrock", "OpenSearch", "AppSync", "Lambda response streaming", "React"],
      links: [],
    },
    {
      name: "This site",
      description:
        "Typed-content resume: one TypeScript module renders both this page and the downloadable PDF; deployed to AWS with SST (S3 + CloudFront), chatbot embedded via skillfaber.",
      outcomes: ["Site and PDF can never drift — both render from the same validated data"],
      tech: ["React 19", "Tailwind v4", "shadcn/ui", "@react-pdf/renderer", "SST v3"],
      links: [],
    },
  ],
  skills: [
    {
      category: "AI & Data",
      items: ["Amazon Bedrock", "RAG", "Embeddings", "MCP", "Aurora PostgreSQL", "DynamoDB", "Redshift", "QLDB", "MongoDB", "Redis"],
    },
    {
      category: "Cloud & Infra",
      items: ["AWS Lambda", "AppSync", "SQS", "EventBridge", "CloudFront", "Cognito", "Fargate", "Athena", "QuickSight", "SST", "CDK", "CloudFormation", "Docker", "Kubernetes"],
    },
    {
      category: "Languages & Frameworks",
      items: ["TypeScript", "JavaScript", "Node.js", "React", "Go", "C#", "C/C++", "Java", "SQL", "Salesforce Apex"],
    },
  ],
};

export const resume: Resume = resumeSchema.parse(data);
```

- [ ] **Step 6: Run all tests**

Run: `npm test`
Expected: schema, dates, and content suites all pass.

- [ ] **Step 7: Commit**

```bash
git add src/content/resume.ts src/lib/dates.ts tests/content.test.ts tests/dates.test.ts
git commit -m "feat: add validated resume content and date formatting"
```

---

### Task 5: Theme system (TDD)

**Files:**
- Create: `src/lib/theme.ts`, `src/components/ThemeToggle.tsx`
- Test: `tests/theme.test.ts`

**Interfaces:**
- Consumes: `Button` from Task 2.
- Produces: `resolveTheme(stored, systemDark): Theme`, `currentTheme(doc): Theme`, `applyTheme(doc, theme): void`, type `Theme = "dark" | "light"` from `@/lib/theme`; `<ThemeToggle />` (button with `aria-label="Toggle theme"`).

- [ ] **Step 1: Write the failing test**

```ts
// tests/theme.test.ts
// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { resolveTheme, applyTheme, currentTheme } from "../src/lib/theme";

describe("theme", () => {
  it("stored value wins over system preference", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("falls back to system preference", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
    expect(resolveTheme("garbage", true)).toBe("dark");
  });

  it("applies and reads the dark class", () => {
    applyTheme(document, "dark");
    expect(currentTheme(document)).toBe("dark");
    applyTheme(document, "light");
    expect(currentTheme(document)).toBe("light");
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/theme.test.ts`
Expected: FAIL — cannot resolve `../src/lib/theme`.

- [ ] **Step 3: Write `src/lib/theme.ts`**

```ts
export type Theme = "dark" | "light";

export function resolveTheme(stored: string | null, systemDark: boolean): Theme {
  if (stored === "dark" || stored === "light") return stored;
  return systemDark ? "dark" : "light";
}

export function currentTheme(doc: Document): Theme {
  return doc.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(doc: Document, theme: Theme): void {
  doc.documentElement.classList.toggle("dark", theme === "dark");
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- tests/theme.test.ts`
Expected: 3 passing.

- [ ] **Step 5: Write `src/components/ThemeToggle.tsx`**

```tsx
import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { applyTheme, currentTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => currentTheme(document));

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(document, next);
    localStorage.theme = next;
    setTheme(next);
  }

  return (
    <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={toggle}>
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
```

- [ ] **Step 6: Verify build, commit**

Run: `npm run build`
Expected: clean.

```bash
git add src/lib/theme.ts src/components/ThemeToggle.tsx tests/theme.test.ts
git commit -m "feat: add theme system with toggle"
```

---

### Task 6: Page sections and composition

**Files:**
- Create: `src/components/Section.tsx`, `src/components/Hero.tsx`, `src/components/Highlights.tsx`, `src/components/Experience.tsx`, `src/components/Projects.tsx`, `src/components/Skills.tsx`, `src/components/Footer.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `resume` (Task 4), `formatRange` (Task 4), `ThemeToggle` (Task 5), shadcn components (Task 2).
- Produces: the complete page. Section headings are exactly: "Highlights", "Experience", "Projects", "Skills" (Playwright asserts on these). PDF link href is exactly `/JhorlinDeArmas-Resume.pdf`.

- [ ] **Step 1: Write `src/components/Section.tsx`**

```tsx
import type { ReactNode } from "react";

export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="mx-auto w-full max-w-3xl px-6 py-10">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight">{title}</h2>
      {children}
    </section>
  );
}
```

- [ ] **Step 2: Write `src/components/Hero.tsx`**

```tsx
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { resume } from "@/content/resume";

export function Hero() {
  const { profile } = resume;
  return (
    <header className="mx-auto w-full max-w-3xl px-6 pt-16 pb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
          <p className="mt-2 text-xl text-muted-foreground">{profile.headline}</p>
          <p className="mt-1 text-sm text-muted-foreground">{profile.location}</p>
        </div>
        <ThemeToggle />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <a href="/JhorlinDeArmas-Resume.pdf" download>
            Download resume (PDF)
          </a>
        </Button>
        {profile.links.map((link) => (
          <Button key={link.url} variant="outline" asChild>
            <a href={link.url} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          </Button>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Have questions? Ask my AI assistant — bottom-right corner.
      </p>
    </header>
  );
}
```

- [ ] **Step 3: Write `src/components/Highlights.tsx`**

```tsx
import { Section } from "@/components/Section";
import { resume } from "@/content/resume";

export function Highlights() {
  return (
    <Section id="highlights" title="Highlights">
      <ul className="list-disc space-y-2 pl-5 leading-relaxed">
        {resume.highlights.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Section>
  );
}
```

- [ ] **Step 4: Write `src/components/Experience.tsx`**

```tsx
import { Section } from "@/components/Section";
import { resume } from "@/content/resume";
import { formatRange } from "@/lib/dates";

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="space-y-8">
        {resume.experience.map((job) => (
          <li key={`${job.company}-${job.start}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-semibold">
                {job.role} · {job.company}
              </h3>
              <span className="text-sm text-muted-foreground">{formatRange(job.start, job.end)}</span>
            </div>
            <p className="text-sm text-muted-foreground">{job.location}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              {job.achievements.map((achievement) => (
                <li key={achievement}>{achievement}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
```

- [ ] **Step 5: Write `src/components/Projects.tsx`**

```tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/Section";
import { resume } from "@/content/resume";

export function Projects() {
  return (
    <Section id="projects" title="Projects">
      <div className="space-y-6">
        {resume.projects.map((project) => (
          <Card key={project.name}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.outcomes.length > 0 && (
                <ul className="list-disc pl-5 text-sm leading-relaxed">
                  {project.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm underline underline-offset-4"
                >
                  {link.label}
                </a>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 6: Write `src/components/Skills.tsx`**

```tsx
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/Section";
import { resume } from "@/content/resume";

export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="space-y-4">
        {resume.skills.map((group) => (
          <div key={group.category}>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">{group.category}</h3>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 7: Write `src/components/Footer.tsx`**

```tsx
import { resume } from "@/content/resume";

export function Footer() {
  const { profile } = resume;
  return (
    <footer className="mx-auto w-full max-w-3xl px-6 py-12 text-sm text-muted-foreground">
      <p>
        {profile.education.degree}, {profile.education.school} ({profile.education.year})
      </p>
      <p className="mt-2">
        <a href={`mailto:${profile.email}`} className="underline underline-offset-4">
          {profile.email}
        </a>
        {" · "}
        {profile.location}
      </p>
      <p className="mt-4">
        © {new Date().getFullYear()} {profile.name}. Built with React 19, Tailwind v4, and SST — chat powered by skillfaber.
      </p>
    </footer>
  );
}
```

- [ ] **Step 8: Rewrite `src/App.tsx`**

```tsx
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Footer } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";

export default function App() {
  return (
    <main>
      <Hero />
      <Separator className="mx-auto max-w-3xl" />
      <Highlights />
      <Experience />
      <Projects />
      <Skills />
      <Separator className="mx-auto max-w-3xl" />
      <Footer />
    </main>
  );
}
```

- [ ] **Step 9: Verify build and eyeball**

Run: `npm run build && npm run dev`
Expected: build clean; visually confirm all sections render in both themes, then stop the dev server.

- [ ] **Step 10: Commit**

```bash
git add src/components src/App.tsx
git commit -m "feat: render full resume page from content module"
```

---

### Task 7: Skillfaber widget injection (TDD)

**Files:**
- Create: `src/lib/widget.ts`, `.env.example`, `.env` (local only — gitignored)
- Modify: `src/main.tsx`
- Test: `tests/widget.test.ts`

**Interfaces:**
- Produces: `injectWidget(doc: Document, src: string | undefined, token: string | undefined): boolean` from `@/lib/widget` — appends `<script src async data-skillfaber-token>` to `<body>` and returns `true` only when both args are non-empty.

- [ ] **Step 1: Write the failing test**

```ts
// tests/widget.test.ts
// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { injectWidget } from "../src/lib/widget";

describe("injectWidget", () => {
  beforeEach(() => {
    document.querySelectorAll("script[data-skillfaber-token]").forEach((s) => s.remove());
  });

  it("does nothing without a token", () => {
    expect(injectWidget(document, "https://skillfaber.com/embed.js", undefined)).toBe(false);
    expect(injectWidget(document, "https://skillfaber.com/embed.js", "")).toBe(false);
    expect(document.querySelector("script[data-skillfaber-token]")).toBeNull();
  });

  it("does nothing without a src", () => {
    expect(injectWidget(document, undefined, "wgt_test")).toBe(false);
    expect(document.querySelector("script[data-skillfaber-token]")).toBeNull();
  });

  it("appends the embed script when configured", () => {
    expect(injectWidget(document, "https://skillfaber.com/embed.js", "wgt_test")).toBe(true);
    const script = document.querySelector<HTMLScriptElement>("script[data-skillfaber-token]");
    expect(script?.src).toBe("https://skillfaber.com/embed.js");
    expect(script?.dataset.skillfaberToken).toBe("wgt_test");
    expect(script?.async).toBe(true);
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/widget.test.ts`
Expected: FAIL — cannot resolve `../src/lib/widget`.

- [ ] **Step 3: Write `src/lib/widget.ts`**

```ts
export function injectWidget(
  doc: Document,
  src: string | undefined,
  token: string | undefined
): boolean {
  if (!src || !token) return false;
  const script = doc.createElement("script");
  script.src = src;
  script.async = true;
  script.dataset.skillfaberToken = token;
  doc.body.appendChild(script);
  return true;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- tests/widget.test.ts`
Expected: 3 passing.

- [ ] **Step 5: Wire into `src/main.tsx`** (add after the `createRoot(...)` call)

```tsx
import { injectWidget } from "./lib/widget";

injectWidget(
  document,
  import.meta.env.VITE_SKILLFABER_WIDGET_SRC,
  import.meta.env.VITE_SKILLFABER_WIDGET_TOKEN
);
```

- [ ] **Step 6: Write `.env.example` and local `.env`**

```bash
# .env.example — copy to .env and fill in
VITE_SKILLFABER_WIDGET_SRC=https://skillfaber.com/embed.js
VITE_SKILLFABER_WIDGET_TOKEN=
```

Local `.env` (NOT committed — `.gitignore` already excludes `.env*` except `.env.example`):

```bash
VITE_SKILLFABER_WIDGET_SRC=https://skillfaber.com/embed.js
VITE_SKILLFABER_WIDGET_TOKEN=wgt_uRfKmSxU6fYPs8kqxJvPTxm2iklZy9Uq
```

- [ ] **Step 7: Manual verify (integration risk check from spec)**

Run: `npm run dev`
Expected: the skillfaber launcher bubble appears bottom-right; open it, send "what is skillfaber" and confirm a streamed reply on the localhost origin (this validates cross-origin embedding). If the widget fails cross-origin, STOP and report — the fix belongs in skillfaber (widget Lambda URL allowed-origins), not here.

- [ ] **Step 8: Commit**

```bash
git add src/lib/widget.ts src/main.tsx tests/widget.test.ts .env.example
git commit -m "feat: inject skillfaber chat widget when token configured"
```

---

### Task 8: Build-time PDF (TDD)

**Files:**
- Create: `scripts/resume-pdf.tsx`, `scripts/build-pdf.tsx`
- Modify: `package.json` (add `build:pdf`, chain into `build`)
- Test: `tests/pdf.test.tsx`

**Interfaces:**
- Consumes: `resume`, `formatRange` (Task 4) — via relative imports (scripts run under `tsx`, no `@/` alias).
- Produces: `ResumePdf` React component (exported from `scripts/resume-pdf.tsx`); `npm run build:pdf` writes `public/JhorlinDeArmas-Resume.pdf`; `npm run build` = `build:pdf` → `tsc` → `vite build`.

- [ ] **Step 1: Install dependencies**

Run: `npm install -D @react-pdf/renderer tsx`

- [ ] **Step 2: Write the failing test**

```tsx
// tests/pdf.test.tsx
import { describe, it, expect } from "vitest";
import { renderToBuffer } from "@react-pdf/renderer";
import { ResumePdf } from "../scripts/resume-pdf";

describe("ResumePdf", () => {
  it("renders a valid non-trivial PDF from resume content", { timeout: 30_000 }, async () => {
    const buffer = await renderToBuffer(<ResumePdf />);
    expect(buffer.subarray(0, 5).toString()).toBe("%PDF-");
    expect(buffer.length).toBeGreaterThan(5_000);
  });
});
```

- [ ] **Step 3: Run to verify failure**

Run: `npm test -- tests/pdf.test.tsx`
Expected: FAIL — cannot resolve `../scripts/resume-pdf`.

- [ ] **Step 4: Write `scripts/resume-pdf.tsx`**

```tsx
import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { resume } from "../src/content/resume";
import { formatRange } from "../src/lib/dates";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 9.5, fontFamily: "Helvetica", color: "#111", lineHeight: 1.4 },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold" },
  headline: { fontSize: 11, marginTop: 2, color: "#444" },
  contact: { marginTop: 4, color: "#444" },
  section: { marginTop: 14 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#999",
  },
  jobHeader: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  jobTitle: { fontFamily: "Helvetica-Bold" },
  jobDates: { color: "#444" },
  bullet: { flexDirection: "row", marginTop: 2 },
  bulletMark: { width: 10 },
  bulletText: { flex: 1 },
  skillLine: { marginTop: 2 },
  bold: { fontFamily: "Helvetica-Bold" },
});

function Bullets({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item) => (
        <View key={item} style={styles.bullet}>
          <Text style={styles.bulletMark}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function ResumePdf() {
  const { profile } = resume;
  return (
    <Document title={`${profile.name} — Resume`} author={profile.name}>
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.headline}>{profile.headline}</Text>
        <Text style={styles.contact}>
          {profile.location} · {profile.email} ·{" "}
          {profile.links.map((link) => link.url).join(" · ")}
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Highlights</Text>
          <Bullets items={resume.highlights} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {resume.experience.map((job) => (
            <View key={`${job.company}-${job.start}`} wrap={false}>
              <View style={styles.jobHeader}>
                <Text style={styles.jobTitle}>
                  {job.role} · {job.company}
                </Text>
                <Text style={styles.jobDates}>{formatRange(job.start, job.end)}</Text>
              </View>
              <Bullets items={job.achievements} />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>
          {resume.projects.map((project) => (
            <View key={project.name} style={{ marginTop: 4 }} wrap={false}>
              <Text>
                <Text style={styles.bold}>{project.name}</Text> — {project.description}
              </Text>
              {project.links.map((link) => (
                <Link key={link.url} src={link.url}>
                  {link.url}
                </Link>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {resume.skills.map((group) => (
            <Text key={group.category} style={styles.skillLine}>
              <Text style={styles.bold}>{group.category}: </Text>
              {group.items.join(", ")}
            </Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <Text>
            {profile.education.degree}, {profile.education.school} ({profile.education.year})
          </Text>
        </View>
      </Page>
    </Document>
  );
}
```

- [ ] **Step 5: Run to verify pass**

Run: `npm test -- tests/pdf.test.tsx`
Expected: PASS.

- [ ] **Step 6: Write `scripts/build-pdf.tsx`**

```tsx
import { mkdirSync } from "node:fs";
import { renderToFile } from "@react-pdf/renderer";
import { ResumePdf } from "./resume-pdf";

mkdirSync("public", { recursive: true });
await renderToFile(<ResumePdf />, "public/JhorlinDeArmas-Resume.pdf");
console.log("Wrote public/JhorlinDeArmas-Resume.pdf");
```

- [ ] **Step 7: Update `package.json` scripts**

```json
"build": "npm run build:pdf && tsc && vite build",
"build:pdf": "tsx scripts/build-pdf.tsx",
```

- [ ] **Step 8: Full verify**

Run: `npm run build && ls -la public/ dist/`
Expected: `public/JhorlinDeArmas-Resume.pdf` exists (>5 KB) and is copied into `dist/`. Open the PDF and eyeball: 1–2 pages, no clipped text.

- [ ] **Step 9: Commit**

```bash
git add scripts tests/pdf.test.tsx package.json package-lock.json
git commit -m "feat: generate resume PDF from content at build time"
```

---

### Task 9: Playwright smoke tests

**Files:**
- Create: `playwright.config.ts`, `e2e/smoke.spec.ts`
- Modify: `package.json` (add `test:e2e`)

**Interfaces:**
- Consumes: heading names from Task 6 ("Highlights", "Experience", "Projects", "Skills"), h1 "Jhorlin De Armas", `aria-label="Toggle theme"`, PDF at `/JhorlinDeArmas-Resume.pdf`.

- [ ] **Step 1: Install**

Run: `npm install -D @playwright/test && npx playwright install chromium`

- [ ] **Step 2: Write `playwright.config.ts`**

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "e2e",
  timeout: 30_000,
  use: { baseURL: "http://127.0.0.1:4173" },
  webServer: {
    command: "npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort",
    url: "http://127.0.0.1:4173",
    timeout: 180_000,
    reuseExistingServer: !process.env.CI,
    env: { VITE_SKILLFABER_WIDGET_TOKEN: "" },
  },
});
```

(The empty token env keeps e2e hermetic — no external script fetch; env vars beat `.env` files in Vite.)

- [ ] **Step 3: Write `e2e/smoke.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

test("renders all sections without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Jhorlin De Armas" })).toBeVisible();
  for (const section of ["Highlights", "Experience", "Projects", "Skills"]) {
    await expect(page.getByRole("heading", { name: section, exact: true })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("serves the PDF download", async ({ page }) => {
  await page.goto("/");
  const response = await page.request.get("/JhorlinDeArmas-Resume.pdf");
  expect(response.status()).toBe(200);
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("theme toggle flips the dark class", async ({ page }) => {
  await page.goto("/");
  const isDark = () => page.locator("html").evaluate((el) => el.classList.contains("dark"));
  const before = await isDark();
  await page.getByRole("button", { name: "Toggle theme" }).click();
  expect(await isDark()).toBe(!before);
});
```

- [ ] **Step 4: Add script and run**

Add to `package.json` scripts: `"test:e2e": "playwright test"`

Run: `npm run test:e2e`
Expected: 3 passing.

- [ ] **Step 5: Commit**

```bash
git add playwright.config.ts e2e package.json package-lock.json
git commit -m "test: add Playwright smoke suite"
```

---

### Task 10: SST deploy (StaticSite + env-gated domain and RUM)

**Files:**
- Create: `sst.config.ts`, `src/lib/rum.ts`
- Modify: `src/main.tsx`, `package.json` (add `deploy`), `.env.example`
- Test: `tests/rum.test.ts`

**Interfaces:**
- Consumes: `.env` widget vars (Task 7).
- Produces: `npx sst deploy` → live CloudFront URL. `initRum(env?): boolean` from `@/lib/rum` — injects the CloudWatch RUM loader only when all four `VITE_RUM_*` vars are present. Env gates: `RESUME_DOMAIN` (custom domain), `ENABLE_RUM=true` (analytics), `SKILLFABER_WIDGET_TOKEN`/`SKILLFABER_WIDGET_SRC` (chat).

- [ ] **Step 1: Write the failing RUM test**

```ts
// tests/rum.test.ts
// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { initRum } from "../src/lib/rum";

describe("initRum", () => {
  it("does nothing when config is incomplete", () => {
    expect(initRum({})).toBe(false);
    expect(initRum({ id: "abc", region: "us-east-1" })).toBe(false);
    expect(document.querySelector("script[data-rum]")).toBeNull();
  });

  it("injects the CloudWatch RUM loader when fully configured", () => {
    const ok = initRum({
      id: "abc",
      region: "us-east-1",
      identityPoolId: "us-east-1:pool",
      guestRoleArn: "arn:aws:iam::123:role/guest",
    });
    expect(ok).toBe(true);
    const script = document.querySelector<HTMLScriptElement>("script[data-rum]");
    expect(script?.src).toContain("client.rum.us-east-1.amazonaws.com");
    expect((window as { AwsRumClient?: { i: string } }).AwsRumClient?.i).toBe("abc");
  });
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- tests/rum.test.ts`
Expected: FAIL — cannot resolve `../src/lib/rum`.

- [ ] **Step 3: Write `src/lib/rum.ts`**

```ts
interface RumConfig {
  id?: string;
  region?: string;
  identityPoolId?: string;
  guestRoleArn?: string;
}

export function initRum(
  config: RumConfig = {
    id: import.meta.env.VITE_RUM_APP_MONITOR_ID,
    region: import.meta.env.VITE_RUM_REGION,
    identityPoolId: import.meta.env.VITE_RUM_IDENTITY_POOL_ID,
    guestRoleArn: import.meta.env.VITE_RUM_GUEST_ROLE_ARN,
  }
): boolean {
  const { id, region, identityPoolId, guestRoleArn } = config;
  if (!id || !region || !identityPoolId || !guestRoleArn) return false;

  const w = window as typeof window & {
    AwsRumClient?: unknown;
    cwr?: (command: string, payload: unknown) => void;
  };
  const client = {
    q: [] as Array<{ c: string; p: unknown }>,
    n: "cwr",
    i: id,
    v: "1.0.0",
    r: region,
    c: {
      sessionSampleRate: 1,
      guestRoleArn,
      identityPoolId,
      endpoint: `https://dataplane.rum.${region}.amazonaws.com`,
      telemetries: ["performance", "errors", "http"],
      allowCookies: false,
      enableXRay: false,
    },
  };
  w.AwsRumClient = client;
  w.cwr = (command, payload) => client.q.push({ c: command, p: payload });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://client.rum.${region}.amazonaws.com/1.x/cwr.js`;
  script.dataset.rum = "true";
  document.head.appendChild(script);
  return true;
}
```

- [ ] **Step 4: Run to verify pass; wire into `src/main.tsx`** (after `injectWidget(...)`)

Run: `npm test -- tests/rum.test.ts` → PASS.

```tsx
import { initRum } from "./lib/rum";

initRum();
```

- [ ] **Step 5: Install SST and write `sst.config.ts`**

Run: `npm install -D sst@^3.17.0`

```ts
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "resume",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: { aws: { region: "us-east-1" } },
    };
  },
  async run() {
    // Set RESUME_DOMAIN=jhorlin.com only after the Route 53 transfer completes
    // (No-IP ticket #1065257) and the hosted zone exists in this account.
    const domain = process.env.RESUME_DOMAIN;
    const enableRum = process.env.ENABLE_RUM === "true";

    let rumEnvironment: Record<string, $util.Input<string>> = {};
    if (enableRum) {
      const identityPool = new aws.cognito.IdentityPool("RumIdentityPool", {
        identityPoolName: `resume-rum-${$app.stage}`,
        allowUnauthenticatedIdentities: true,
      });
      const guestRole = new aws.iam.Role("RumGuestRole", {
        assumeRolePolicy: identityPool.id.apply((id) =>
          JSON.stringify({
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Principal: { Federated: "cognito-identity.amazonaws.com" },
                Action: "sts:AssumeRoleWithWebIdentity",
                Condition: {
                  StringEquals: { "cognito-identity.amazonaws.com:aud": id },
                  "ForAnyValue:StringLike": {
                    "cognito-identity.amazonaws.com:amr": "unauthenticated",
                  },
                },
              },
            ],
          })
        ),
      });
      new aws.cognito.IdentityPoolRoleAttachment("RumRoleAttachment", {
        identityPoolId: identityPool.id,
        roles: { unauthenticated: guestRole.arn },
      });
      const monitor = new aws.rum.AppMonitor("SiteMonitor", {
        name: `resume-${$app.stage}`,
        domain: domain ?? "*.cloudfront.net",
        appMonitorConfiguration: {
          allowCookies: false,
          enableXray: false,
          sessionSampleRate: 1,
          telemetries: ["performance", "errors", "http"],
          guestRoleArn: guestRole.arn,
          identityPoolId: identityPool.id,
        },
      });
      new aws.iam.RolePolicy("RumGuestPolicy", {
        role: guestRole.id,
        policy: monitor.arn.apply((arn) =>
          JSON.stringify({
            Version: "2012-10-17",
            Statement: [{ Effect: "Allow", Action: "rum:PutRumEvents", Resource: arn }],
          })
        ),
      });
      rumEnvironment = {
        VITE_RUM_APP_MONITOR_ID: monitor.appMonitorId,
        VITE_RUM_REGION: "us-east-1",
        VITE_RUM_IDENTITY_POOL_ID: identityPool.id,
        VITE_RUM_GUEST_ROLE_ARN: guestRole.arn,
      };
    }

    const site = new sst.aws.StaticSite("Site", {
      build: { command: "npm run build", output: "dist" },
      errorPage: "index.html",
      domain: domain ? { name: domain, redirects: [`www.${domain}`] } : undefined,
      environment: {
        VITE_SKILLFABER_WIDGET_SRC:
          process.env.SKILLFABER_WIDGET_SRC ?? "https://skillfaber.com/embed.js",
        VITE_SKILLFABER_WIDGET_TOKEN: process.env.SKILLFABER_WIDGET_TOKEN ?? "",
        ...rumEnvironment,
      },
    });

    return { url: site.url };
  },
});
```

- [ ] **Step 6: Update `.env.example` and local `.env`**

Append to `.env.example`:

```bash
# SST deploy-time configuration
SKILLFABER_WIDGET_SRC=https://skillfaber.com/embed.js
SKILLFABER_WIDGET_TOKEN=
# RESUME_DOMAIN=jhorlin.com   # uncomment after Route 53 transfer completes
# ENABLE_RUM=true             # uncomment to provision CloudWatch RUM
```

Append to local `.env`: same two `SKILLFABER_*` lines with the real token value.

- [ ] **Step 7: Add deploy script; verify tests still green**

Add to `package.json` scripts: `"deploy": "sst deploy"`

Run: `npm test && npm run test:e2e`
Expected: all green (RUM inactive in e2e — no `VITE_RUM_*` set).

- [ ] **Step 8: Deploy dev stage and verify manually**

Run: `npx sst deploy --stage dev`
Expected: outputs a CloudFront `url`. Open it and confirm: sections render, PDF downloads, theme toggles, skillfaber bubble appears and streams a reply on the CloudFront origin. If widget fails here but worked on localhost, report — allowed-origins fix belongs in skillfaber.

- [ ] **Step 9: Commit**

```bash
git add sst.config.ts src/lib/rum.ts src/main.tsx tests/rum.test.ts package.json package-lock.json .env.example
git commit -m "feat: SST StaticSite deploy with env-gated domain and CloudWatch RUM"
```

---

### Task 11: README and domain-flip runbook

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: everything above (documents it).

- [ ] **Step 1: Write `README.md`**

```markdown
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
| `npm run dev`      | Vite dev server                               |
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

1. Confirm the transfer finished (No-IP ticket #1065257) and a Route 53
   hosted zone for `jhorlin.com` exists in this AWS account.
2. In `.env`, uncomment `RESUME_DOMAIN=jhorlin.com`.
3. `npx sst deploy --stage production` — SST provisions the ACM cert (DNS
   validation) and alias records for `jhorlin.com` + `www` redirect.
4. Keep the No-IP nameserver entries for `home.jhorlin.com` /
   `print.jhorlin.com` in mind: if DNS stays on No-IP Plus Managed DNS,
   do NOT switch the zone — only flip once DNS strategy is decided
   (see spec: transfer keeps No-IP nameservers initially).

## Content updates

Edit `src/content/resume.ts`; `npm test` validates it; `npm run build`
regenerates the PDF. `content-sources/` is local-only source material and
must never be committed.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add README with commands and domain-flip runbook"
```

---

## Self-review notes

- **Spec coverage:** stack (T1–T2), content model + seed content (T3–T4), theme (T5), single-page sections (T6), widget env-gated + cross-origin probe (T7), PDF pipeline (T8), testing incl. e2e (T9), SST + domain gating + RUM + SPA errorPage (T10), docs (T11). References/PII exclusion enforced by Global Constraints and content (no references in `resume.ts`).
- **Domain caveat:** T10/T11 both note the transfer dependency and that the site works on the CloudFront URL meanwhile — matches spec.
- **Type consistency:** `resume`/`resumeSchema`/`formatRange`/`injectWidget`/`initRum` signatures match across tasks; PDF heading names match Playwright assertions.
