import { lazy, Suspense } from "react";
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
  const data = resumeForTier(view === "lite" ? "lite" : "full");

  return (
    <ResumeProvider data={data}>
      <main>
        <Hero />
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
    </ResumeProvider>
  );
}
