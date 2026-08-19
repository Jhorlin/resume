import { describe, it, expect } from "vitest";
import { resume } from "../src/content/resume";
import { resumeSchema } from "../src/content/schema";
import { liteResume, resumeForTier } from "../src/content/tiers";

describe("lite resume", () => {
  it("still passes the schema", () => {
    expect(() => resumeSchema.parse(liteResume)).not.toThrow();
  });

  it("trims content without dropping roles", () => {
    const total = (r: typeof resume) =>
      r.experience.reduce((n, e) => n + e.achievements.length, 0);
    // Every role is kept (the 20-year range is part of the pitch)...
    expect(liteResume.experience.length).toBe(resume.experience.length);
    // ...but highlights, total bullets, and projects all shrink.
    expect(liteResume.highlights.length).toBeLessThan(resume.highlights.length);
    expect(total(liteResume)).toBeLessThan(total(resume));
    expect(liteResume.projects.length).toBeLessThan(resume.projects.length);
  });

  it("curates every role down to its picked bullets", () => {
    for (const role of liteResume.experience) {
      expect(role.achievements.length).toBeGreaterThan(0);
    }
    // Skillfaber is capped at its four strongest bullets.
    const sf = liteResume.experience.find((e) => e.company.includes("Skillfaber"));
    expect(sf?.achievements.length).toBe(4);
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
