import { describe, it, expect } from "vitest";
import { resumeSchema } from "../src/content/schema";

const valid = {
  profile: {
    name: "Test Person",
    headline: "Engineer",
    location: "Orlando, FL",
    email: "test@example.com",
    links: [{ label: "LinkedIn", url: "https://linkedin.com/in/test" }],
    education: { school: "UCF", degree: "BS Computer Science", year: 2006 },
  },
  highlights: ["one", "two", "three"],
  experience: [
    {
      company: "Acme",
      role: "Architect",
      location: "Remote",
      start: "2024-03",
      end: null,
      achievements: ["did a thing"],
    },
  ],
  projects: [
    {
      name: "Proj",
      description: "desc",
      outcomes: ["shipped"],
      tech: ["TypeScript"],
      links: [{ label: "Site", url: "https://example.com" }],
    },
  ],
  skills: [{ category: "Languages", items: ["TypeScript"] }],
};

describe("resumeSchema", () => {
  it("accepts a valid resume", () => {
    expect(() => resumeSchema.parse(valid)).not.toThrow();
  });

  it("rejects non-YYYY-MM dates", () => {
    const bad = structuredClone(valid);
    bad.experience[0]!.start = "March 2024";
    expect(() => resumeSchema.parse(bad)).toThrow();
  });

  it("rejects invalid URLs", () => {
    const bad = structuredClone(valid);
    bad.profile.links[0]!.url = "not-a-url";
    expect(() => resumeSchema.parse(bad)).toThrow();
  });

  it("requires at least 3 highlights", () => {
    const bad = structuredClone(valid);
    bad.highlights = ["only", "two"];
    expect(() => resumeSchema.parse(bad)).toThrow();
  });
});
