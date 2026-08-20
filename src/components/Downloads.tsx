import { ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fileForTier } from "@/lib/downloads";
import type { Tier } from "@/content/tiers";

const ALL: { tier: Tier; label: string; blurb: string }[] = [
  { tier: "lite", label: "Lite", blurb: "one-page-feel skim" },
  { tier: "full", label: "Full", blurb: "every role and project" },
  { tier: "extended", label: "Extended", blurb: "full plus the highlights reel" },
];

/** Downloads follow the tier on screen; every version stays one click away. */
export function Downloads({ tier }: { tier: Tier }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Download:</span>
        <Button size="sm" asChild>
          <a href={`/${fileForTier(tier, "pdf")}`} download>
            <Download aria-hidden />
            PDF
          </a>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <a href={`/${fileForTier(tier, "docx")}`} download>
            <Download aria-hidden />
            Word
          </a>
        </Button>
      </div>

      <details className="group text-sm">
        <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
          All versions
          <ChevronDown
            aria-hidden
            className="size-3.5 transition-transform group-open:rotate-180"
          />
        </summary>
        <ul className="mt-2 flex flex-col gap-1.5 border-l pl-3">
          {ALL.map((v) => (
            <li key={v.tier} className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-medium">{v.label}</span>
              <span className="text-xs text-muted-foreground">{v.blurb}</span>
              <a
                href={`/${fileForTier(v.tier, "pdf")}`}
                download
                className="underline underline-offset-4 hover:text-foreground"
              >
                PDF
              </a>
              <span className="text-muted-foreground">·</span>
              <a
                href={`/${fileForTier(v.tier, "docx")}`}
                download
                className="underline underline-offset-4 hover:text-foreground"
              >
                Word
              </a>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
