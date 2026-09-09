"use client";

import { useState } from "react";
import { PDFDocument, rgb, StandardFonts, degrees } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function Watermark() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("CONFIDENTIAL");
  const [opacity, setOpacity] = useState(0.3);
  const [fontSize, setFontSize] = useState(60);
  const [processing, setProcessing] = useState(false);

  const handleApply = async () => {
    if (!files[0] || !text.trim()) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.HelveticaBold);

      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        page.drawText(text, {
          x: width / 2 - textWidth / 2,
          y: height / 2,
          size: fontSize,
          font,
          color: rgb(0.5, 0.5, 0.5),
          opacity,
          rotate: degrees(-45),
        });
      }
      const result = await doc.save();
      saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), "watermarked.pdf");
    } catch {
      alert("Error adding watermark. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout
      slug="watermark"
      title="Watermark PDF"
      description="Add a text watermark to every page of your PDF."
      color="#27AE60"
    >
      <FileDropzone
        files={files}
        onFilesAdded={(f) => setFiles([f[0]])}
        onRemove={() => setFiles([])}
        multiple={false}
      />
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Watermark Text</label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full border border-border rounded-lg px-4 py-2.5 bg-surface text-foreground text-sm focus:outline-none focus:border-primary"
              placeholder="Enter watermark text"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium block mb-1">Font Size: {fontSize}px</label>
              <input
                type="range"
                min="20"
                max="120"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-1">Opacity: {Math.round(opacity * 100)}%</label>
              <input
                type="range"
                min="5"
                max="80"
                value={opacity * 100}
                onChange={(e) => setOpacity(Number(e.target.value) / 100)}
                className="w-full"
              />
            </div>
          </div>
          <button
            onClick={handleApply}
            disabled={processing}
            className="w-full bg-accent-green hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {processing ? "Applying..." : "Add Watermark"}
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
