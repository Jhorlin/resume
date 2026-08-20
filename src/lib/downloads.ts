import type { Tier } from "@/content/tiers";

/**
 * Download filenames, shared by the build script and the UI so the two can
 * never disagree. The tier is part of the name: a reader who grabs more than
 * one gets distinct files instead of "(1)" collisions.
 */
const TIER_LABEL: Record<Tier, string> = {
  lite: "Lite",
  full: "Full",
  extended: "Extended",
};

export function fileForTier(tier: Tier, ext: "pdf" | "docx"): string {
  return `JhorlinDeArmas-Resume-${TIER_LABEL[tier]}.${ext}`;
}
