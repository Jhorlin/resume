import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/Section";
import { useResume } from "@/content/context";

export function Projects() {
  const resume = useResume();
  return (
    <Section id="projects" title="Projects">
      <div className="space-y-6">
        {resume.projects.map((project) => (
          <Card key={project.name}>
            <CardHeader>
              <CardTitle>{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {project.outcomes.length > 0 && (
                <ul className="list-disc pl-5 text-sm leading-relaxed">
                  {project.outcomes.map((outcome) => (
                    <li key={outcome}>{outcome}</li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map((tech) => (
                  <Badge key={tech} variant="secondary">
                    {tech}
                  </Badge>
                ))}
              </div>
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm underline underline-offset-4"
                >
                  {link.label}
                </a>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
