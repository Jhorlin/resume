import { mkdirSync } from "node:fs";
import { renderToFile } from "@react-pdf/renderer";
import { ResumePdf } from "./resume-pdf";
import { writeResumeDocx } from "./resume-docx";
import { resume } from "../src/content/resume";
import { liteResume } from "../src/content/tiers";

mkdirSync("public", { recursive: true });

// One validated source → four downloadable artifacts (full + lite, PDF + Word).
await renderToFile(<ResumePdf data={resume} />, "public/JhorlinDeArmas-Resume.pdf");
await renderToFile(<ResumePdf data={liteResume} />, "public/JhorlinDeArmas-Resume-Lite.pdf");
await writeResumeDocx(resume, "public/JhorlinDeArmas-Resume.docx");
await writeResumeDocx(liteResume, "public/JhorlinDeArmas-Resume-Lite.docx");

console.log(
  "Wrote public/JhorlinDeArmas-Resume{,-Lite}.pdf and public/JhorlinDeArmas-Resume{,-Lite}.docx"
);
