"use client";

import { useState, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";

export default function ScanToPDF() {
  const [captures, setCaptures] = useState<string[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [processing, setProcessing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setStreaming(true);
    } catch {
      alert("Could not access camera. Please allow camera permissions.");
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setStreaming(false);
  };

  const capture = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")!.drawImage(videoRef.current, 0, 0);
    setCaptures((prev) => [...prev, canvas.toDataURL("image/jpeg", 0.9)]);
  };

  const removeCapture = (idx: number) => {
    setCaptures((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCreatePDF = async () => {
    if (captures.length === 0) return;
    setProcessing(true);
    try {
      const doc = await PDFDocument.create();
      for (const dataUrl of captures) {
        const res = await fetch(dataUrl);
        const imgBytes = await res.arrayBuffer();
        const img = await doc.embedJpg(new Uint8Array(imgBytes));
        const page = doc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const result = await doc.save();
      saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), "scanned.pdf");
    } catch {
      alert("Error creating PDF. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout slug="scan-to-pdf" title="Scan to PDF" description="Capture documents with your camera and convert to PDF." color="#E67E22">
      <div className="space-y-4">
        {!streaming ? (
          <button onClick={startCamera}
            className="w-full btn-primary-glass font-semibold py-3 rounded-2xl">
            Open Camera
          </button>
        ) : (
          <div className="space-y-3">
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl border border-border" />
            <div className="flex gap-2">
              <button onClick={capture}
                className="flex-1 bg-accent-green text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-colors">
                Capture Page
              </button>
              <button onClick={stopCamera}
                className="px-6 bg-surface border border-border text-foreground font-semibold py-3 rounded-xl hover:bg-surface-alt transition-colors">
                Stop
              </button>
            </div>
          </div>
        )}

        {captures.length > 0 && (
          <>
            <p className="text-sm font-medium">{captures.length} page(s) captured</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {captures.map((src, i) => (
                <div key={i} className="relative group">
                  <img src={src} alt={`Page ${i + 1}`} className="w-full rounded-lg border border-border" />
                  <button onClick={() => removeCapture(i)}
                    className="absolute top-1 right-1 bg-black/60 text-white w-5 h-5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    &times;
                  </button>
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">{i + 1}</span>
                </div>
              ))}
            </div>
            <button onClick={handleCreatePDF} disabled={processing}
              className="w-full btn-primary-glass font-semibold py-3 rounded-2xl disabled:opacity-50">
              {processing ? "Creating PDF..." : `Create PDF (${captures.length} pages)`}
            </button>
          </>
        )}
      </div>
    </ToolPageLayout>
  );
}
