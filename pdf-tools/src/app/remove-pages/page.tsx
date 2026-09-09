"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function RemovePages() {
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

  const handleRemove = async () => {
    if (!files[0] || selected.size === 0) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const keep = doc.getPageIndices().filter((i) => !selected.has(i));
      const result = await PDFDocument.create();
      const pages = await result.copyPages(doc, keep);
      pages.forEach((p) => result.addPage(p));
      const saved = await result.save();
      saveAs(new Blob([saved.buffer as ArrayBuffer], { type: "application/pdf" }), "pages-removed.pdf");
    } catch {
      alert("Error removing pages. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout
      slug="remove-pages"
      title="Remove Pages"
      description="Select and delete specific pages from your PDF document."
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
            Click pages to mark for removal ({selected.size} of {pageCount} selected):
          </p>
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                onClick={() => togglePage(i)}
                className={`aspect-square rounded-lg text-sm font-medium border transition-colors ${
                  selected.has(i)
                    ? "bg-primary text-white border-primary"
                    : "bg-surface-alt border-border hover:border-primary/50"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          {selected.size > 0 && selected.size < pageCount && (
            <button
              onClick={handleRemove}
              disabled={processing}
              className="mt-6 w-full btn-primary-glass font-semibold py-3 rounded-2xl disabled:opacity-50"
            >
              {processing ? "Processing..." : `Remove ${selected.size} page${selected.size > 1 ? "s" : ""}`}
            </button>
          )}
          {selected.size === pageCount && (
            <p className="text-sm text-primary text-center mt-4 font-medium">
              You can&apos;t remove all pages.
            </p>
          )}
        </>
      )}
    </ToolPageLayout>
  );
}
