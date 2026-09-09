"use client";

import { useState, useRef, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function SignPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [signaturePage, setSignaturePage] = useState(1);
  const [posX, setPosX] = useState(100);
  const [posY, setPosY] = useState(100);
  const [sigWidth, setSigWidth] = useState(200);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = canvasRef.current!.getContext("2d")!;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDraw = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleFilesAdded = async (newFiles: File[]) => {
    const file = newFiles[0];
    if (!file) return;
    setFiles([file]);
    const bytes = await file.arrayBuffer();
    const doc = await PDFDocument.load(bytes);
    setPageCount(doc.getPageCount());
  };

  const handleSign = async () => {
    if (!files[0] || !hasSignature) return;
    setProcessing(true);
    try {
      const canvas = canvasRef.current!;
      const sigBlob = await new Promise<Blob>((resolve) =>
        canvas.toBlob((b) => resolve(b!), "image/png")
      );
      const sigBytes = await sigBlob.arrayBuffer();

      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const sigImage = await doc.embedPng(sigBytes);
      const page = doc.getPages()[signaturePage - 1];
      if (!page) throw new Error("Invalid page");

      const { height } = page.getSize();
      const aspect = sigImage.height / sigImage.width;
      const drawHeight = sigWidth * aspect;

      page.drawImage(sigImage, {
        x: posX,
        y: height - posY - drawHeight,
        width: sigWidth,
        height: drawHeight,
      });

      const result = await doc.save();
      saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), "signed.pdf");
    } catch {
      alert("Error signing PDF. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout
      title="Sign PDF"
      description="Draw your signature and place it on any page of your PDF."
      color="#27AE60"
    >
      <FileDropzone
        files={files}
        onFilesAdded={handleFilesAdded}
        onRemove={() => { setFiles([]); setPageCount(0); }}
        multiple={false}
      />
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Draw your signature</label>
              <button onClick={clearSignature} className="text-xs text-primary hover:underline">Clear</button>
            </div>
            <canvas
              ref={canvasRef}
              width={600}
              height={200}
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
              className="w-full border-2 border-dashed border-border rounded-xl cursor-crosshair touch-none"
              style={{ maxHeight: "160px" }}
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-muted block mb-1">Page</label>
              <input type="number" min={1} max={pageCount} value={signaturePage}
                onChange={(e) => setSignaturePage(Number(e.target.value))}
                className="w-full border border-border rounded-lg px-3 py-1.5 bg-surface text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">X Position</label>
              <input type="number" min={0} value={posX}
                onChange={(e) => setPosX(Number(e.target.value))}
                className="w-full border border-border rounded-lg px-3 py-1.5 bg-surface text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Y Position</label>
              <input type="number" min={0} value={posY}
                onChange={(e) => setPosY(Number(e.target.value))}
                className="w-full border border-border rounded-lg px-3 py-1.5 bg-surface text-sm focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs text-muted block mb-1">Width</label>
              <input type="number" min={50} max={500} value={sigWidth}
                onChange={(e) => setSigWidth(Number(e.target.value))}
                className="w-full border border-border rounded-lg px-3 py-1.5 bg-surface text-sm focus:outline-none focus:border-primary" />
            </div>
          </div>
          {hasSignature && (
            <button onClick={handleSign} disabled={processing}
              className="w-full bg-accent-green hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
              {processing ? "Signing..." : "Sign PDF"}
            </button>
          )}
        </div>
      )}
    </ToolPageLayout>
  );
}
