import { Section } from "@/components/Section";
import { useResume } from "@/content/context";
import { formatRange } from "@/lib/dates";

export function Experience() {
  const resume = useResume();
  return (
    <Section id="experience" title="Experience">
      <ol className="space-y-8">
        {resume.experience.map((job) => (
          <li key={`${job.company}-${job.start}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h3 className="font-semibold">
                {job.role} · {job.company}
              </h3>
              <span className="text-sm text-muted-foreground">{formatRange(job.start, job.end)}</span>
            </div>
            <p className="text-sm text-muted-foreground">{job.location}</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-relaxed">
              {job.achievements.map((achievement) => (
                <li key={achievement}>{achievement}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
