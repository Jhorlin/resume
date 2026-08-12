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
