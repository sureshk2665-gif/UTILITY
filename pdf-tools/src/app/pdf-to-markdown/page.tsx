"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function PDFToMarkdown() {
  const [files, setFiles] = useState<File[]>([]);
  const [markdown, setMarkdown] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
      let md = `# ${files[0].name.replace(/\.pdf$/i, "")}\n\n`;

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const lines: string[] = [];
        let lastY: number | null = null;
        let currentLine = "";

        for (const item of content.items) {
          if (!("str" in item)) continue;
          const y = Math.round((item as { transform: number[] }).transform[5]);
          if (lastY !== null && Math.abs(y - lastY) > 5) {
            if (currentLine.trim()) lines.push(currentLine.trim());
            currentLine = "";
          }
          currentLine += (item as { str: string }).str + " ";
          lastY = y;
        }
        if (currentLine.trim()) lines.push(currentLine.trim());

        if (doc.numPages > 1) md += `## Page ${i}\n\n`;
        md += lines.join("\n\n") + "\n\n";
      }

      setMarkdown(md.trim());
    } catch {
      alert("Error converting PDF. Please try again.");
    }
    setProcessing(false);
  };

  const handleDownload = () => {
    const name = files[0]?.name.replace(/\.pdf$/i, "") || "document";
    saveAs(new Blob([markdown], { type: "text/markdown" }), `${name}.md`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
  };

  return (
    <ToolPageLayout title="PDF to Markdown" description="Convert PDF to Markdown for notes and docs." color="#3498DB">
      <FileDropzone files={files} onFilesAdded={(f) => { setFiles(f.slice(0, 1)); setMarkdown(""); }} onRemove={() => { setFiles([]); setMarkdown(""); }} multiple={false} />
      {files.length > 0 && !markdown && (
        <div className="mt-6">
          <button onClick={handleConvert} disabled={processing}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
            {processing ? "Converting..." : "Convert to Markdown"}
          </button>
        </div>
      )}
      {markdown && (
        <div className="mt-6 space-y-4">
          <div className="flex gap-2">
            <button onClick={handleDownload} className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors">
              Download .md File
            </button>
            <button onClick={handleCopy} className="px-6 bg-secondary text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-colors">
              Copy
            </button>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm whitespace-pre-wrap font-mono">{markdown}</pre>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
