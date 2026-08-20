import { resume } from "./resume";
import type { Resume } from "./schema";

/**
 * The "lite" resume is a one-glance cut of the full data — the same validated
 * source, hand-curated down to the strongest bullet(s) per role and the top
 * project cards. Every role is kept (the 20-year range is part of the pitch);
 * only the bullet count shrinks. Used for the /lite view and the Lite exports.
 */
const LITE_ACHIEVEMENTS: Record<string, number[]> = {
  "Skillfaber (Independent)": [0, 1, 6, 7], // thesis, runtime, capability detect+polyfill, recipes
  "PDI Technologies": [0, 3, 4], // PDIQ+blog, agent framework, Salesforce mount (4→1 day)
  "Kazzcade": [2, 4], // sfSync codegen, customer portal
  "Under Armour": [0], // Endless Aisle, all US stores
  "Riptide Software": [1], // Waypoints → General Dynamics
  "NCR Corporation": [0], // Delta check-in
  "Toptech Systems": [0], // fuel-terminal real-time
  "Highwinds Software": [0], // CDN cache index
};

/** Lite keeps only the categories a screener scans for. */
const LITE_SKILLS = [
  "Agent Infrastructure",
  "Models & Providers",
  "Cloud, Infra & Delivery",
  "Languages",
];

const LITE_PROJECTS = [
  "Skillfaber — role-based agent platform",
  "Notitia — serverless RAG",
  "PDIQ — Enterprise RAG at PDI",
];

export const liteResume: Resume = {
  ...resume,
  highlights: resume.highlights.slice(0, 3),
  experience: resume.experience.map((role) => {
    const picks = LITE_ACHIEVEMENTS[role.company];
    return picks
      ? { ...role, achievements: picks.map((i) => role.achievements[i]) }
      : { ...role, achievements: role.achievements.slice(0, 2) };
  }),
  skills: LITE_SKILLS.map(
    (category) => resume.skills.find((g) => g.category === category)!
  ).filter(Boolean),
  projects: LITE_PROJECTS.map(
    (name) => resume.projects.find((p) => p.name === name)!
  ).filter(Boolean),
};

/**
 * The Extended cut is the full resume with the extended highlights reel
 * swapped in (metrics and third-party validation). Same bullets and roles as
 * Full; only the opening highlights differ.
 */
export const extendedResume: Resume = {
  ...resume,
  highlights: resume.extendedHighlights ?? resume.highlights,
};

export type Tier = "lite" | "full" | "extended";

export function resumeForTier(tier: Tier): Resume {
  if (tier === "lite") return liteResume;
  if (tier === "extended") return extendedResume;
  return resume;
}
