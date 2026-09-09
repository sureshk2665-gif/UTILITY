"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function PDFToWord() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;

      let htmlContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${files[0].name}</title>
        <style>body{font-family:Arial,sans-serif;margin:40px;line-height:1.6}
        .page{margin-bottom:30px;padding-bottom:20px;border-bottom:1px solid #ccc}
        .page:last-child{border-bottom:none}</style></head><body>`;

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

        htmlContent += `<div class="page">`;
        lines.forEach((line) => { htmlContent += `<p>${line.replace(/</g, "&lt;")}</p>`; });
        htmlContent += `</div>`;
      }

      htmlContent += `</body></html>`;
      const name = files[0].name.replace(/\.pdf$/i, "");
      saveAs(new Blob([htmlContent], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" }), `${name}.doc`);
    } catch {
      alert("Error converting PDF. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout slug="pdf-to-word" title="PDF to Word" description="Convert PDF to editable Word documents." color="#3498DB">
      <FileDropzone files={files} onFilesAdded={(f) => setFiles(f.slice(0, 1))} onRemove={() => setFiles([])} multiple={false} />
      {files.length > 0 && (
        <div className="mt-6">
          <button onClick={handleConvert} disabled={processing}
            className="w-full btn-primary-glass font-semibold py-3 rounded-2xl disabled:opacity-50">
            {processing ? "Converting..." : "Convert to Word"}
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
