import { describe, it, expect } from "vitest";
import { resume } from "../src/content/resume";
import { resumeSchema } from "../src/content/schema";
import { liteResume, resumeForTier } from "../src/content/tiers";

describe("lite resume", () => {
  it("still passes the schema", () => {
    expect(() => resumeSchema.parse(liteResume)).not.toThrow();
  });

  it("is a strict subset of the full resume", () => {
    expect(liteResume.highlights.length).toBeLessThan(resume.highlights.length);
    expect(liteResume.experience.length).toBeLessThan(resume.experience.length);
    expect(liteResume.projects.length).toBeLessThan(resume.projects.length);
  });

  it("keeps the two headline roles (Founder + current employer)", () => {
    const companies = liteResume.experience.map((e) => e.company);
    expect(companies.some((c) => c.includes("Skillfaber"))).toBe(true);
    expect(companies.some((c) => c.includes("PDI"))).toBe(true);
  });

  it("resolves every curated lite project (no missing names)", () => {
    expect(liteResume.projects.every(Boolean)).toBe(true);
    expect(liteResume.projects.length).toBe(3);
  });

  it("resumeForTier selects full vs lite", () => {
    expect(resumeForTier("full")).toBe(resume);
    expect(resumeForTier("lite")).toBe(liteResume);
  });
});
