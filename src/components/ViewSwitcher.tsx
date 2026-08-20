import { VIEW_TO_HASH, type View } from "@/lib/useHashView";
import { cn } from "@/lib/utils";

const TABS: { view: View; label: string }[] = [
  { view: "lite", label: "Lite" },
  { view: "full", label: "Full" },
  { view: "extended", label: "Extended" },
];

export function ViewSwitcher({ active }: { active: View }) {
  return (
    <nav
      aria-label="Resume view"
      className="inline-flex rounded-lg border bg-muted/40 p-1 text-sm"
    >
      {TABS.map((tab) => {
        const isActive = tab.view === active;
        return (
          <a
            key={tab.view}
            href={VIEW_TO_HASH[tab.view]}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-1 font-medium transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </a>
        );
      })}
    </nav>
  );
}
