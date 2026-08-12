// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { resolveTheme, applyTheme, currentTheme } from "../src/lib/theme";

describe("theme", () => {
  it("stored value wins over system preference", () => {
    expect(resolveTheme("light", true)).toBe("light");
    expect(resolveTheme("dark", false)).toBe("dark");
  });

  it("falls back to system preference", () => {
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme(null, false)).toBe("light");
    expect(resolveTheme("garbage", true)).toBe("dark");
  });

  it("applies and reads the dark class", () => {
    applyTheme(document, "dark");
    expect(currentTheme(document)).toBe("dark");
    applyTheme(document, "light");
    expect(currentTheme(document)).toBe("light");
  });
});
