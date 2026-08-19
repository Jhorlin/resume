/**
 * Shared enter/exit for tier-varying list items. Content-keyed items that
 * persist across tiers keep their DOM node (no re-animation); items the tier
 * adds animate in, items it removes animate out, and `layout` slides the
 * survivors to close the gap. Wrap the mapped items in
 * <AnimatePresence initial={false}> so nothing animates on first paint.
 */
export const listItem = {
  layout: true,
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.3, ease: [0.2, 0.7, 0.2, 1] as const },
} as const;
