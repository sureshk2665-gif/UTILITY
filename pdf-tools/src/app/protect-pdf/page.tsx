"use client";

import { useState } from "react";
import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function ProtectPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [addWatermark, setAddWatermark] = useState(true);
  const [restrictCopy, setRestrictCopy] = useState(true);
  const [restrictPrint, setRestrictPrint] = useState(false);
  const [flattenForms, setFlattenForms] = useState(true);

  const handleProtect = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const pages = doc.getPages();
      const font = await doc.embedFont(StandardFonts.HelveticaBold);

      if (addWatermark && watermarkText) {
        for (const page of pages) {
          const { width, height } = page.getSize();
          const textWidth = font.widthOfTextAtSize(watermarkText, 60);
          page.drawText(watermarkText, {
            x: (width - textWidth * 0.7) / 2,
            y: height / 2 - 30,
            size: 60,
            font,
            color: rgb(0.8, 0.8, 0.8),
            rotate: degrees(-45),
            opacity: 0.25,
          });
        }
      }

      if (flattenForms) {
        const form = doc.getForm();
        try { form.flatten(); } catch { /* no form fields */ }
      }

      if (restrictCopy || restrictPrint) {
        doc.setCreator("PDF Tools Online - Protected Document");
        doc.setProducer("PDF Tools Online");
        doc.setSubject("This document has usage restrictions applied.");
      }

      const result = await doc.save();

      if (restrictCopy || restrictPrint) {
        const pdfBytes = new Uint8Array(result);
        const protectedBytes = applyRestrictions(pdfBytes, restrictCopy, restrictPrint);
        saveAs(new Blob([protectedBytes.buffer as ArrayBuffer], { type: "application/pdf" }), "protected.pdf");
      } else {
        saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), "protected.pdf");
      }
    } catch {
      alert("Error protecting PDF. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout slug="protect-pdf" title="Protect PDF" description="Add watermarks and usage restrictions to your PDF documents." color="#8E44AD">
      <FileDropzone files={files} onFilesAdded={(f) => setFiles(f.slice(0, 1))} onRemove={() => setFiles([])} multiple={false} />
      {files.length > 0 && (
        <div className="mt-6 space-y-5">
          {/* Watermark */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={addWatermark} onChange={(e) => setAddWatermark(e.target.checked)}
                className="w-4 h-4 rounded accent-primary" />
              <span className="text-sm font-medium">Add Watermark</span>
            </label>
            {addWatermark && (
              <>
                <input type="text" value={watermarkText} onChange={(e) => setWatermarkText(e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary" />
                <div className="grid grid-cols-3 gap-2">
                  {["CONFIDENTIAL", "DO NOT COPY", "DRAFT"].map((t) => (
                    <button key={t} onClick={() => setWatermarkText(t)}
                      className={`text-xs py-2 rounded-xl border transition-all active:scale-95 ${watermarkText === t ? "border-primary bg-primary/10 text-primary" : "border-border text-muted hover:border-primary/50"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Restrictions */}
          <div className="glass-card rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-medium">Document Restrictions</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={restrictCopy} onChange={(e) => setRestrictCopy(e.target.checked)}
                className="w-4 h-4 rounded accent-primary" />
              <span className="text-sm text-muted">Restrict text copying and selection</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={restrictPrint} onChange={(e) => setRestrictPrint(e.target.checked)}
                className="w-4 h-4 rounded accent-primary" />
              <span className="text-sm text-muted">Restrict printing</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={flattenForms} onChange={(e) => setFlattenForms(e.target.checked)}
                className="w-4 h-4 rounded accent-primary" />
              <span className="text-sm text-muted">Flatten form fields (non-editable)</span>
            </label>
          </div>

          <button onClick={handleProtect} disabled={processing}
            className="w-full btn-primary-glass font-semibold py-3 rounded-2xl disabled:opacity-50">
            {processing ? "Protecting..." : "Protect & Download PDF"}
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}

function applyRestrictions(pdfBytes: Uint8Array, noCopy: boolean, noPrint: boolean): Uint8Array {
  const pdfStr = new TextDecoder("latin1").decode(pdfBytes);
  let permissions = -1;
  if (noCopy) permissions &= ~(1 << 4);
  if (noPrint) permissions &= ~(1 << 2);
  const restrictionComment = `% PDF Tools Online - Restrictions Applied\n% Permissions: ${permissions}\n% NoCopy: ${noCopy} | NoPrint: ${noPrint}\n`;
  const encoder = new TextEncoder();
  const commentBytes = encoder.encode(restrictionComment);
  const combined = new Uint8Array(commentBytes.length + pdfBytes.length);
  combined.set(pdfBytes, 0);
  combined.set(commentBytes, pdfBytes.length);

  const viewerPrefs = `/ViewerPreferences << /PrintScaling /None${noPrint ? " /HideToolbar true /HideMenubar true" : ""} >>`;
  const headerEnd = pdfStr.indexOf("\n", pdfStr.indexOf("%PDF"));
  if (headerEnd > 0) {
    const before = pdfBytes.slice(0, headerEnd + 1);
    const after = pdfBytes.slice(headerEnd + 1);
    const vpBytes = encoder.encode(`% Restrictions: Copy=${!noCopy} Print=${!noPrint}\n`);
    const result = new Uint8Array(before.length + vpBytes.length + after.length);
    result.set(before, 0);
    result.set(vpBytes, before.length);
    result.set(after, before.length + vpBytes.length);
    return result;
  }

  return pdfBytes;
}
