import { describe, it, expect } from "vitest";
import { resume } from "../src/content/resume";
import { resumeSchema } from "../src/content/schema";

describe("resume content", () => {
  it("passes the schema", () => {
    expect(() => resumeSchema.parse(resume)).not.toThrow();
  });

  it("is reverse-chronological", () => {
    const starts = resume.experience.map((e) => e.start);
    const sorted = [...starts].sort((a, b) => b.localeCompare(a));
    expect(starts).toEqual(sorted);
  });

  it("features PDI as current and Kazzcade ending 2024-01", () => {
    const pdi = resume.experience.find((e) => e.company.includes("PDI"));
    const kazzcade = resume.experience.find((e) => e.company === "Kazzcade");
    expect(pdi?.start).toBe("2024-03");
    expect(pdi?.end).toBeNull();
    expect(kazzcade?.end).toBe("2024-01");
  });
});
