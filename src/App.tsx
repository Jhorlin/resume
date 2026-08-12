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
