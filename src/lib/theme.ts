export type Theme = "dark" | "light";

export function resolveTheme(stored: string | null, systemDark: boolean): Theme {
  if (stored === "dark" || stored === "light") return stored;
  return systemDark ? "dark" : "light";
}

export function currentTheme(doc: Document): Theme {
  return doc.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function applyTheme(doc: Document, theme: Theme): void {
  doc.documentElement.classList.toggle("dark", theme === "dark");
}
