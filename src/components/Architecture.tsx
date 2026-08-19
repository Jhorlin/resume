import { useEffect, useState } from "react";
import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Section } from "@/components/Section";
import { cn } from "@/lib/utils";

/** Follows the site's class-based dark mode so React Flow chrome matches. */
function useThemeMode(): "dark" | "light" {
  const [mode, setMode] = useState<"dark" | "light">(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light"
  );
  useEffect(() => {
    const obs = new MutationObserver(() =>
      setMode(document.documentElement.classList.contains("dark") ? "dark" : "light")
    );
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return mode;
}

type BoxData = { label: string; sub?: string; tone?: "accent" | "plain" };

function BoxNode({ data }: NodeProps) {
  const d = data as BoxData;
  return (
    <div
      className={cn(
        "max-w-[220px] rounded-lg border px-3 py-2 text-left shadow-sm",
        d.tone === "accent"
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-card-foreground"
      )}
    >
      <div className="text-xs font-semibold leading-tight">{d.label}</div>
      {d.sub && (
        <div
          className={cn(
            "mt-0.5 text-[10px] leading-tight",
            d.tone === "accent" ? "text-primary-foreground/80" : "text-muted-foreground"
          )}
        >
          {d.sub}
        </div>
      )}
      <Handle id="t-top" type="target" position={Position.Top} className="!opacity-0" />
      <Handle id="t-left" type="target" position={Position.Left} className="!opacity-0" />
      <Handle id="t-right" type="target" position={Position.Right} className="!opacity-0" />
      <Handle id="t-bottom" type="target" position={Position.Bottom} className="!opacity-0" />
      <Handle id="s-top" type="source" position={Position.Top} className="!opacity-0" />
      <Handle id="s-left" type="source" position={Position.Left} className="!opacity-0" />
      <Handle id="s-right" type="source" position={Position.Right} className="!opacity-0" />
      <Handle id="s-bottom" type="source" position={Position.Bottom} className="!opacity-0" />
    </div>
  );
}

const nodeTypes = { box: BoxNode };

function box(
  id: string,
  x: number,
  y: number,
  label: string,
  sub?: string,
  tone: "accent" | "plain" = "plain"
): Node {
  return { id, type: "box", position: { x, y }, data: { label, sub, tone } };
}

function edge(
  id: string,
  source: string,
  target: string,
  label: string,
  sourceHandle = "s-right",
  targetHandle = "t-left"
): Edge {
  return {
    id,
    source,
    target,
    sourceHandle,
    targetHandle,
    label,
    animated: true,
    labelBgPadding: [4, 2],
    labelBgBorderRadius: 4,
    style: { strokeWidth: 1.5 },
  };
}

// ── Diagram 1: the Skillfaber agent runtime ────────────────────────────────
const RUNTIME_NODES: Node[] = [
  box("client", 0, 150, "Browser", "widget / web app"),
  box("stream", 240, 150, "ChatStream Lambda", "thin trigger, validates + dispatches"),
  box("async", 500, 150, "ChatAsync Lambda", "the ReACT agent loop", "accent"),
  box("attempt", 500, 10, "Per attempt", "capability detect → tool calls (MCP / native)"),
  box("checkpoint", 500, 300, "S3 checkpoint", "full loop state serialized"),
  box("mqtt", 800, 235, "IoT MQTT stream", "seq-continuous, reconnect-safe"),
];
const RUNTIME_EDGES: Edge[] = [
  edge("e1", "client", "stream", "POST"),
  edge("e2", "stream", "async", "async invoke (twin)"),
  edge("e3", "attempt", "async", "per turn", "s-bottom", "t-top"),
  edge("e4", "async", "checkpoint", "~15-min limit", "s-bottom", "t-top"),
  edge("e5", "checkpoint", "async", "self-invoke & resume", "s-left", "t-bottom"),
  edge("e6", "async", "mqtt", "stream deltas", "s-right", "t-left"),
  edge("e7", "mqtt", "client", "over IoT (survives reconnect)", "s-bottom", "t-bottom"),
];

// ── Diagram 2: the Skillfaber ecosystem ────────────────────────────────────
const ECO_NODES: Node[] = [
  box("channels", 0, 150, "Channels", "web · widget · Slack · email · Salesforce"),
  box("skillfaber", 300, 150, "Skillfaber", "role-based agent platform", "accent"),
  box("bedrock", 620, 150, "Bedrock + AgentCore", "models · 128 MCP tool integrations"),
  box("notitia", 300, 10, "Notitia", "serverless RAG (Go) — knowledge"),
  box("sessio", 300, 300, "Sessio", "meetings + transcripts (MCP)"),
  box("issue", 620, 300, "Issue-agent (CI)", "codes issues → opens PRs"),
];
const ECO_EDGES: Edge[] = [
  edge("c1", "channels", "skillfaber", "requests"),
  edge("c2", "skillfaber", "bedrock", "models + tools"),
  edge("c3", "notitia", "skillfaber", "RAG knowledge", "s-bottom", "t-top"),
  edge("c4", "sessio", "skillfaber", "meet MCP + transcripts", "s-top", "t-bottom"),
  edge("c5", "issue", "skillfaber", "builds & extends it", "s-left", "t-bottom"),
];

function Diagram({
  title,
  caption,
  nodes,
  edges,
  mode,
}: {
  title: string;
  caption: string;
  nodes: Node[];
  edges: Edge[];
  mode: "dark" | "light";
}) {
  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{caption}</p>
      <div className="mt-3 h-[420px] w-full overflow-hidden rounded-xl border">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          colorMode={mode}
          fitView
          fitViewOptions={{ padding: 0.15 }}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          zoomOnScroll={false}
          panOnScroll
          preventScrolling={false}
        >
          <Background gap={16} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
}

export function Architecture() {
  const mode = useThemeMode();
  return (
    <Section id="architecture" title="Architecture">
      <p className="text-sm text-muted-foreground">
        Interactive diagrams of the systems behind this résumé. Drag to pan, scroll inside a
        panel to move, use the controls to zoom.
      </p>
      <Diagram
        title="Skillfaber agent runtime"
        caption="A checkpoint-and-continue loop chains 15-minute Lambdas into unbounded agent turns; the browser streams over IoT MQTT so a reconnect never loses the turn."
        nodes={RUNTIME_NODES}
        edges={RUNTIME_EDGES}
        mode={mode}
      />
      <Diagram
        title="The ecosystem"
        caption="One founder-built suite: Skillfaber is the platform; Notitia supplies RAG, Sessio supplies meeting transcripts, and an in-CI issue-agent helps build it."
        nodes={ECO_NODES}
        edges={ECO_EDGES}
        mode={mode}
      />
    </Section>
  );
}
