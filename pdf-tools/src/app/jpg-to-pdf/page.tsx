"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function JpgToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    try {
      const doc = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const isJpg = file.type === "image/jpeg";
        const isPng = file.type === "image/png";
        const img = isJpg
          ? await doc.embedJpg(bytes)
          : isPng
          ? await doc.embedPng(bytes)
          : null;
        if (!img) continue;
        const page = doc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const result = await doc.save();
      saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), "images.pdf");
    } catch {
      alert("Error converting images. Please check your files and try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout
      slug="jpg-to-pdf"
      title="JPG to PDF"
      description="Convert JPG and PNG images to a PDF document."
      color="#3498DB"
    >
      <FileDropzone
        files={files}
        onFilesAdded={(f) => setFiles((prev) => [...prev, ...f])}
        onRemove={(i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
        accept={{ "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] }}
      />
      {files.length > 0 && (
        <button
          onClick={handleConvert}
          disabled={processing}
          className="mt-6 w-full bg-accent-blue hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          {processing ? "Converting..." : `Convert ${files.length} image${files.length > 1 ? "s" : ""} to PDF`}
        </button>
      )}
    </ToolPageLayout>
  );
}
