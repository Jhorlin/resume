import { describe, it, expect } from "vitest";
import { formatMonth, formatRange } from "../src/lib/dates";

describe("dates", () => {
  it("formats a YYYY-MM month", () => {
    expect(formatMonth("2024-03")).toBe("Mar 2024");
  });

  it("formats a closed range", () => {
    expect(formatRange("2017-01", "2024-01")).toBe("Jan 2017 – Jan 2024");
  });

  it("formats an open range as Present", () => {
    expect(formatRange("2024-03", null)).toBe("Mar 2024 – Present");
  });
});
