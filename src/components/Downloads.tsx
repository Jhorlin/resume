import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const FILES = [
  { label: "PDF", href: "/JhorlinDeArmas-Resume.pdf" },
  { label: "Word", href: "/JhorlinDeArmas-Resume.docx" },
  { label: "PDF · Lite", href: "/JhorlinDeArmas-Resume-Lite.pdf" },
  { label: "Word · Lite", href: "/JhorlinDeArmas-Resume-Lite.docx" },
];

export function Downloads() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">Download:</span>
      {FILES.map((file, i) => (
        <Button key={file.href} variant={i === 0 ? "default" : "outline"} size="sm" asChild>
          <a href={file.href} download>
            <Download aria-hidden />
            {file.label}
          </a>
        </Button>
      ))}
    </div>
  );
}
