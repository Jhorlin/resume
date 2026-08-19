import { Section } from "@/components/Section";
import { useResume } from "@/content/context";

export function Highlights() {
  const resume = useResume();
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
