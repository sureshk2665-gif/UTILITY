"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function UnlockPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(newFiles.slice(0, 1));
  };

  const handleUnlock = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes, {
        ignoreEncryption: true,
        ...(password ? { password } : {}),
      } as Parameters<typeof PDFDocument.load>[1]);

      const unlocked = await PDFDocument.create();
      const pages = await unlocked.copyPages(doc, Array.from({ length: doc.getPageCount() }, (_, i) => i));
      pages.forEach((p) => unlocked.addPage(p));

      const result = await unlocked.save();
      saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), "unlocked.pdf");
    } catch {
      alert("Failed to unlock PDF. The password may be incorrect or the encryption is unsupported.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout slug="unlock-pdf" title="Unlock PDF" description="Remove password protection from your PDF documents." color="#8E44AD">
      <FileDropzone files={files} onFilesAdded={handleFilesAdded} onRemove={() => setFiles([])} multiple={false} />
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">PDF Password (if required)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full border border-border rounded-lg px-4 py-2.5 bg-surface text-sm focus:outline-none focus:border-primary" />
          </div>
          <button onClick={handleUnlock} disabled={processing}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
            {processing ? "Unlocking..." : "Unlock & Download PDF"}
          </button>
          <p className="text-xs text-muted text-center">
            The document is reconstructed without password restrictions.
          </p>
        </div>
      )}
    </ToolPageLayout>
  );
}
