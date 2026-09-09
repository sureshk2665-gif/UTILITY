"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function CropPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [margins, setMargins] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
  const [processing, setProcessing] = useState(false);

  const handleCrop = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);

      for (const page of doc.getPages()) {
        const { width, height } = page.getSize();
        page.setCropBox(
          margins.left,
          margins.bottom,
          width - margins.left - margins.right,
          height - margins.top - margins.bottom
        );
      }
      const result = await doc.save();
      saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), "cropped.pdf");
    } catch {
      alert("Error cropping PDF. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout
      title="Crop PDF"
      description="Adjust margins and crop the visible area of your PDF pages."
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
          <p className="text-sm font-medium">Crop margins (points):</p>
          <div className="grid grid-cols-2 gap-4">
            {(["top", "right", "bottom", "left"] as const).map((side) => (
              <div key={side}>
                <label className="text-xs text-muted block mb-1 capitalize">{side}</label>
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={margins[side]}
                  onChange={(e) => setMargins((p) => ({ ...p, [side]: Number(e.target.value) }))}
                  className="w-full border border-border rounded-lg px-3 py-2 bg-surface text-foreground text-sm focus:outline-none focus:border-primary"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleCrop}
            disabled={processing}
            className="w-full bg-accent-green hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {processing ? "Cropping..." : "Crop PDF"}
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
