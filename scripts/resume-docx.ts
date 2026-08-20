import {
  Document,
  ExternalHyperlink,
  Packer,
  Paragraph,
  TabStopPosition,
  TabStopType,
  TextRun,
} from "docx";
import type { Resume } from "../src/content/schema";
import { formatRange } from "../src/lib/dates";

const ACCENT = "1F6FEB";
const MUTED = "555555";

function sectionTitle(text: string): Paragraph {
  return new Paragraph({
    spacing: { before: 220, after: 80 },
    border: { bottom: { color: "999999", size: 6, space: 1, style: "single" } },
    children: [
      new TextRun({ text: text.toUpperCase(), bold: true, size: 22, color: ACCENT }),
    ],
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 40 },
    children: [new TextRun({ text, size: 21 })],
  });
}

export function buildResumeDoc(data: Resume): Document {
  const { profile } = data;

  const header: Paragraph[] = [
    new Paragraph({
      children: [new TextRun({ text: profile.name, bold: true, size: 40 })],
    }),
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: profile.headline, size: 24, color: MUTED })],
    }),
    new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({ text: `${profile.location} · ${profile.emails.join(" · ")}`, size: 20, color: MUTED }),
      ],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: profile.links.flatMap((link, i) => [
        ...(i > 0 ? [new TextRun({ text: "   ·   ", size: 20, color: MUTED })] : []),
        new ExternalHyperlink({
          link: link.url,
          children: [
            new TextRun({ text: link.label, size: 20, color: ACCENT, underline: {} }),
          ],
        }),
      ]),
    }),
  ];

  const highlights = [sectionTitle("Highlights"), ...data.highlights.map(bullet)];

  const experience = [
    sectionTitle("Experience"),
    ...data.experience.flatMap((job) => [
      new Paragraph({
        spacing: { before: 120, after: 20 },
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: [
          new TextRun({ text: `${job.role} · `, bold: true, size: 22 }),
          job.url
            ? new ExternalHyperlink({
                link: job.url,
                children: [
                  new TextRun({ text: job.company, bold: true, size: 22, color: ACCENT, underline: {} }),
                ],
              })
            : new TextRun({ text: job.company, bold: true, size: 22 }),
          new TextRun({ text: `\t${formatRange(job.start, job.end)}`, size: 20, color: MUTED }),
        ],
      }),
      ...job.achievements.map(bullet),
    ]),
  ];

  const projects = [
    sectionTitle("Projects"),
    ...data.projects.flatMap((project) => {
      const paras: Paragraph[] = [
        new Paragraph({
          spacing: { before: 100, after: 20 },
          children: [
            new TextRun({ text: project.name, bold: true, size: 21 }),
            new TextRun({ text: ` — ${project.description}`, size: 21 }),
          ],
        }),
        ...project.outcomes.map(bullet),
      ];
      if (project.links.length) {
        paras.push(
          new Paragraph({
            spacing: { after: 40 },
            children: project.links.flatMap((link, i) => [
              ...(i > 0 ? [new TextRun({ text: "   ·   ", size: 20, color: MUTED })] : []),
              new ExternalHyperlink({
                link: link.url,
                children: [
                  new TextRun({ text: link.label, size: 20, color: ACCENT, underline: {} }),
                ],
              }),
            ]),
          })
        );
      }
      return paras;
    }),
  ];

  const skills = [
    sectionTitle("Skills"),
    ...data.skills.map(
      (group) =>
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: `${group.category}: `, bold: true, size: 21 }),
            new TextRun({ text: group.items.join(", "), size: 21 }),
          ],
        })
    ),
  ];

  const education = [
    sectionTitle("Education"),
    new Paragraph({
      children: [
        new TextRun({
          text: `${profile.education.degree}, ${profile.education.school} (${profile.education.year})`,
          size: 21,
        }),
      ],
    }),
  ];

  return new Document({
    creator: profile.name,
    title: `${profile.name} — Resume`,
    styles: {
      default: {
        document: { run: { font: "Calibri", color: "111111" } },
        heading1: { run: { color: ACCENT } },
      },
    },
    sections: [
      {
        properties: {
          page: { margin: { top: 800, bottom: 800, left: 800, right: 800 } },
        },
        children: [
          ...header,
          ...highlights,
          ...experience,
          ...projects,
          ...skills,
          ...education,
        ],
      },
    ],
  });
}

export async function writeResumeDocx(data: Resume, path: string): Promise<void> {
  const { writeFile } = await import("node:fs/promises");
  const buffer = await Packer.toBuffer(buildResumeDoc(data));
  await writeFile(path, buffer);
}
