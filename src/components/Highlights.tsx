import { Section } from "@/components/Section";
import { useIsNew, useResume } from "@/content/context";

export function Highlights() {
  const resume = useResume();
  const isNew = useIsNew();
  return (
    <Section id="highlights" title="Highlights">
      <ul className="list-disc space-y-2 pl-5 leading-relaxed">
        {resume.highlights.map((item) => (
          <li key={item} className={isNew(item) ? "tier-in" : undefined}>{item}</li>
        ))}
      </ul>
    </Section>
  );
}
