import { resumeSchema, type Resume } from "./schema";

const data: Resume = {
  profile: {
    name: "Jhorlin De Armas",
    headline: "AI Agent Infrastructure & Platform Engineer",
    location: "Lake Mary, FL · Remote",
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
    "I build agent harnesses — the runtime around the model: tool-use loops, streaming, capability detection, metering, and evals — on AWS, in TypeScript and Go.",
    "Founder of Skillfaber, a production role-based AI agent platform on Amazon Bedrock: ~270 Lambdas, 128 MCP tool integrations, a checkpoint-and-continue runtime for unbounded agent turns. The assistant on this page runs on it.",
    "Co-author of the AWS Machine Learning Blog post on PDIQ, PDI's enterprise RAG system — answer approval measured 60% → 79%.",
    "Eval-driven: benchmarked a hybrid retriever at 86% qrels-hit@k on SciFact with regression floors in CI; every claim here is measured, not asserted.",
    "20 years shipping software; the last decade architecting AI and serverless systems on AWS — and mentoring teams to build with AI-native tooling.",
  ],
  experience: [
    {
      company: "Skillfaber (Independent)",
      role: "Founder & Principal Engineer",
      location: "Remote",
      start: "2025-01",
      end: null,
      achievements: [
        "Founded Skillfaber on the thesis that an organization's roles should define the guardrails an agent runs under, and a role's skills are the vendor services a person in it uses — solo-built into a production, multi-tenant AI agent platform on Amazon Bedrock (~270 Lambdas, fully serverless on SST/Pulumi).",
        "Built the agent runtime: a checkpoint-and-continue loop that chains 15-minute Lambdas into unbounded agent turns — full loop state serialized to S3 and resumed across self-invocations, with sequence-continuous client streams over IoT MQTT that survive reconnects.",
        "Engineered a probe-derived model-capability system: a paired-measurement harness detects each model's real support for tool use, structured output, thinking, caching, and modalities, then adapts per attempt — substituting reader tools for missing modalities and failing loud where silent emulation would fabricate.",
        "Designed usage metering and time-series analytics: a single-compute-site billing invariant enforced by custom CI guards, conflict-free allocation accounting via EventBridge Pipe FIFO re-keying, and Athena partition-projection reporting — billing code held to 100% per-file test coverage.",
        "Integrated 128 third-party services (Salesforce, Workday, NetSuite, SAP, and more) as MCP tools behind an AWS Bedrock AgentCore Gateway, and shipped an issue-to-PR coding agent in CI: mentioning the bot on a GitHub issue runs a credential-free container that codes the issue, adversarially self-reviews, and opens a human-gated PR.",
        "Built the surrounding platform solo: Sessio, a Chime-SDK meeting platform whose transcripts feed agents (wired in as an MCP with Cognito JWT pass-through so agents act as the calling user), and Notitia, a serverless-first RAG service in Go (pgvector/Aurora; two-phase binary-quantized hybrid retrieval reranked with Cohere, benchmarked at 86% qrels-hit@k on SciFact).",
      ],
    },
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
        "Mounted the PDIQ assistant directly onto Salesforce case pages for support agents by reusing the platform wholesale — a thin Salesforce adapter over the unchanged app — bridged by an asymmetric-key SSO: Salesforce mints an RS256 JWT signed with its private key, Cognito verifies it against the public certificate via a custom-auth challenge and JIT-provisions the user. Selected over a third-party vendor and Salesforce's native AI, and adopted by the support org.",
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
      name: "Skillfaber — role-based agent platform",
      description:
        "A production, multi-tenant AI agent platform on Amazon Bedrock, built solo: compose a role (model + guardrails + knowledge + tools) and reach it from web, an embeddable widget, email, Slack, or agent-to-agent delegation. The assistant on this page is a Skillfaber agent.",
      outcomes: [
        "Checkpoint-and-continue runtime chains 15-minute Lambdas into unbounded agent turns; client streams over IoT MQTT survive reconnects",
        "Probe-derived model-capability catalog adapts tool-use, structured output, and thinking per model, per attempt — failing loud instead of fabricating",
        "128 MCP tool integrations behind a Bedrock AgentCore Gateway; usage metering with billing code held to 100% per-file coverage",
      ],
      tech: ["Amazon Bedrock", "AgentCore", "SST/Pulumi", "Lambda", "DynamoDB", "IoT Core", "Athena", "TypeScript"],
      links: [{ label: "skillfaber.com", url: "https://skillfaber.com" }],
    },
    {
      name: "Notitia — serverless RAG",
      description:
        "A serverless-first, multi-tenant RAG service in Go for clients with large corpora — designed as a drop-in knowledge layer for Skillfaber. Retrieval quality is measured, not assumed.",
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
        "A self-built video-meeting platform on the AWS Chime SDK whose recordings and transcripts feed Skillfaber agents — built so agents learn from real meetings while being tuned for customers.",
      outcomes: [
        "Chime meetings, media-pipeline recording, and Amazon Transcribe with custom transcript assembly (S3 NDJSON → dedup → WebVTT)",
        "Wired into Skillfaber as an MCP whose 28 tools are 21 auto-generated from its own GraphQL schema — proving the platform's codegen generalizes",
        "Cognito JWT pass-through so an agent acts as the calling user, with that user's permissions",
      ],
      tech: ["AWS Chime SDK", "Amazon Transcribe", "AppSync", "DynamoDB", "SST/Pulumi", "React 19", "TypeScript"],
      links: [],
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
        "A live demo of my own platform: the AI assistant answering questions here is a Skillfaber agent. One typed TypeScript module renders this page, the downloadable PDF and Word resumes, and the interactive architecture view — so nothing can drift.",
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
      items: ["Agent runtimes / tool-use loops", "MCP", "Multi-model orchestration", "Model capability detection", "Evals & benchmarking", "RAG & hybrid retrieval", "Streaming (SSE / MQTT)", "Context engineering", "Usage metering", "Sandboxed agent execution"],
    },
    {
      category: "AI & Data",
      items: ["Amazon Bedrock", "AgentCore", "Cohere / Titan embeddings", "pgvector", "Aurora PostgreSQL", "DynamoDB", "Athena", "Redshift", "QLDB", "Redis"],
    },
    {
      category: "Cloud & Infra",
      items: ["AWS Lambda", "AppSync", "SQS / SNS", "EventBridge", "IoT Core", "CloudFront", "Cognito", "Fargate / ECS", "SST / Pulumi", "CDK", "CloudFormation", "Docker", "Kubernetes"],
    },
    {
      category: "Languages",
      items: ["TypeScript", "Go", "JavaScript / Node.js", "React", "C#", "C/C++", "Java", "SQL", "Salesforce Apex"],
    },
  ],
};

export const resume: Resume = resumeSchema.parse(data);
