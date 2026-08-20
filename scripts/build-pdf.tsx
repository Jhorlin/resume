import { mkdirSync } from "node:fs";
import { renderToFile } from "@react-pdf/renderer";
import { ResumePdf } from "./resume-pdf";
import { writeResumeDocx } from "./resume-docx";
import { resumeForTier, type Tier } from "../src/content/tiers";
import { fileForTier } from "../src/lib/downloads";

mkdirSync("public", { recursive: true });

// One validated source → a PDF and a Word file per tier. The page's Download
// buttons resolve to the file matching whichever tier the reader is viewing,
// so the tier is in the filename and nothing collides in a Downloads folder.
const tiers: Tier[] = ["lite", "full", "extended"];

for (const tier of tiers) {
  const data = resumeForTier(tier);
  await renderToFile(<ResumePdf data={data} />, `public/${fileForTier(tier, "pdf")}`);
  await writeResumeDocx(data, `public/${fileForTier(tier, "docx")}`);
}

console.log(
  "Wrote " +
    tiers.flatMap((t) => [fileForTier(t, "pdf"), fileForTier(t, "docx")]).join(", ")
);
