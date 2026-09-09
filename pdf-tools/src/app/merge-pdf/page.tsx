"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleMerge = async () => {
    if (files.length < 2) return;
    setProcessing(true);
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const result = await merged.save();
      saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), "merged.pdf");
    } catch (e) {
      alert("Error merging PDFs. Please check your files and try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout
      slug="merge-pdf"
      title="Merge PDF"
      description="Combine multiple PDF files into one document in the order you want."
      color="#E74C3C"
    >
      <FileDropzone
        files={files}
        onFilesAdded={(f) => setFiles((prev) => [...prev, ...f])}
        onRemove={(i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
      />
      {files.length >= 2 && (
        <button
          onClick={handleMerge}
          disabled={processing}
          className="mt-6 w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          {processing ? "Merging..." : `Merge ${files.length} PDFs`}
        </button>
      )}
      {files.length === 1 && (
        <p className="text-sm text-muted text-center mt-4">
          Add at least 2 files to merge.
        </p>
      )}
    </ToolPageLayout>
  );
}
