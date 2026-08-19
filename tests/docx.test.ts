import { describe, it, expect } from "vitest";
import { Packer } from "docx";
import { buildResumeDoc } from "../scripts/resume-docx";
import { resume } from "../src/content/resume";
import { liteResume } from "../src/content/tiers";

describe("resume Word export", () => {
  it("renders a valid non-trivial .docx from the full resume", async () => {
    const buffer = await Packer.toBuffer(buildResumeDoc(resume));
    // .docx is a ZIP archive — magic bytes "PK".
    expect(buffer.subarray(0, 2).toString()).toBe("PK");
    expect(buffer.length).toBeGreaterThan(3_000);
  });

  it("renders a smaller .docx for the lite resume", async () => {
    const full = await Packer.toBuffer(buildResumeDoc(resume));
    const lite = await Packer.toBuffer(buildResumeDoc(liteResume));
    expect(lite.subarray(0, 2).toString()).toBe("PK");
    expect(lite.length).toBeLessThan(full.length);
  });
});
