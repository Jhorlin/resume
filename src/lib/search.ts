import { resume } from "@/content/resume";
import { liteResume, extendedResume, type Tier } from "@/content/tiers";

export type Section = "Highlights" | "Experience" | "Projects" | "Skills";

export interface SearchEntry {
  /** Stable id, also rendered as data-sid so a hit can be scrolled to. */
  id: string;
  text: string;
  section: Section;
  /** Company or project the entry belongs to, shown as result context. */
  context?: string;
  /** Which tiers actually display this entry. */
  tiers: Tier[];
  haystack: string;
}

export interface SearchHit extends SearchEntry {
  score: number;
}

/** Deterministic short id from the entry's own text. */
export function sid(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return `s${(h >>> 0).toString(36)}`;
}

/** Every string a tier renders, so we can compute per-entry tier membership. */
function visibleText(tier: Tier): Set<string> {
  const r = tier === "lite" ? liteResume : tier === "extended" ? extendedResume : resume;
  const set = new Set<string>(r.highlights);
  for (const job of r.experience) for (const a of job.achievements) set.add(a);
  for (const p of r.projects) {
    set.add(p.name);
    set.add(p.description);
    for (const o of p.outcomes) set.add(o);
  }
  for (const g of r.skills) set.add(g.category + ": " + g.items.join(", "));
  return set;
}

const TIERS: Tier[] = ["lite", "full", "extended"];

export function buildIndex(): SearchEntry[] {
  const visible = new Map<Tier, Set<string>>(TIERS.map((t) => [t, visibleText(t)]));
  const tiersFor = (text: string) => TIERS.filter((t) => visible.get(t)!.has(text));

  const add = (
    out: SearchEntry[],
    text: string,
    section: Section,
    context?: string
  ) => {
    const tiers = tiersFor(text);
    if (!tiers.length) return; // never rendered anywhere
    out.push({
      id: sid(text),
      text,
      section,
      context,
      tiers,
      haystack: `${text} ${context ?? ""} ${section}`.toLowerCase(),
    });
  };

  const out: SearchEntry[] = [];

  // Highlights: the union of the standard reel and the Extended one.
  for (const h of new Set([...resume.highlights, ...(resume.extendedHighlights ?? [])])) {
    add(out, h, "Highlights");
  }
  for (const job of resume.experience) {
    for (const a of job.achievements) add(out, a, "Experience", `${job.role} · ${job.company}`);
  }
  for (const p of resume.projects) {
    add(out, p.description, "Projects", p.name);
    for (const o of p.outcomes) add(out, o, "Projects", p.name);
  }
  for (const g of resume.skills) {
    add(out, `${g.category}: ${g.items.join(", ")}`, "Skills", g.category);
  }
  return out;
}

/**
 * Token-AND matching: every whitespace-separated term must appear. Ranks whole
 * word matches and earlier matches above mid-word ones so "rag" surfaces the
 * RAG bullets before "storage".
 */
export function search(index: SearchEntry[], query: string, limit = 12): SearchHit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];

  const hits: SearchHit[] = [];
  for (const entry of index) {
    let score = 0;
    let matchedAll = true;
    for (const term of terms) {
      const at = entry.haystack.indexOf(term);
      if (at === -1) {
        matchedAll = false;
        break;
      }
      score += 10;
      if (new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(entry.haystack)) {
        score += 8; // starts a word
      }
      score += Math.max(0, 6 - at / 40); // earlier is better
    }
    if (matchedAll) hits.push({ ...entry, score });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
