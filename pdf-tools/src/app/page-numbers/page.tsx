"use client";

import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

type Position = "bottom-center" | "bottom-left" | "bottom-right" | "top-center" | "top-left" | "top-right";

export default function PageNumbers() {
  const [files, setFiles] = useState<File[]>([]);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [startFrom, setStartFrom] = useState(1);
  const [processing, setProcessing] = useState(false);

  const handleApply = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();

      pages.forEach((page, idx) => {
        const { width, height } = page.getSize();
        const num = String(startFrom + idx);
        const textWidth = font.widthOfTextAtSize(num, 12);
        let x = 0, y = 0;

        if (position.includes("left")) x = 40;
        else if (position.includes("right")) x = width - 40 - textWidth;
        else x = width / 2 - textWidth / 2;

        if (position.includes("bottom")) y = 30;
        else y = height - 40;

        page.drawText(num, { x, y, size: 12, font, color: rgb(0.3, 0.3, 0.3) });
      });

      const result = await doc.save();
      saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), "numbered.pdf");
    } catch {
      alert("Error adding page numbers. Please try again.");
    }
    setProcessing(false);
  };

  const positions: { value: Position; label: string }[] = [
    { value: "top-left", label: "Top Left" },
    { value: "top-center", label: "Top Center" },
    { value: "top-right", label: "Top Right" },
    { value: "bottom-left", label: "Bottom Left" },
    { value: "bottom-center", label: "Bottom Center" },
    { value: "bottom-right", label: "Bottom Right" },
  ];

  return (
    <ToolPageLayout
      slug="page-numbers"
      title="Add Page Numbers"
      description="Add page numbers to your PDF with custom position and starting number."
      color="#E74C3C"
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
            <label className="text-sm font-medium block mb-2">Position</label>
            <div className="grid grid-cols-3 gap-2">
              {positions.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setPosition(p.value)}
                  className={`py-2 rounded-lg text-xs font-medium border transition-colors ${
                    position === p.value
                      ? "bg-primary text-white border-primary"
                      : "bg-surface-alt border-border hover:border-primary/50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Start numbering from</label>
            <input
              type="number"
              min="1"
              value={startFrom}
              onChange={(e) => setStartFrom(Number(e.target.value))}
              className="w-24 border border-border rounded-lg px-3 py-2 bg-surface text-foreground text-sm focus:outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={handleApply}
            disabled={processing}
            className="w-full btn-primary-glass font-semibold py-3 rounded-2xl disabled:opacity-50"
          >
            {processing ? "Adding..." : "Add Page Numbers"}
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
