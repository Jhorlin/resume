// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from "vitest";
import { injectWidget } from "../src/lib/widget";

describe("injectWidget", () => {
  beforeEach(() => {
    document.querySelectorAll("script[data-skillfaber-token]").forEach((s) => s.remove());
  });

  it("does nothing without a token", () => {
    expect(injectWidget(document, "https://skillfaber.com/embed.js", undefined)).toBe(false);
    expect(injectWidget(document, "https://skillfaber.com/embed.js", "")).toBe(false);
    expect(document.querySelector("script[data-skillfaber-token]")).toBeNull();
  });

  it("does nothing without a src", () => {
    expect(injectWidget(document, undefined, "wgt_test")).toBe(false);
    expect(document.querySelector("script[data-skillfaber-token]")).toBeNull();
  });

  it("appends the embed script when configured", () => {
    expect(injectWidget(document, "https://skillfaber.com/embed.js", "wgt_test")).toBe(true);
    const script = document.querySelector<HTMLScriptElement>("script[data-skillfaber-token]");
    expect(script?.src).toBe("https://skillfaber.com/embed.js");
    expect(script?.dataset.skillfaberToken).toBe("wgt_test");
    expect(script?.async).toBe(true);
  });
});
