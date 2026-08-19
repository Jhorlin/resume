import { resumeSchema, type Resume } from "./schema";

const data: Resume = {
  profile: {
    name: "Jhorlin De Armas",
    headline: "AI Agent Infrastructure & Platform Engineer",
    location: "Orlando, FL · Remote",
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
    "I build agent harnesses: the runtime around the model (tool-use loops, streaming, capability detection, metering, and evals), on AWS in TypeScript and Go.",
    "Founder of Skillfaber, a production role-based AI agent platform on Amazon Bedrock: ~270 Lambdas, 128 MCP tool integrations, a checkpoint-and-continue runtime for unbounded agent turns. The assistant on this page runs on it.",
    "Co-author of the AWS Machine Learning Blog post on PDIQ, PDI's enterprise RAG system, where answer approval measured 60% → 79%.",
    "Eval-driven: benchmarked a hybrid retriever at 86% qrels-hit@k on SciFact with regression floors in CI; every claim here is measured, not asserted.",
    "20 years shipping software; the last decade architecting AI and serverless systems on AWS, and mentoring teams to build with AI-native tooling.",
  ],
  bragHighlights: [
    "I build agent harnesses: the runtime around the model (tool-use loops, streaming, capability detection, metering, and evals), on AWS in TypeScript and Go.",
    "Founder of Skillfaber, a production role-based AI agent platform on Amazon Bedrock, built solo: ~270 Lambdas, 128 MCP tool integrations, and a checkpoint-and-continue runtime for unbounded agent turns. The assistant on this page runs on it.",
    "Built the whole suite solo in 19 months: the agent platform, plus Sessio (a meeting platform whose transcripts feed agents) and Notitia (a serverless RAG service in Go).",
    "Co-author of the AWS Machine Learning Blog post on PDIQ, PDI's enterprise RAG system, where answer approval measured 60% → 79%.",
    "Impact in numbers: cut a PDI support team's resolution time from four days to one, and a payroll customer's agent run from 25 million tokens and 45 minutes to about 100k tokens and two minutes.",
    "Eval-driven: benchmarked a hybrid retriever at 86% qrels-hit@k on SciFact with regression floors in CI; every claim here is measured, not asserted.",
    "Independently converged on the tool-calling pattern MCP would standardize, shipping it within days of MCP's announcement, and applied browser-era feature-detection-and-polyfill to LLM capabilities, a pattern I first shipped in 2010.",
    "Validated by others: Waypoints, a training platform I architected, was sold to General Dynamics; PDIQ was published by AWS; Skillfaber runs in production for real users.",
    "20 years across the stack, from real-time C++ and CDN internals to micro-frontends and agent runtimes, hiring and leading teams throughout.",
  ],
  experience: [
    {
      company: "Skillfaber (Independent)",
      role: "Founder & Principal Engineer",
      location: "Remote",
      start: "2025-01",
      end: null,
      achievements: [
        "Founded Skillfaber on the thesis that an organization's roles should define the guardrails an agent runs under, and a role's skills are the vendor services a person in it uses. Solo-built into a production, multi-tenant AI agent platform on Amazon Bedrock (~270 Lambdas, fully serverless on SST/Pulumi).",
        "Built the agent runtime: a checkpoint-and-continue loop that chains 15-minute Lambdas into unbounded agent turns, with full loop state serialized to S3 and resumed across self-invocations, retry orchestration with primary-to-backup model failover, and sequence numbers that stay continuous across Lambda generations.",
        "Engineered the client to the same standard: an RxJS pipeline re-sequences out-of-order MQTT delivery (AWS IoT does not guarantee ordering), every in-flight event persists to IndexedDB so a mid-turn page refresh replays and rejoins the live stream, heartbeats drive idle detection without disturbing the reorder buffer, and a closed tab's broker session is reclaimed so the message backlog survives.",
        "Made agents composable: an orchestrator calls other agents as tools, each delegate running the same long-turn checkpointing runtime, with a durable outcome mailbox so results survive handoffs on both sides and depth and cycle guards against runaway recursion. Custom tools run as Lambdas or stateful AgentCore shell sessions, and checkpoints treat them differently: stateless Lambda tools abort near the 15-minute wall and re-invoke fresh on the far side, while shell sessions keep running and the next generation reconnects to continue or collect the finished result.",
        "Designed 'skill books', a progressive-disclosure context system: pinned knowledge becomes cached system-prompt stanzas, while on-demand books are indexed in a hidden tool's description and loaded only as tool results, keeping per-turn context cost flat. Applied the same pattern to the codebase itself, instrumenting it with 34 agent skills for AI-assisted development.",
        "Invented task-based guardrails with progressively disclosed steps: agents see a task index, then a roadmap, then only the active step's instructions. Steps mention files and tools inline, and while a step is active the harness narrows an agent with hundreds of tools to just that step's tool surface, restoring the full set when a step names none; file and tool scoping work independently.",
        "Solved multi-model support with the HTML5 playbook, feature detection plus polyfill: a probe harness tests every model across Amazon Bedrock, Mantle, OpenRouter, and Meta, running its own experiments where provider capability APIs fall short (max-token rules that vary by endpoint, whether tool use and structured output can coexist, per-provider schema quirks). A model lacking vision or document input is told its limitation in-prompt and handed reader tools (OCR, spreadsheet, document) to work around the gap knowingly; where emulation would fabricate, as with structured output, the harness fails loud.",
        "Created 'recipes' after watching an agent burn tokens calling a code interpreter for the same work every run: TypeScript tools authored in the product, stored in DynamoDB, and executed in a QuickJS sandbox inside Lambda with brokered, allow-listed access to the team's tools, MCPs, other agents, HTTP, and KMS-held secrets. Codifying one payroll customer's repeated agent work cut a 25-million-token, 45-minute run to about 100k tokens and two minutes.",
        "Designed usage metering and time-series analytics: a single-compute-site billing invariant enforced by custom CI guards, allocation accounting as atomic, idempotent DynamoDB transactions made conflict-free by EventBridge Pipe FIFO re-keying, and Athena partition-projection reporting. Billing code is held to 100% per-file test coverage.",
        "Abstracted delivery into a channels layer of paired request and response channels: every medium binds to one of two ingress spines, and a FIFO queue keyed by conversation serializes each thread so user-assistant turn order is always preserved. Email, Slack (streaming edit-loop), Discord, Teams, Messenger, and Instagram are live; the catalog seam (auth kind, delivery mode, availability) is where WhatsApp, Telegram, and SMS providers slot in next. Scheduled prompts ride the same rails: timezone-aware recurrence, and pipelines where one agent's reply becomes the next role's prompt, each link starting a fresh context, inheriting the chain's knowledge, or pinning a standing conversation, with a guaranteed terminal channel so chains always end.",
        "Integrated 128 third-party services (Salesforce, Workday, NetSuite, SAP, and more) as MCP tools behind an AWS Bedrock AgentCore Gateway, with KMS-encrypted credentials resolved most-granular-first across four tiers (user, role, team, platform). Also shipped an issue-to-PR coding agent in CI: mentioning the bot on a GitHub issue runs a credential-free container that codes the issue, adversarially self-reviews, and opens a human-gated PR.",
      ],
    },
    {
      company: "PDI Technologies",
      role: "Architect II",
      location: "Alpharetta, GA (remote)",
      start: "2024-03",
      end: null,
      achievements: [
        "Architected PDIQ, PDI's multi-tenant AI assistant platform on AWS: composable assistants built from knowledge bases, models, guardrails, and agent tools, streaming chat via CloudFront and Lambda Function URLs. Co-authored the AWS Machine Learning Blog post on its RAG architecture.",
        "Designed the 'one pipeline, many crawlers' ingestion architecture for a company grown through 35+ acquisitions: rather than asking the organization to centralize its data, containerized crawlers (Confluence, SharePoint, Jira, ServiceNow, Azure DevOps, web, and more) go to it, writing raw content to S3 while a single processing service owns chunking, summary-prepended embeddings (answer approval 60% → 79%), image captioning, and video indexing.",
        "Made images first-class knowledge: most support documentation lived in screenshots, so the pipeline captions each image and embeds the caption as a markdown document alongside it. Image content became semantically searchable, and answers surface both the relevant text and links to the source images, so support sees the fix in words and pictures.",
        "Built PDIQ's agent-tool framework, independently converging on the pattern MCP would standardize (it shipped within days of MCP's announcement, long before the spec had traction): each tool is a tagged, versioned Lambda with a two-verb contract, where describe returns the same JSON Schema that is injected into the model and execute runs it — one Lambda per tool, where MCP bundles many tools per server. A discovery process caches every tool's name, description, and schema in DynamoDB; assistants bind tools plus per-tool credentials; the runtime loads that registry and invokes execute. Extended cross-account so customers can expose their own Lambdas as agent tools.",
        "Mounted the PDIQ assistant directly onto Salesforce case pages for support agents by reusing the platform wholesale (a thin Salesforce adapter over the unchanged app), bridged by an asymmetric-key SSO: Salesforce mints an RS256 JWT signed with its private key, Cognito verifies it against the public certificate via a custom-auth challenge and JIT-provisions the user. Selected over a third-party vendor and Salesforce's native AI, and adopted by the support org. With past case resolutions ingested as knowledge, solutions found once by any team became findable by every agent, and average resolution time fell from four days to one.",
        "Led the PDI-wide support rollout and trained a team of 8 new-graduate offshore engineers: fundamentals first, then AI-augmented development with Claude Code; the proof of concept became PDI's internal support harness.",
        "Architected MyPDI, PDI's unified customer portal: Single-SPA micro frontends composed via native ES import maps, runtime app registration with no shell redeploys, and the AI assistant integrated as 'chat as a service.'",
        "Built MyPDI's identity federation: a provider-agnostic RFC 8693 token-exchange broker (APISIX edge plus a Go service) with a per-issuer allow-list that federates Okta, Salesforce, and partner identity providers into KMS-signed, tenant-scoped platform tokens, plus a voucher-based Okta on-behalf-of flow for embedded multi-app SSO over a multi-tenant RBAC model.",
        "Built an AI legal workbench over PDI's contract corpus, deliberately without RAG: an LLM compiles natural language into inspectable search queries and long-context models read whole contracts, with parallel fan-out Q&A streaming across selected agreements, live prompt administration, and durable audit trails.",
        "Invented 'virtual contracts' for the legal workbench: contracts are immutable, so amendments stack, and after dozens of addendums the effective agreement is opaque. The tool replays each amendment (sections added, removed, or updated) over the master to synthesize the current effective contract, with a timeline of when each change took effect.",
      ],
    },
    {
      company: "Kazzcade",
      role: "Director of Software Development",
      location: "Lake Mary, FL",
      start: "2017-01",
      end: "2024-01",
      achievements: [
        "Owned architecture, delivery, and cost for Kazzcade's appointment-setting and lead-distribution platform on a fully serverless AWS stack (AppSync, Lambda, Aurora PostgreSQL, DynamoDB, SQS, EventBridge, CloudFront, Cognito, QuickSight, Redshift, Fargate, Athena).",
        "Invented, architected, and built 'Suggested Campaigns', a tool surfaced inside Salesforce on the prospect record: my query cross-referenced the campaigns a prospect's company had run against who funded each one, so a person already met under one OEM- or reseller-funded program was never re-pitched to the same funder under a different campaign banner, cutting appointment rejections driven by 'we've already met.' Built the first version in native Salesforce JavaScript, then directed the team to rebuild the front end in React behind a reusable hook.",
        "Invented sfSync when Salesforce quoted ~$250k a year for five-minute-at-best sync: one extracted metadata file fans out into seven generated artifacts (the Liquibase changelog, a Go ORM, TypeORM entities, a GraphQL layer, an ERD, 107 per-object Apex triggers, and an integration-test suite that boots a real Postgres and replays the real migrations). When Salesforce's schema changes, regenerate, diff against the committed migrations with Liquibase in Docker, commit the changeset, and CI applies it.",
        "Made the sync path nearly free to run: triggers publish platform events whose handlers re-query fresh records and push batches to S3 through a direct API Gateway service proxy (no compute in the ingest path), and a Go Lambda upserts them guarded by SystemModstamp so replays and out-of-order deliveries are no-ops. Multi-select picklists land as Postgres text arrays; sub-second, push-driven replication bypassed API limits and per-seat licensing.",
        "Turned that synced data into a multi-tenant customer portal (React + AppSync) where sales reps view, claim, and reassign their opportunities and clients watch campaign progress near-real-time off the Postgres replica, with per-user embedded Amazon QuickSight analytics, white-label branding across 27 partner domains, and Cognito auth carrying Salesforce identity into every query.",
        "Designed a buyer-rewards ledger on Amazon QLDB with USDC (Circle) escrow and Plaid payouts, cryptographically auditable end to end.",
        "Hired and mentored the engineering team; ran a paid internship program teaching serverless best practices on AWS.",
        "Implemented granular observability with X-Ray and CloudWatch alarms on uptime, latency, error rate, and queue depth.",
      ],
    },
    {
      company: "Under Armour",
      role: "Senior Software Engineer",
      location: "Baltimore, MD (remote)",
      start: "2016-01",
      end: "2017-11",
      achievements: [
        "Joined Endless Aisle as a full-stack engineer (back end, front end, and the authentication layer): let any Under Armour store find a product across every inventory source, warehouses, other stores, even stock earmarked for Amazon, and ship it to the customer free and expedited, capturing sales that would otherwise walk out the door. Rolled out to every Under Armour retail store in the United States.",
        "When the project started slipping a month in, mapped the system with sequence diagrams to expose every cross-system dependency, then built mock interfaces to each so five engineers could build in parallel instead of blocking on one another, unblocking delivery and earning a promotion to Senior Software Engineer.",
        "Worked across the platform, roughly 11 microservices (Node.js; gRPC internally, REST at the aggregation layer) on Docker and Kubernetes with Kafka messaging, and designed JWT-based authentication for the external-facing service, eliminating stateful session verification.",
      ],
    },
    {
      company: "Riptide Software",
      role: "Sr. Architect",
      location: "Oviedo, FL",
      start: "2013-03",
      end: "2016-01",
      achievements: [
        "Hired to lead, architect, and staff the team building Riptide's Elements platform on xAPI, a then-new standard for capturing how a learner moves through material: not just start, completion, and mastery, but time per topic, choices, and selections, as a live event stream. Hired and led a seven-person team across front-end, DevOps, full-stack, and courseware design.",
        "Built Waypoints, an in-application training overlay: React components injected onto the client's own software that locate on-screen elements, explain what each does, capture every interaction as xAPI statements, and test the learner for mastery inline, right where the feature lives. Riptide later sold the product to General Dynamics.",
        "Architected it as Node.js microservices on EC2 and Elastic Beanstalk over Postgres, with an early-Angular single-page front end and RxJS processing the xAPI streams to drive real-time feedback, reactive stream processing when RxJS was brand new.",
        "Built the Learning Record Store (Node.js + MongoDB) with live WebSocket dashboards, multi-tenant OAuth2, and a scaffolding tool that spins up a courseware project in minutes.",
      ],
    },
    {
      company: "NCR Corporation",
      role: "Sr. Software Engineer",
      location: "Lake Mary, FL",
      start: "2010-09",
      end: "2013-03",
      achievements: [
        "Built Delta's airline check-in for web and cross-platform mobile (Knockout MVVM, jQuery Mobile, PhoneGap; Spring Web Flow/MVC), deployed across Delta's airport network and piloted at Orlando (MCO). A client-side state machine kept the check-in business rules in one place, and a lazy-loading binding framework kept views fully interchangeable from their view models.",
        "Shipped it cross-browser with feature detection and polyfills (Modernizr plus shims), the same detect-capabilities-then-fill-the-gaps pattern I would apply to LLMs in Skillfaber fifteen years later.",
        "Built Marriott hotel kiosk applications (Silverlight; WPF with Unity DI) and an n-tier room-notification system (WCF), with CI and unit-tested MSI packaging.",
      ],
    },
    {
      company: "Toptech Systems",
      role: "Software Developer",
      location: "Longwood, FL",
      start: "2007-09",
      end: "2010-09",
      achievements: [
        "Modernized real-time control software for fuel-terminal automation, a safety-critical domain: ported QNX C systems to object-oriented Linux C++, wrote cross-platform C++ plugins for both, and built a client/server bill-of-lading reconciliation tool (C++ server, C# client, SOAP).",
        "Built the customer-facing transaction portal by hand: a dynamic, data-driven results table written in JavaScript and jQuery before front-end frameworks took off, over an n-tier ASP.NET MVC2 and MySQL back end.",
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
        "Optimized the CDN cache index: a 130 GB on-disk data structure in multithreaded C++ whose tuning doubled storage capacity and cut drive-lookup time by three seconds while holding response time.",
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
      name: "Skillfaber — role-based agent platform",
      description:
        "A production, multi-tenant AI agent platform on Amazon Bedrock, built solo: compose a role (model + guardrails + knowledge + tools) and reach it from web, an embeddable widget, email, Slack, Discord, Teams, Messenger, Instagram, schedules, or agent-to-agent delegation. The assistant on this page is a Skillfaber agent.",
      outcomes: [
        "Checkpoint-and-continue runtime chains 15-minute Lambdas into unbounded agent turns; client streams over IoT MQTT survive reconnects",
        "Probe-derived model-capability catalog adapts tool-use, structured output, and thinking per model, per attempt, failing loud instead of fabricating",
        "128 MCP tool integrations behind a Bedrock AgentCore Gateway; usage metering with billing code held to 100% per-file coverage",
        "Scheduled prompts chain into pipelines: one agent's output feeds the next, each link choosing a fresh context or inheriting the chain",
      ],
      tech: ["Amazon Bedrock", "AgentCore", "SST/Pulumi", "Lambda", "DynamoDB", "IoT Core", "Athena", "TypeScript"],
      links: [{ label: "skillfaber.com", url: "https://skillfaber.com" }],
    },
    {
      name: "Notitia — serverless RAG",
      description:
        "A serverless-first, multi-tenant RAG service in Go for clients with large corpora. Designed as a drop-in knowledge layer for Skillfaber. Retrieval quality is measured, not assumed.",
      outcomes: [
        "Two-phase binary-quantized hybrid retrieval: Hamming ANN prefilter → float rescore, fused with keyword search via RRF, reranked with Cohere Rerank 3.5",
        "Benchmarked at 86% qrels-hit@k on SciFact with regression floors enforced in CI-style smoke tests",
        "PostgreSQL row-level-security tenant isolation verified by test; build-tag-gated TLS so production can't disable it",
      ],
      tech: ["Go", "AWS Lambda", "Aurora Serverless v2", "pgvector", "Amazon Bedrock", "Cohere", "SST"],
      links: [],
    },
    {
      name: "Sessio — meeting platform for agents",
      description:
        "A self-built video-meeting platform on the AWS Chime SDK whose recordings and transcripts feed Skillfaber agents, so they learn from real meetings while being tuned for customers.",
      outcomes: [
        "Chime meetings, media-pipeline recording, and Amazon Transcribe with custom transcript assembly (S3 NDJSON → dedup → WebVTT)",
        "Wired into Skillfaber as an MCP whose 28 tools are 21 auto-generated from its own GraphQL schema, proving the platform's codegen generalizes",
        "Cognito JWT pass-through so an agent acts as the calling user, with that user's permissions",
      ],
      tech: ["AWS Chime SDK", "Amazon Transcribe", "AppSync", "DynamoDB", "SST/Pulumi", "React 19", "TypeScript"],
      links: [],
    },
    {
      name: "MyPDI — unified portal",
      description:
        "PDI's unified customer experience: a micro frontend platform where remote apps, their routes, and navigation are registered at runtime from data (no shell redeploys), with the AI assistant available everywhere as 'chat as a service.'",
      outcomes: [
        "Every product team builds against one shell with guaranteed runtime singletons (React, Jotai, MUI theme) via native ES import maps",
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
        "One question, N contracts, N streaming answers, replacing contract-by-contract review",
        "'Virtual contracts' replay stacked amendments over the immutable master to show the current effective agreement, with a timeline of every change",
        "Prompt-as-configuration: legal can tune AI behavior live, no deploys",
      ],
      tech: ["Amazon Bedrock", "OpenSearch", "AppSync", "Lambda response streaming", "React"],
      links: [],
    },
    {
      name: "This site",
      description:
        "A live demo of my own platform: the AI assistant answering questions here is a Skillfaber agent. One typed TypeScript module renders this page, the downloadable PDF and Word resumes, and the interactive architecture view, so nothing can drift.",
      outcomes: [
        "Single validated source renders web, PDF, Word, and the React Flow architecture diagrams",
        "Deployed to AWS with SST (S3 + CloudFront); the chatbot is a production Skillfaber embed",
      ],
      tech: ["React 19", "Tailwind v4", "React Flow", "@react-pdf/renderer", "docx", "SST"],
      links: [],
    },
  ],
  skills: [
    {
      category: "Agent Infrastructure",
      items: ["Agent runtimes / tool-use loops", "Multi-agent orchestration & sub-agents", "MCP / tool calling", "Bedrock AgentCore Gateway", "Prompt & context engineering", "Model capability detection & polyfill", "Guardrails & responsible AI", "Evals & benchmarking (LLM-as-judge)", "Long-running / checkpointed agents", "Streaming (SSE / MQTT)", "Inference cost & latency optimization", "Sandboxed code-mode tools"],
    },
    {
      category: "Models & Providers",
      items: ["Amazon Bedrock", "OpenRouter", "Anthropic Claude", "Amazon Nova", "Meta Llama", "Cohere (embed + rerank)", "Multi-model routing & failover", "Prompt caching"],
    },
    {
      category: "Data & Retrieval",
      items: ["Retrieval-Augmented Generation (RAG)", "Hybrid retrieval & reranking", "Chunking & semantic search", "Embeddings", "Knowledge bases", "pgvector", "OpenSearch", "Aurora PostgreSQL", "DynamoDB", "Athena / Redshift", "Data pipelines & governance"],
    },
    {
      category: "Salesforce Platform",
      items: ["Apex", "Lightning Web Components", "Aura", "Platform Events", "Metadata API", "SOQL", "Screen Flows", "JWT-bearer SSO", "Embedded AI"],
    },
    {
      category: "Identity & Security",
      items: ["Enterprise SSO (Okta OIDC, SAML, OAuth 2.0)", "Cognito custom auth", "RFC 8693 token exchange / OBO", "JWT (RS256) / JWT-bearer", "Multi-tenant isolation & RBAC", "Least-privilege IAM", "KMS encryption & audit logging", "JIT provisioning"],
    },
    {
      category: "Cloud, Infra & Delivery",
      items: ["AWS Well-Architected Framework", "Infrastructure as Code (SST/Pulumi, CDK, CloudFormation)", "Serverless (Lambda, Step Functions)", "Event-driven (EventBridge + Pipes, SQS/SNS, Kafka)", "Microservices & APIs (AppSync, gRPC, REST)", "IoT Core (MQTT)", "Containers (Docker, Kubernetes, Fargate/ECS)", "CI/CD (CodePipeline, GitHub Actions)", "Observability (X-Ray, CloudWatch, RUM, Datadog)", "Cost optimization / FinOps", "High availability & multi-region", "Chime SDK", "CloudFront"],
    },
    {
      category: "Frontend",
      items: ["React", "Micro-frontends (Single-SPA + import maps)", "RxJS", "Angular", "MUI", "Tailwind", "Vite"],
    },
    {
      category: "Leadership & Delivery",
      items: ["Technical leadership", "Team building, hiring & mentoring", "Founder / zero-to-one", "Executive & stakeholder communication", "Technology roadmap & build-vs-buy", "Cost & budget ownership", "Published (AWS ML Blog co-author)", "AI-assisted development (Claude Code)"],
    },
    {
      category: "Languages",
      items: ["TypeScript", "Go", "JavaScript / Node.js", "C#", "C / C++", "Java", "SQL", "Apex"],
    },
  ],
};

export const resume: Resume = resumeSchema.parse(data);
