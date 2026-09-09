"use client";

import { useState } from "react";
import { PDFDocument, rgb, degrees } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function ProtectPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [processing, setProcessing] = useState(false);

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(newFiles.slice(0, 1));
  };

  const handleProtect = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const pages = doc.getPages();

      for (const page of pages) {
        const { width, height } = page.getSize();
        page.drawText(watermarkText, {
          x: width / 2 - 100,
          y: height / 2,
          size: 50,
          color: rgb(0.85, 0.85, 0.85),
          rotate: degrees(-45),
          opacity: 0.3,
        });
      }

      doc.setCreator("PDF Tools Online - Protected");
      doc.setProducer("PDF Tools Online");
      const result = await doc.save();
      saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), "protected.pdf");
    } catch {
      alert("Error protecting PDF. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout slug="protect-pdf" title="Protect PDF" description="Add protection watermark to prevent unauthorized use." color="#8E44AD">
      <FileDropzone files={files} onFilesAdded={handleFilesAdded} onRemove={() => setFiles([])} multiple={false} />
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Protection Watermark Text</label>
            <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 bg-surface text-sm focus:outline-none focus:border-primary" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["CONFIDENTIAL", "DO NOT COPY", "DRAFT"].map((t) => (
              <button key={t} onClick={() => setWatermarkText(t)}
                className={`text-xs py-2 rounded-lg border transition-colors ${watermarkText === t ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-muted hover:border-primary"}`}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={handleProtect} disabled={processing}
            className="w-full btn-primary-glass font-semibold py-3 rounded-2xl disabled:opacity-50">
            {processing ? "Protecting..." : "Protect & Download PDF"}
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
