import { lazy, Suspense } from "react";
import { MotionConfig } from "framer-motion";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Footer } from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { ResumeProvider } from "@/content/context";
import { resumeForTier } from "@/content/tiers";
import { useHashView } from "@/lib/useHashView";

// React Flow is heavy; only load it when the Architecture view is opened.
const Architecture = lazy(() =>
  import("@/components/Architecture").then((m) => ({ default: m.Architecture }))
);

export default function App() {
  const view = useHashView();
  const data = resumeForTier(
    view === "lite" ? "lite" : view === "extended" ? "brag" : "full"
  );

  return (
    // reducedMotion="user" makes every animation below respect the OS setting.
    <MotionConfig reducedMotion="user">
      <ResumeProvider data={data}>
        <main>
          <Hero />
          {view === "extended" && (
            <div className="mx-auto max-w-2xl px-8 sm:px-12">
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
          <div className="mx-auto max-w-2xl px-8 sm:px-12">
            <Separator />
          </div>
          <Highlights />
          <Experience />
          <Projects />
          {view === "extended" && (
            <Suspense
              fallback={
                <p className="mx-auto max-w-2xl px-8 py-10 text-sm text-muted-foreground sm:px-12">
                  Loading architecture diagrams…
                </p>
              }
            >
              <Architecture />
            </Suspense>
          )}
          <Skills />
          <div className="mx-auto max-w-2xl px-8 sm:px-12">
            <Separator />
          </div>
          <Footer />
        </main>
      </ResumeProvider>
    </MotionConfig>
  );
}
