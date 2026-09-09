"use client";

import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

interface TextAnnotation {
  text: string;
  page: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

export default function EditPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [annotations, setAnnotations] = useState<TextAnnotation[]>([]);
  const [current, setCurrent] = useState({ text: "", page: 1, x: 50, y: 50, size: 16, color: "#000000" });
  const [processing, setProcessing] = useState(false);

  const handleFilesAdded = async (newFiles: File[]) => {
    const file = newFiles[0];
    if (!file) return;
    setFiles([file]);
    setAnnotations([]);
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    setPageCount(doc.getPageCount());
  };

  const addAnnotation = () => {
    if (!current.text.trim()) return;
    setAnnotations((prev) => [...prev, { ...current }]);
    setCurrent((prev) => ({ ...prev, text: "" }));
  };

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return rgb(r, g, b);
  };

  const handleApply = async () => {
    if (!files[0] || annotations.length === 0) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();

      for (const ann of annotations) {
        const page = pages[ann.page - 1];
        if (!page) continue;
        const { height } = page.getSize();
        page.drawText(ann.text, {
          x: ann.x,
          y: height - ann.y,
          size: ann.size,
          font,
          color: hexToRgb(ann.color),
        });
      }
      const result = await doc.save();
      saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), "edited.pdf");
    } catch {
      alert("Error editing PDF. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout
      title="Edit PDF"
      description="Add text annotations to your PDF document."
      color="#27AE60"
    >
      <FileDropzone
        files={files}
        onFilesAdded={handleFilesAdded}
        onRemove={() => { setFiles([]); setPageCount(0); setAnnotations([]); }}
        multiple={false}
      />
      {pageCount > 0 && (
        <div className="mt-6 space-y-4">
          <div className="bg-surface-alt border border-border rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold">Add Text</h3>
            <input
              type="text"
              value={current.text}
              onChange={(e) => setCurrent((p) => ({ ...p, text: e.target.value }))}
              placeholder="Enter text to add"
              className="w-full border border-border rounded-lg px-3 py-2 bg-surface text-foreground text-sm focus:outline-none focus:border-primary"
            />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs text-muted block mb-1">Page</label>
                <input type="number" min="1" max={pageCount} value={current.page}
                  onChange={(e) => setCurrent((p) => ({ ...p, page: Number(e.target.value) }))}
                  className="w-full border border-border rounded-lg px-3 py-1.5 bg-surface text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">X Position</label>
                <input type="number" min="0" value={current.x}
                  onChange={(e) => setCurrent((p) => ({ ...p, x: Number(e.target.value) }))}
                  className="w-full border border-border rounded-lg px-3 py-1.5 bg-surface text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">Y Position</label>
                <input type="number" min="0" value={current.y}
                  onChange={(e) => setCurrent((p) => ({ ...p, y: Number(e.target.value) }))}
                  className="w-full border border-border rounded-lg px-3 py-1.5 bg-surface text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">Size / Color</label>
                <div className="flex gap-2">
                  <input type="number" min="8" max="72" value={current.size}
                    onChange={(e) => setCurrent((p) => ({ ...p, size: Number(e.target.value) }))}
                    className="w-16 border border-border rounded-lg px-2 py-1.5 bg-surface text-sm focus:outline-none focus:border-primary" />
                  <input type="color" value={current.color}
                    onChange={(e) => setCurrent((p) => ({ ...p, color: e.target.value }))}
                    className="w-10 h-8 rounded border border-border cursor-pointer" />
                </div>
              </div>
            </div>
            <button onClick={addAnnotation}
              className="w-full bg-accent-green text-white font-medium py-2 rounded-lg text-sm hover:opacity-90 transition-colors">
              + Add Text
            </button>
          </div>

          {annotations.length > 0 && (
            <>
              <ul className="space-y-2">
                {annotations.map((a, i) => (
                  <li key={i} className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-2 text-sm">
                    <span className="flex-1 truncate">&ldquo;{a.text}&rdquo; — Page {a.page} ({a.x}, {a.y})</span>
                    <button onClick={() => setAnnotations((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-muted hover:text-primary text-lg">&times;</button>
                  </li>
                ))}
              </ul>
              <button onClick={handleApply} disabled={processing}
                className="w-full bg-accent-green hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
                {processing ? "Applying..." : `Apply ${annotations.length} edit${annotations.length > 1 ? "s" : ""}`}
              </button>
            </>
          )}
        </div>
      )}
    </ToolPageLayout>
  );
}
