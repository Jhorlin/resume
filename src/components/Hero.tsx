import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Downloads } from "@/components/Downloads";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import { resume } from "@/content/resume";
import { useHashView } from "@/lib/useHashView";

export function Hero() {
  const { profile } = resume;
  const view = useHashView();
  return (
    <header className="mx-auto w-full max-w-3xl px-8 pt-16 pb-6 sm:px-12">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
          <p className="mt-2 text-xl text-muted-foreground">{profile.headline}</p>
          <p className="mt-1 text-sm text-muted-foreground">{profile.location}</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="mt-6">
        <ViewSwitcher active={view} />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <Downloads />
        <div className="flex flex-wrap gap-2">
          {profile.links.map((link) => (
            <Button key={link.url} variant="ghost" size="sm" asChild>
              <a href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </Button>
          ))}
        </div>
      </div>

      {import.meta.env.VITE_SKILLFABER_WIDGET_TOKEN && (
        <p className="mt-4 text-sm text-muted-foreground">
          Have questions? Ask my AI assistant in the bottom-right corner.
        </p>
      )}
    </header>
  );
}
