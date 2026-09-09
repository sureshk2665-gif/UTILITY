"use client";

import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

interface RedactArea {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function RedactPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [areas, setAreas] = useState<RedactArea[]>([]);
  const [current, setCurrent] = useState<RedactArea>({ page: 1, x: 50, y: 50, width: 200, height: 20 });
  const [processing, setProcessing] = useState(false);

  const handleFilesAdded = async (newFiles: File[]) => {
    const file = newFiles[0];
    if (!file) return;
    setFiles([file]);
    setAreas([]);
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    setPageCount(doc.getPageCount());
  };

  const addArea = () => {
    setAreas((prev) => [...prev, { ...current }]);
  };

  const handleRedact = async () => {
    if (!files[0] || areas.length === 0) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const pages = doc.getPages();

      for (const area of areas) {
        const page = pages[area.page - 1];
        if (!page) continue;
        const { height } = page.getSize();
        page.drawRectangle({
          x: area.x,
          y: height - area.y - area.height,
          width: area.width,
          height: area.height,
          color: rgb(0, 0, 0),
        });
      }
      const result = await doc.save();
      saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), "redacted.pdf");
    } catch {
      alert("Error redacting PDF. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout
      title="Redact PDF"
      description="Permanently cover sensitive content with black rectangles."
      color="#27AE60"
    >
      <FileDropzone
        files={files}
        onFilesAdded={handleFilesAdded}
        onRemove={() => { setFiles([]); setPageCount(0); setAreas([]); }}
        multiple={false}
      />
      {pageCount > 0 && (
        <div className="mt-6 space-y-4">
          <div className="bg-surface-alt border border-border rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-bold">Add Redaction Area</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="text-xs text-muted block mb-1">Page</label>
                <input type="number" min={1} max={pageCount} value={current.page}
                  onChange={(e) => setCurrent((p) => ({ ...p, page: Number(e.target.value) }))}
                  className="w-full border border-border rounded-lg px-3 py-1.5 bg-surface text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">X</label>
                <input type="number" min={0} value={current.x}
                  onChange={(e) => setCurrent((p) => ({ ...p, x: Number(e.target.value) }))}
                  className="w-full border border-border rounded-lg px-3 py-1.5 bg-surface text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">Y</label>
                <input type="number" min={0} value={current.y}
                  onChange={(e) => setCurrent((p) => ({ ...p, y: Number(e.target.value) }))}
                  className="w-full border border-border rounded-lg px-3 py-1.5 bg-surface text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">Width</label>
                <input type="number" min={10} value={current.width}
                  onChange={(e) => setCurrent((p) => ({ ...p, width: Number(e.target.value) }))}
                  className="w-full border border-border rounded-lg px-3 py-1.5 bg-surface text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-xs text-muted block mb-1">Height</label>
                <input type="number" min={10} value={current.height}
                  onChange={(e) => setCurrent((p) => ({ ...p, height: Number(e.target.value) }))}
                  className="w-full border border-border rounded-lg px-3 py-1.5 bg-surface text-sm focus:outline-none focus:border-primary" />
              </div>
            </div>
            <button onClick={addArea}
              className="w-full bg-secondary text-white font-medium py-2 rounded-lg text-sm hover:opacity-90 transition-colors">
              + Add Redaction Area
            </button>
          </div>

          {areas.length > 0 && (
            <>
              <ul className="space-y-2">
                {areas.map((a, i) => (
                  <li key={i} className="flex items-center gap-3 bg-surface border border-border rounded-lg px-4 py-2 text-sm">
                    <span className="w-4 h-4 bg-black rounded flex-shrink-0" />
                    <span className="flex-1">Page {a.page} — ({a.x}, {a.y}) {a.width}×{a.height}px</span>
                    <button onClick={() => setAreas((prev) => prev.filter((_, idx) => idx !== i))}
                      className="text-muted hover:text-primary text-lg">&times;</button>
                  </li>
                ))}
              </ul>
              <button onClick={handleRedact} disabled={processing}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
                {processing ? "Redacting..." : `Apply ${areas.length} redaction${areas.length > 1 ? "s" : ""}`}
              </button>
            </>
          )}

          <p className="text-xs text-muted text-center">
            Redacted content is permanently covered with black rectangles and cannot be recovered.
          </p>
        </div>
      )}
    </ToolPageLayout>
  );
}
