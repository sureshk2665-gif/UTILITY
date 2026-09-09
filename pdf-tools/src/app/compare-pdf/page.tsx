"use client";

import { useState, useRef, useEffect } from "react";
import ToolPageLayout from "@/components/ToolPageLayout";

export default function ComparePDF() {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [pages1, setPages1] = useState<string[]>([]);
  const [pages2, setPages2] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [processing, setProcessing] = useState(false);
  const canvas1Ref = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);

  const renderPDF = async (file: File): Promise<string[]> => {
    const bytes = await file.arrayBuffer();
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
    const images: string[] = [];

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport } as never).promise;
      images.push(canvas.toDataURL("image/png"));
    }
    return images;
  };

  const handleCompare = async () => {
    if (!file1 || !file2) return;
    setProcessing(true);
    try {
      const [p1, p2] = await Promise.all([renderPDF(file1), renderPDF(file2)]);
      setPages1(p1);
      setPages2(p2);
      setCurrentPage(0);
    } catch {
      alert("Error comparing PDFs. Please try again.");
    }
    setProcessing(false);
  };

  useEffect(() => {
    const drawImage = (canvasRef: React.RefObject<HTMLCanvasElement | null>, src: string | undefined) => {
      if (!canvasRef.current || !src) return;
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d")!.drawImage(img, 0, 0);
      };
      img.src = src;
    };
    drawImage(canvas1Ref, pages1[currentPage]);
    drawImage(canvas2Ref, pages2[currentPage]);
  }, [currentPage, pages1, pages2]);

  const maxPages = Math.max(pages1.length, pages2.length);

  return (
    <ToolPageLayout slug="compare-pdf" title="Compare PDF" description="Side-by-side visual comparison of two PDF documents." color="#E67E22">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium block mb-2">First PDF</label>
          <input type="file" accept=".pdf" onChange={(e) => { setFile1(e.target.files?.[0] || null); setPages1([]); }}
            className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-surface" />
          {file1 && <p className="text-xs text-muted mt-1">{file1.name}</p>}
        </div>
        <div>
          <label className="text-sm font-medium block mb-2">Second PDF</label>
          <input type="file" accept=".pdf" onChange={(e) => { setFile2(e.target.files?.[0] || null); setPages2([]); }}
            className="w-full text-sm border border-border rounded-lg px-3 py-2 bg-surface" />
          {file2 && <p className="text-xs text-muted mt-1">{file2.name}</p>}
        </div>
      </div>
      {file1 && file2 && pages1.length === 0 && (
        <div className="mt-6">
          <button onClick={handleCompare} disabled={processing}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
            {processing ? "Rendering pages..." : "Compare PDFs"}
          </button>
        </div>
      )}
      {pages1.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <button onClick={() => setCurrentPage((p) => Math.max(0, p - 1))} disabled={currentPage === 0}
              className="px-4 py-2 bg-surface border border-border rounded-lg text-sm disabled:opacity-30">Previous</button>
            <span className="text-sm font-medium">Page {currentPage + 1} of {maxPages}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(maxPages - 1, p + 1))} disabled={currentPage >= maxPages - 1}
              className="px-4 py-2 bg-surface border border-border rounded-lg text-sm disabled:opacity-30">Next</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="border border-border rounded-lg overflow-hidden bg-white">
              <div className="bg-surface-alt px-3 py-1.5 text-xs font-medium border-b border-border">{file1?.name}</div>
              <canvas ref={canvas1Ref} className="w-full" />
              {!pages1[currentPage] && <div className="p-8 text-center text-sm text-muted">No page</div>}
            </div>
            <div className="border border-border rounded-lg overflow-hidden bg-white">
              <div className="bg-surface-alt px-3 py-1.5 text-xs font-medium border-b border-border">{file2?.name}</div>
              <canvas ref={canvas2Ref} className="w-full" />
              {!pages2[currentPage] && <div className="p-8 text-center text-sm text-muted">No page</div>}
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
