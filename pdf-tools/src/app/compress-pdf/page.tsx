"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function CompressPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ original: number; compressed: number } | null>(null);

  const handleCompress = async () => {
    if (!files[0]) return;
    setProcessing(true);
    setResult(null);
    try {
      const bytes = await files[0].arrayBuffer();
      const originalSize = bytes.byteLength;
      const doc = await PDFDocument.load(bytes);

      // Remove metadata to reduce size
      doc.setTitle("");
      doc.setAuthor("");
      doc.setSubject("");
      doc.setKeywords([]);
      doc.setProducer("");
      doc.setCreator("");

      const compressed = await doc.save({
        useObjectStreams: true,
        addDefaultPage: false,
      });

      const compressedSize = compressed.byteLength;
      setResult({ original: originalSize, compressed: compressedSize });
      saveAs(new Blob([compressed.buffer as ArrayBuffer], { type: "application/pdf" }), "compressed.pdf");
    } catch {
      alert("Error compressing PDF. Please try again.");
    }
    setProcessing(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <ToolPageLayout
      title="Compress PDF"
      description="Reduce PDF file size while keeping the best quality possible."
      color="#E67E22"
    >
      <FileDropzone
        files={files}
        onFilesAdded={(f) => {
          setFiles([f[0]]);
          setResult(null);
        }}
        onRemove={() => {
          setFiles([]);
          setResult(null);
        }}
        multiple={false}
      />
      {files.length > 0 && (
        <button
          onClick={handleCompress}
          disabled={processing}
          className="mt-6 w-full bg-accent-orange hover:opacity-90 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
        >
          {processing ? "Compressing..." : "Compress PDF"}
        </button>
      )}
      {result && (
        <div className="mt-6 bg-surface-alt border border-border rounded-xl p-5 text-center">
          <p className="text-sm text-muted mb-1">Compression result</p>
          <p className="text-lg font-bold">
            {formatSize(result.original)} → {formatSize(result.compressed)}
          </p>
          <p className="text-sm text-accent-green font-medium mt-1">
            {((1 - result.compressed / result.original) * 100).toFixed(1)}% smaller
          </p>
        </div>
      )}
    </ToolPageLayout>
  );
}
