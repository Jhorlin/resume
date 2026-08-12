import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/Section";
import { resume } from "@/content/resume";

export function Skills() {
  return (
    <Section id="skills" title="Skills">
      <div className="space-y-4">
        {resume.skills.map((group) => (
          <div key={group.category}>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">{group.category}</h3>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <Badge key={item} variant="outline">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
