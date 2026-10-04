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
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleUnlock = async () => {
    if (!files[0]) return;
    setProcessing(true);
    setStatus("idle");
    setErrorMsg("");
    try {
      const bytes = await files[0].arrayBuffer();

      let doc: Awaited<ReturnType<typeof PDFDocument.load>>;
      try {
        doc = await PDFDocument.load(bytes, {
          ignoreEncryption: true,
          ...(password ? { password } : {}),
        } as Parameters<typeof PDFDocument.load>[1]);
      } catch {
        if (password) {
          try {
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
            const pdfDoc = await pdfjsLib.getDocument({ data: bytes, password }).promise;

            const unlocked = await PDFDocument.create();
            for (let i = 0; i < pdfDoc.numPages; i++) {
              const page = await pdfDoc.getPage(i + 1);
              const viewport = page.getViewport({ scale: 2 });
              const canvas = document.createElement("canvas");
              canvas.width = viewport.width;
              canvas.height = viewport.height;
              const ctx = canvas.getContext("2d")!;
              await page.render({ canvasContext: ctx, viewport } as never).promise;
              const imgData = canvas.toDataURL("image/jpeg", 0.92);
              const imgBytes = Uint8Array.from(atob(imgData.split(",")[1]), (c) => c.charCodeAt(0));
              const img = await unlocked.embedJpg(imgBytes);
              const newPage = unlocked.addPage([viewport.width / 2, viewport.height / 2]);
              newPage.drawImage(img, { x: 0, y: 0, width: viewport.width / 2, height: viewport.height / 2 });
            }
            const result = await unlocked.save();
            const name = files[0].name.replace(/\.pdf$/i, "");
            saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), `${name}_unlocked.pdf`);
            setStatus("success");
            setProcessing(false);
            return;
          } catch {
            setErrorMsg("Incorrect password or unsupported encryption method.");
            setStatus("error");
            setProcessing(false);
            return;
          }
        }
        setErrorMsg("This PDF is encrypted. Please provide the password.");
        setStatus("error");
        setProcessing(false);
        return;
      }

      const unlocked = await PDFDocument.create();
      const pageIndices = Array.from({ length: doc.getPageCount() }, (_, i) => i);
      const pages = await unlocked.copyPages(doc, pageIndices);
      pages.forEach((p) => unlocked.addPage(p));

      unlocked.setCreator("PDF Tools Online");
      unlocked.setProducer("PDF Tools Online - Unlocked");

      const result = await unlocked.save();
      const name = files[0].name.replace(/\.pdf$/i, "");
      saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), `${name}_unlocked.pdf`);
      setStatus("success");
    } catch {
      setErrorMsg("Failed to unlock PDF. The file may be corrupted or use unsupported encryption.");
      setStatus("error");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout slug="unlock-pdf" title="Unlock PDF" description="Remove password protection and restrictions from PDF documents." color="#8E44AD">
      <FileDropzone files={files} onFilesAdded={(f) => { setFiles(f.slice(0, 1)); setStatus("idle"); }} onRemove={() => { setFiles([]); setStatus("idle"); }} multiple={false} />
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">PDF Password (if required)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to unlock..."
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
            <p className="text-xs text-muted mt-1">Leave empty if the PDF only has restriction-level protection (no open password).</p>
          </div>

          {status === "success" && (
            <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-3 text-sm text-accent-green font-medium text-center">
              PDF unlocked successfully! Your file has been downloaded.
            </div>
          )}
          {status === "error" && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-500 font-medium text-center">
              {errorMsg}
            </div>
          )}

          <button onClick={handleUnlock} disabled={processing}
            className="w-full btn-primary-glass font-semibold py-3 rounded-2xl disabled:opacity-50">
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
                Unlocking...
              </span>
            ) : "Unlock & Download PDF"}
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
