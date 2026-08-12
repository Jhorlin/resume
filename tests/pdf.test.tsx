import { describe, it, expect } from "vitest";
import { renderToBuffer } from "@react-pdf/renderer";
import { ResumePdf } from "../scripts/resume-pdf";

describe("ResumePdf", () => {
  it("renders a valid non-trivial PDF from resume content", { timeout: 30_000 }, async () => {
    const buffer = await renderToBuffer(<ResumePdf />);
    expect(buffer.subarray(0, 5).toString()).toBe("%PDF-");
    expect(buffer.length).toBeGreaterThan(5_000);
  });
});
