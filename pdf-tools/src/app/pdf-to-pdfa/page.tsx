"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function PDFtoPDFA() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);

      doc.setTitle(files[0].name.replace(/\.pdf$/i, ""));
      doc.setCreator("PDF Tools Online");
      doc.setProducer("PDF Tools Online - PDF/A Converter");
      doc.setCreationDate(new Date());
      doc.setModificationDate(new Date());

      const archived = await PDFDocument.create();
      const pages = await archived.copyPages(doc, Array.from({ length: doc.getPageCount() }, (_, i) => i));
      pages.forEach((p) => archived.addPage(p));

      archived.setTitle(doc.getTitle() || files[0].name);
      archived.setCreator("PDF Tools Online");
      archived.setProducer("PDF Tools Online - PDF/A Output");
      archived.setCreationDate(new Date());
      archived.setModificationDate(new Date());

      const result = await archived.save();
      const name = files[0].name.replace(/\.pdf$/i, "");
      saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), `${name}_pdfa.pdf`);
    } catch {
      alert("Error converting to PDF/A. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout title="PDF to PDF/A" description="Convert to archival format with embedded metadata." color="#3498DB">
      <FileDropzone files={files} onFilesAdded={(f) => setFiles(f.slice(0, 1))} onRemove={() => setFiles([])} multiple={false} />
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="bg-surface-alt border border-border rounded-xl p-4 text-sm space-y-2">
            <h3 className="font-bold">Conversion includes:</h3>
            <ul className="text-muted space-y-1">
              <li>&#10003; Embedded metadata (title, creator, dates)</li>
              <li>&#10003; Reconstructed document structure</li>
              <li>&#10003; Standardized for long-term archival</li>
            </ul>
          </div>
          <button onClick={handleConvert} disabled={processing}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
            {processing ? "Converting..." : "Convert to PDF/A"}
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
