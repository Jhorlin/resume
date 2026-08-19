import { resume } from "@/content/resume";

export function Footer() {
  const { profile } = resume;
  return (
    <footer className="mx-auto w-full max-w-3xl px-6 py-12 text-sm text-muted-foreground">
      <p>
        {profile.education.degree}, {profile.education.school} ({profile.education.year})
      </p>
      <p className="mt-2">
        <a href={`mailto:${profile.email}`} className="underline underline-offset-4">
          {profile.email}
        </a>
        {" · "}
        {profile.location}
      </p>
      <p className="mt-4">
        © {new Date().getFullYear()} {profile.name}. Built with React 19, Tailwind v4, and SST. Chat powered by skillfaber.
      </p>
    </footer>
  );
}
