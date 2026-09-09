"use client";

import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";

export default function HTMLToPDF() {
  const [htmlInput, setHtmlInput] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleConvert = async () => {
    if (!htmlInput.trim()) return;
    setProcessing(true);
    try {
      const parser = new DOMParser();
      const htmlDoc = parser.parseFromString(htmlInput, "text/html");
      const textContent = htmlDoc.body.innerText || htmlDoc.body.textContent || "";

      const doc = await PDFDocument.create();
      const fontSize = 12;
      const margin = 50;
      const lineHeight = fontSize * 1.5;
      const maxCharsPerLine = 80;

      const lines: string[] = [];
      for (const paragraph of textContent.split("\n")) {
        if (!paragraph.trim()) { lines.push(""); continue; }
        for (let i = 0; i < paragraph.length; i += maxCharsPerLine) {
          lines.push(paragraph.slice(i, i + maxCharsPerLine));
        }
      }

      const linesPerPage = Math.floor((792 - margin * 2) / lineHeight);
      for (let i = 0; i < Math.max(lines.length, 1); i += linesPerPage) {
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
      saveAs(new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }), "converted.pdf");
    } catch {
      alert("Error converting HTML. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout slug="html-to-pdf" title="HTML to PDF" description="Convert HTML content to PDF documents." color="#3498DB">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium block mb-2">Paste your HTML code</label>
          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            placeholder="<html>\n  <body>\n    <h1>Hello World</h1>\n    <p>Your content here...</p>\n  </body>\n</html>"
            rows={12}
            className="w-full border border-border rounded-xl px-4 py-3 bg-surface text-sm font-mono focus:outline-none focus:border-primary resize-y"
          />
        </div>
        <button onClick={handleConvert} disabled={processing || !htmlInput.trim()}
          className="w-full btn-primary-glass font-semibold py-3 rounded-2xl disabled:opacity-50">
          {processing ? "Converting..." : "Convert to PDF"}
        </button>
      </div>
    </ToolPageLayout>
  );
}
