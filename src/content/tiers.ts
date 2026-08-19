import { resume } from "./resume";
import type { Resume } from "./schema";

/**
 * The "lite" resume is a one-glance subset of the full data — same validated
 * source, fewer items. Used for the /lite view and the Lite PDF/Word exports.
 * We keep the two headline roles (Founder + current employer), the sharpest
 * highlights, and the strongest project cards.
 */
const LITE_PROJECTS = [
  "Skillfaber — role-based agent platform",
  "Notitia — serverless RAG",
  "PDIQ — Enterprise RAG at PDI",
];

export const liteResume: Resume = {
  ...resume,
  highlights: resume.highlights.slice(0, 3),
  experience: resume.experience.slice(0, 2),
  projects: LITE_PROJECTS.map(
    (name) => resume.projects.find((p) => p.name === name)!
  ).filter(Boolean),
};

export type Tier = "lite" | "full";

export function resumeForTier(tier: Tier): Resume {
  return tier === "lite" ? liteResume : resume;
}
