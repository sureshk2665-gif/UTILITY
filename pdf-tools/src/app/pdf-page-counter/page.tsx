"use client";

import { useState } from "react";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function PDFPageCounter() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{ pages: number; size: string; name: string } | null>(null);
  const [processing, setProcessing] = useState(false);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(2) + " MB";
  };

  const handleCount = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
      setResult({ pages: doc.numPages, size: formatSize(files[0].size), name: files[0].name });
    } catch {
      alert("Error reading PDF. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout title="PDF Page Counter" description="Instantly count pages and check file size of any PDF." color="#16A085">
      <FileDropzone files={files} onFilesAdded={(f) => { setFiles(f.slice(0, 1)); setResult(null); }} onRemove={() => { setFiles([]); setResult(null); }} multiple={false} />
      {files.length > 0 && !result && (
        <div className="mt-6">
          <button onClick={handleCount} disabled={processing}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
            {processing ? "Analyzing..." : "Count Pages"}
          </button>
        </div>
      )}
      {result && (
        <div className="mt-6 bg-surface-alt border border-border rounded-xl p-6 text-center space-y-4">
          <p className="text-sm text-muted">{result.name}</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-3xl font-bold text-primary">{result.pages}</p>
              <p className="text-xs text-muted mt-1">Pages</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary">{result.size}</p>
              <p className="text-xs text-muted mt-1">File Size</p>
            </div>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
