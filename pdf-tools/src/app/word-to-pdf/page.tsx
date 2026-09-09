"use client";

import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function WordToPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const mammoth = await import("mammoth");
      const bytes = await files[0].arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: bytes });
      const text = result.value;

      const doc = await PDFDocument.create();
      const fontSize = 12;
      const margin = 50;
      const lineHeight = fontSize * 1.4;
      const maxWidth = 495;

      const lines: string[] = [];
      for (const paragraph of text.split("\n")) {
        if (!paragraph.trim()) { lines.push(""); continue; }
        const words = paragraph.split(/\s+/);
        let currentLine = "";
        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          if (testLine.length * (fontSize * 0.5) > maxWidth && currentLine) {
            lines.push(currentLine);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        }
        if (currentLine) lines.push(currentLine);
      }

      const linesPerPage = Math.floor((792 - margin * 2) / lineHeight);
      for (let i = 0; i < lines.length; i += linesPerPage) {
        const page = doc.addPage([612, 792]);
        const pageLines = lines.slice(i, i + linesPerPage);
        pageLines.forEach((line, idx) => {
          page.drawText(line, {
            x: margin,
            y: 792 - margin - idx * lineHeight,
            size: fontSize,
            color: rgb(0, 0, 0),
          });
        });
      }

      const pdfBytes = await doc.save();
      const name = files[0].name.replace(/\.(docx?|doc)$/i, "");
      saveAs(new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }), `${name}.pdf`);
    } catch {
      alert("Error converting Word document. Please ensure it's a valid .docx file.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout slug="word-to-pdf" title="Word to PDF" description="Convert DOC and DOCX files to PDF." color="#3498DB">
      <FileDropzone files={files} onFilesAdded={(f) => setFiles(f.slice(0, 1))} onRemove={() => setFiles([])}
        multiple={false} accept={{ "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"], "application/msword": [".doc"] }} />
      {files.length > 0 && (
        <div className="mt-6">
          <button onClick={handleConvert} disabled={processing}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
            {processing ? "Converting..." : "Convert to PDF"}
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
