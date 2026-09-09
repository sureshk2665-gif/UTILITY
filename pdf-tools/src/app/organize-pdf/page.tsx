"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import { ArrowUp, ArrowDown } from "lucide-react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function OrganizePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFilesAdded = async (newFiles: File[]) => {
    const file = newFiles[0];
    if (!file) return;
    setFiles([file]);
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    setPageOrder(Array.from({ length: doc.getPageCount() }, (_, i) => i));
  };

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setPageOrder((prev) => {
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  };

  const moveDown = (idx: number) => {
    if (idx === pageOrder.length - 1) return;
    setPageOrder((prev) => {
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  };

  const removePage = (idx: number) => {
    if (pageOrder.length <= 1) return;
    setPageOrder((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleApply = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const result = await PDFDocument.create();
      const pages = await result.copyPages(doc, pageOrder);
      pages.forEach((p) => result.addPage(p));
      const saved = await result.save();
      saveAs(new Blob([saved.buffer as ArrayBuffer], { type: "application/pdf" }), "organized.pdf");
    } catch {
      alert("Error organizing PDF. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout
      slug="organize-pdf"
      title="Organize PDF"
      description="Reorder, duplicate, or remove pages from your PDF."
      color="#E74C3C"
    >
      <FileDropzone
        files={files}
        onFilesAdded={handleFilesAdded}
        onRemove={() => { setFiles([]); setPageOrder([]); }}
        multiple={false}
      />
      {pageOrder.length > 0 && (
        <div className="mt-6 space-y-4">
          <p className="text-sm font-medium">Drag pages to reorder, or use arrows:</p>
          <ul className="space-y-2">
            {pageOrder.map((originalIdx, i) => (
              <li key={`${originalIdx}-${i}`}
                className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-2.5">
                <span className="text-sm font-bold text-primary w-8">{i + 1}</span>
                <span className="flex-1 text-sm">Original Page {originalIdx + 1}</span>
                <button onClick={() => moveUp(i)} disabled={i === 0}
                  className="p-1 text-muted hover:text-foreground disabled:opacity-20">
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button onClick={() => moveDown(i)} disabled={i === pageOrder.length - 1}
                  className="p-1 text-muted hover:text-foreground disabled:opacity-20">
                  <ArrowDown className="w-4 h-4" />
                </button>
                <button onClick={() => removePage(i)} disabled={pageOrder.length <= 1}
                  className="text-muted hover:text-primary text-lg disabled:opacity-20">&times;</button>
              </li>
            ))}
          </ul>
          <button onClick={handleApply} disabled={processing}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
            {processing ? "Organizing..." : "Save Organized PDF"}
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
