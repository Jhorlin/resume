import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { resume } from "@/content/resume";

export function Hero() {
  const { profile } = resume;
  return (
    <header className="mx-auto w-full max-w-3xl px-6 pt-16 pb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{profile.name}</h1>
          <p className="mt-2 text-xl text-muted-foreground">{profile.headline}</p>
          <p className="mt-1 text-sm text-muted-foreground">{profile.location}</p>
        </div>
        <ThemeToggle />
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <a href="/JhorlinDeArmas-Resume.pdf" download>
            Download resume (PDF)
          </a>
        </Button>
        {profile.links.map((link) => (
          <Button key={link.url} variant="outline" asChild>
            <a href={link.url} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          </Button>
        ))}
      </div>
      {import.meta.env.VITE_SKILLFABER_WIDGET_TOKEN && (
        <p className="mt-4 text-sm text-muted-foreground">
          Have questions? Ask my AI assistant — bottom-right corner.
        </p>
      )}
    </header>
  );
}
