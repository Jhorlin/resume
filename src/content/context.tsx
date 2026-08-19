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
