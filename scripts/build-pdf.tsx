import { mkdirSync } from "node:fs";
import { renderToFile } from "@react-pdf/renderer";
import { ResumePdf } from "./resume-pdf";

mkdirSync("public", { recursive: true });
await renderToFile(<ResumePdf />, "public/JhorlinDeArmas-Resume.pdf");
console.log("Wrote public/JhorlinDeArmas-Resume.pdf");
