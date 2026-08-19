import { createContext, useContext, type ReactNode } from "react";
import { resume } from "./resume";
import type { Resume } from "./schema";

const ResumeContext = createContext<Resume>(resume);

export function ResumeProvider({
  data,
  children,
}: {
  data: Resume;
  children: ReactNode;
}) {
  return <ResumeContext.Provider value={data}>{children}</ResumeContext.Provider>;
}

/** The active resume dataset for the current view (full or lite). */
export function useResume(): Resume {
  return useContext(ResumeContext);
}

/**
 * Tier-transition awareness: tells a component whether a piece of text is NEW
 * relative to the previously shown tier, so only the added content animates in
 * when the reader steps Lite → Full → Bragging.
 */
const NewContentContext = createContext<(text: string) => boolean>(() => false);

export function NewContentProvider({
  isNew,
  children,
}: {
  isNew: (text: string) => boolean;
  children: ReactNode;
}) {
  return <NewContentContext.Provider value={isNew}>{children}</NewContentContext.Provider>;
}

/** Returns true when this text was not present in the previously viewed tier. */
export function useIsNew(): (text: string) => boolean {
  return useContext(NewContentContext);
}
