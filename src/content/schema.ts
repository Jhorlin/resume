import { z } from "zod";

const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, "expected YYYY-MM");

export const linkSchema = z.object({
  label: z.string().min(1),
  url: z.url(),
});

export const experienceSchema = z.object({
  company: z.string().min(1),
  /** Optional company website; renders the company name as a link. */
  url: z.url().optional(),
  role: z.string().min(1),
  location: z.string().min(1),
  start: month,
  end: month.nullable(),
  achievements: z.array(z.string().min(1)).min(1),
});

export const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  outcomes: z.array(z.string().min(1)),
  tech: z.array(z.string().min(1)).min(1),
  links: z.array(linkSchema),
});

export const resumeSchema = z.object({
  profile: z.object({
    name: z.string().min(1),
    headline: z.string().min(1),
    location: z.string().min(1),
    /** Contact addresses, primary first. */
    emails: z.array(z.email()).min(1),
    links: z.array(linkSchema).min(1),
    education: z.object({
      school: z.string().min(1),
      degree: z.string().min(1),
      year: z.number().int(),
    }),
  }),
  highlights: z.array(z.string().min(1)).min(3).max(5),
  // Extended highlights reel, shown only on the Extended view.
  extendedHighlights: z.array(z.string().min(1)).min(3).max(12).optional(),
  experience: z.array(experienceSchema).min(1),
  projects: z.array(projectSchema).min(1),
  /** Deep-dive project cards, appended only on the Extended view. */
  extendedProjects: z.array(projectSchema).optional(),
  skills: z.array(
    z.object({ category: z.string().min(1), items: z.array(z.string().min(1)).min(1) })
  ).min(1),
});

export type Resume = z.infer<typeof resumeSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Project = z.infer<typeof projectSchema>;
export type Link = z.infer<typeof linkSchema>;
