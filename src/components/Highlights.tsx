import { AnimatePresence, motion } from "framer-motion";
import { Section } from "@/components/Section";
import { useResume } from "@/content/context";
import { listItem } from "@/lib/anim";

export function Highlights() {
  const resume = useResume();
  return (
    <Section id="highlights" title="Highlights">
      <ul className="list-disc space-y-2 pl-5 leading-relaxed">
        <AnimatePresence initial={false}>
          {resume.highlights.map((item) => (
            <motion.li key={item} {...listItem}>
              {item}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Section>
  );
}
