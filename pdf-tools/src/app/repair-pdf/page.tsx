"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function RepairPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(newFiles.slice(0, 1));
    setStatus(null);
  };

  const handleRepair = async () => {
    if (!files[0]) return;
    setProcessing(true);
    setStatus("Analyzing PDF structure...");
    try {
      const bytes = await files[0].arrayBuffer();
      setStatus("Attempting to parse and reconstruct...");
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const pageCount = doc.getPageCount();
      setStatus(`Found ${pageCount} page(s). Rebuilding document...`);

      const repaired = await PDFDocument.create();
      const pages = await repaired.copyPages(doc, Array.from({ length: pageCount }, (_, i) => i));
      pages.forEach((p) => repaired.addPage(p));

      repaired.setCreator("PDF Tools Online - Repaired");
      const result = await repaired.save();
      const originalSize = bytes.byteLength;
      const repairedSize = result.byteLength;

      saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), "repaired.pdf");
      setStatus(`Repair complete. ${pageCount} page(s) recovered. Size: ${(originalSize / 1024).toFixed(0)}KB → ${(repairedSize / 1024).toFixed(0)}KB`);
    } catch {
      setStatus("Could not repair this PDF. The file may be too severely damaged.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout slug="repair-pdf" title="Repair PDF" description="Fix damaged or corrupted PDF files." color="#E67E22">
      <FileDropzone files={files} onFilesAdded={handleFilesAdded} onRemove={() => { setFiles([]); setStatus(null); }} multiple={false} />
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          {status && (
            <div className="bg-surface-alt border border-border rounded-xl p-4 text-sm text-muted">{status}</div>
          )}
          <button onClick={handleRepair} disabled={processing}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
            {processing ? "Repairing..." : "Repair PDF"}
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
