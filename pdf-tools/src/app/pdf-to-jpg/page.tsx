"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function PdfToJpg() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleConvert = async () => {
    if (!files[0]) return;
    setProcessing(true);
    setPreviews([]);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const bytes = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: bytes }).promise;
      const urls: string[] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas } as never).promise;

        const blob = await new Promise<Blob>((resolve) =>
          canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.92)
        );
        saveAs(blob, `page-${i}.jpg`);
        urls.push(canvas.toDataURL("image/jpeg", 0.92));
      }
      setPreviews(urls);
    } catch {
      alert("Error converting PDF. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout
      title="PDF to JPG"
      description="Convert each page of your PDF into a high-quality JPG image."
      color="#3498DB"
    >
      <FileDropzone
        files={files}
        onFilesAdded={(f) => {
          setFiles([f[0]]);
          setPreviews([]);
        }}
        onRemove={() => {
          setFiles([]);
          setPreviews([]);
        }}
        multiple={false}
      />
      {files.length > 0 && (
        <button
          onClick={handleConvert}
          disabled={processing}
          className="mt-6 w-full bg-accent-blue hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          {processing ? "Converting..." : "Convert to JPG"}
        </button>
      )}
      {previews.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-muted mb-3">{previews.length} images downloaded:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {previews.map((src, i) => (
              <div key={i} className="border border-border rounded-lg overflow-hidden">
                <img src={src} alt={`Page ${i + 1}`} className="w-full" />
                <p className="text-xs text-center text-muted py-1">Page {i + 1}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
