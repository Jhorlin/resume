import { lazy, Suspense, useEffect, useMemo, useRef } from "react";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Footer } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { NewContentProvider, ResumeProvider } from "@/content/context";
import { resumeForTier } from "@/content/tiers";
import type { Resume } from "@/content/schema";
import { useHashView } from "@/lib/useHashView";

// React Flow is heavy; only load it when the Architecture view is opened.
const Architecture = lazy(() =>
  import("@/components/Architecture").then((m) => ({ default: m.Architecture }))
);

/** Every display string a tier can add or remove — the animation diff set. */
function collectStrings(r: Resume): Set<string> {
  const set = new Set<string>(r.highlights);
  for (const job of r.experience) for (const a of job.achievements) set.add(a);
  for (const p of r.projects) set.add(p.name);
  return set;
}

export default function App() {
  const view = useHashView();
  const data = resumeForTier(
    view === "lite" ? "lite" : view === "extended" ? "brag" : "full"
  );

  // Remember the previously shown tier's content; text absent from it animates
  // in, so stepping Lite → Full → Bragging visibly reveals the added material.
  const prevRef = useRef<Resume | null>(null);
  const prev = prevRef.current;
  useEffect(() => {
    prevRef.current = data;
  }, [data]);
  const isNew = useMemo(() => {
    if (!prev || prev === data) return () => false;
    const shown = collectStrings(prev);
    return (text: string) => !shown.has(text);
  }, [prev, data]);

  return (
    <ResumeProvider data={data}>
      <NewContentProvider isNew={isNew}>
      <main>
        <Hero />
        {view === "extended" && (
          <div className="mx-auto max-w-3xl px-6">
            <div className="rounded-lg border border-primary/40 bg-primary/5 px-5 py-4">
              <p className="text-sm font-semibold tracking-tight">
                Now you're just bragging.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                The extended cut — every bullet, plus live, interactive diagrams of the
                systems behind the work. You asked for it.
              </p>
            </div>
          </div>
        )}
        <Separator className="mx-auto max-w-3xl" />
        <Highlights />
        <Experience />
        <Projects />
        {view === "extended" && (
          <Suspense
            fallback={
              <p className="mx-auto max-w-3xl px-6 py-10 text-sm text-muted-foreground">
                Loading architecture diagrams…
              </p>
            }
          >
            <Architecture />
          </Suspense>
        )}
        <Skills />
        <Separator className="mx-auto max-w-3xl" />
        <Footer />
      </main>
      </NewContentProvider>
    </ResumeProvider>
  );
}
