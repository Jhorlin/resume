import { useEffect, useMemo, useRef, useState } from "react";
import { Search as SearchIcon, CornerDownLeft } from "lucide-react";
import { buildIndex, search, type SearchHit } from "@/lib/search";
import { VIEW_TO_HASH, type View } from "@/lib/useHashView";
import type { Tier } from "@/content/tiers";
import { cn } from "@/lib/utils";

const TIER_VIEW: Record<Tier, View> = { lite: "lite", full: "full", extended: "extended" };
const TIER_LABEL: Record<Tier, string> = { lite: "Lite", full: "Full", extended: "Extended" };

/** Wraps the matched terms so the eye lands on why a result matched. */
function Highlighted({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length) return <>{text}</>;
  const pattern = new RegExp(
    `(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "ig"
  );
  return (
    <>
      {text.split(pattern).map((part, i) =>
        pattern.test(part) && terms.some((t) => part.toLowerCase() === t.toLowerCase()) ? (
          <mark key={i} className="rounded-sm bg-primary/15 text-foreground">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export function Search({ tier }: { tier: Tier }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const index = useMemo(() => buildIndex(), []);
  const terms = useMemo(() => query.toLowerCase().split(/\s+/).filter(Boolean), [query]);
  const hits = useMemo(() => search(index, query), [index, query]);

  // Cmd/Ctrl+K or "/" opens search from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing =
        e.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA"].includes(e.target.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
    else {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  /** Switch tiers if the hit isn't visible here, then scroll to it and flash. */
  function goTo(hit: SearchHit) {
    setOpen(false);
    const needsTier = hit.tiers.includes(tier) ? tier : hit.tiers[0];
    if (needsTier !== tier) window.location.hash = VIEW_TO_HASH[TIER_VIEW[needsTier]];

    // Let the tier render (and its enter animation start) before scrolling.
    window.setTimeout(() => {
      const el = document.querySelector<HTMLElement>(`[data-sid="${hit.id}"]`);
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("search-flash");
      window.setTimeout(() => el.classList.remove("search-flash"), 1600);
    }, needsTier !== tier ? 260 : 60);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && hits[active]) {
      e.preventDefault();
      goTo(hits[active]);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Search the résumé"
      >
        <SearchIcon className="size-3.5" aria-hidden />
        Search
        <kbd className="ml-1 hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-background/70 p-4 pt-[10vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search the résumé"
            className="w-full max-w-xl overflow-hidden rounded-xl border bg-background shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b px-4">
              <SearchIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search every version — try “checkpoint”, “Okta”, “evals”…"
                className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="max-h-[55vh] overflow-y-auto">
              {query && !hits.length && (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No matches for “{query}”.
                </p>
              )}

              {hits.map((hit, i) => {
                const elsewhere = !hit.tiers.includes(tier);
                return (
                  <button
                    key={hit.id}
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => goTo(hit)}
                    className={cn(
                      "block w-full border-b px-4 py-3 text-left last:border-b-0",
                      i === active && "bg-muted/60"
                    )}
                  >
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{hit.section}</span>
                      {hit.context && <span>· {hit.context}</span>}
                      {elsewhere && (
                        <span className="rounded border border-primary/40 bg-primary/5 px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                          in {hit.tiers.map((t) => TIER_LABEL[t]).join(" / ")}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm leading-snug">
                      <Highlighted text={hit.text} terms={terms} />
                    </p>
                  </button>
                );
              })}

              {!query && (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Searches every version at once. A result that lives in another
                  version is labelled, and opening it switches you there.
                </p>
              )}
            </div>

            {hits.length > 0 && (
              <div className="flex items-center gap-3 border-t px-4 py-2 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CornerDownLeft className="size-3" aria-hidden /> open
                </span>
                <span>↑↓ navigate</span>
                <span>esc close</span>
                <span className="ml-auto">
                  {hits.length} result{hits.length === 1 ? "" : "s"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
