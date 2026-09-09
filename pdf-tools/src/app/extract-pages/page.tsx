"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function ExtractPages() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [processing, setProcessing] = useState(false);

  const handleFilesAdded = async (newFiles: File[]) => {
    const file = newFiles[0];
    if (!file) return;
    setFiles([file]);
    setSelected(new Set());
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    setPageCount(doc.getPageCount());
  };

  const togglePage = (page: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
  };

  const handleExtract = async () => {
    if (!files[0] || selected.size === 0) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const indices = Array.from(selected).sort((a, b) => a - b);
      const result = await PDFDocument.create();
      const pages = await result.copyPages(doc, indices);
      pages.forEach((p) => result.addPage(p));
      const saved = await result.save();
      saveAs(new Blob([saved.buffer as ArrayBuffer], { type: "application/pdf" }), "extracted-pages.pdf");
    } catch {
      alert("Error extracting pages. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout
      slug="extract-pages"
      title="Extract Pages"
      description="Select pages to extract into a new PDF file."
      color="#E74C3C"
    >
      <FileDropzone
        files={files}
        onFilesAdded={handleFilesAdded}
        onRemove={() => {
          setFiles([]);
          setPageCount(0);
          setSelected(new Set());
        }}
        multiple={false}
      />
      {pageCount > 0 && (
        <>
          <p className="text-sm text-muted mt-4 mb-3">
            Click pages to extract ({selected.size} of {pageCount} selected):
          </p>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                onClick={() => togglePage(i)}
                className={`aspect-square rounded-lg text-sm font-medium border transition-colors ${
                  selected.has(i)
                    ? "bg-accent-green text-white border-accent-green"
                    : "bg-surface-alt border-border hover:border-accent-green/50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          {selected.size > 0 && (
            <button
              onClick={handleExtract}
              disabled={processing}
              className="mt-6 w-full bg-accent-green hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {processing ? "Extracting..." : `Extract ${selected.size} page${selected.size > 1 ? "s" : ""}`}
            </button>
          )}
        </>
      )}
    </ToolPageLayout>
  );
}
