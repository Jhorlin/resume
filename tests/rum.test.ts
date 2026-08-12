// @vitest-environment happy-dom
import { describe, it, expect } from "vitest";
import { initRum } from "../src/lib/rum";

describe("initRum", () => {
  it("does nothing when config is incomplete", () => {
    expect(initRum({})).toBe(false);
    expect(initRum({ id: "abc", region: "us-east-1" })).toBe(false);
    expect(document.querySelector("script[data-rum]")).toBeNull();
  });

  it("injects the CloudWatch RUM loader when fully configured", () => {
    const ok = initRum({
      id: "abc",
      region: "us-east-1",
      identityPoolId: "us-east-1:pool",
      guestRoleArn: "arn:aws:iam::123:role/guest",
    });
    expect(ok).toBe(true);
    const script = document.querySelector<HTMLScriptElement>("script[data-rum]");
    expect(script?.src).toContain("client.rum.us-east-1.amazonaws.com");
    expect((window as { AwsRumClient?: { i: string } }).AwsRumClient?.i).toBe("abc");
  });
});
