"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function SplitPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  const handleFilesAdded = async (newFiles: File[]) => {
    const file = newFiles[0];
    if (!file) return;
    setFiles([file]);
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    setPageCount(doc.getPageCount());
  };

  const handleSplit = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      for (let i = 0; i < doc.getPageCount(); i++) {
        const single = await PDFDocument.create();
        const [page] = await single.copyPages(doc, [i]);
        single.addPage(page);
        const result = await single.save();
        saveAs(
          new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }),
          `page-${i + 1}.pdf`
        );
      }
    } catch {
      alert("Error splitting PDF. Please check your file and try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout
      title="Split PDF"
      description="Separate a PDF into individual single-page files."
      color="#E74C3C"
    >
      <FileDropzone
        files={files}
        onFilesAdded={handleFilesAdded}
        onRemove={() => {
          setFiles([]);
          setPageCount(0);
        }}
        multiple={false}
      />
      {pageCount > 0 && (
        <div className="mt-4 text-sm text-muted text-center">
          {pageCount} pages detected — each page will be saved as a separate PDF.
        </div>
      )}
      {files.length > 0 && (
        <button
          onClick={handleSplit}
          disabled={processing}
          className="mt-6 w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          {processing ? "Splitting..." : "Split PDF"}
        </button>
      )}
    </ToolPageLayout>
  );
}
