import { resume } from "@/content/resume";

export function Footer() {
  const { profile } = resume;
  return (
    <footer className="mx-auto w-full max-w-2xl px-8 py-12 text-sm text-muted-foreground sm:px-12">
      <p>
        {profile.education.degree}, {profile.education.school} ({profile.education.year})
      </p>
      <p className="mt-2">
        {profile.emails.map((email, i) => (
          <span key={email}>
            {i > 0 && " · "}
            <a href={`mailto:${email}`} className="underline underline-offset-4">
              {email}
            </a>
          </span>
        ))}
        {" · "}
        {profile.location}
      </p>
      <p className="mt-4">
        © {new Date().getFullYear()} {profile.name}. Built with React 19, Tailwind v4, and SST. Chat powered by skillfaber.
      </p>
    </footer>
  );
}
