import { useEffect, useState } from "react";

export type View = "full" | "lite" | "extended";

const HASH_TO_VIEW: Record<string, View> = {
  "": "full",
  "#": "full",
  "#/": "full",
  "#/lite": "lite",
  "#/extended": "extended",
  "#/brag": "extended",
  "#/architecture": "extended",
};

export const VIEW_TO_HASH: Record<View, string> = {
  full: "#/",
  lite: "#/lite",
  extended: "#/extended",
};

function currentView(): View {
  return HASH_TO_VIEW[window.location.hash] ?? "full";
}

/** Reads the active view from the URL hash and tracks changes to it. */
export function useHashView(): View {
  const [view, setView] = useState<View>(currentView);
  useEffect(() => {
    const onChange = () => setView(currentView());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return view;
}
