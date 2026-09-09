"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function PDFToPPT() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;

      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      const images: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        await page.render({ canvasContext: canvas.getContext("2d")!, viewport } as never).promise;
        images.push(canvas.toDataURL("image/jpeg", 0.85));
      }

      images.forEach((dataUrl, i) => {
        const base64 = dataUrl.split(",")[1];
        zip.file(`slide_${i + 1}.jpg`, base64, { base64: true });
      });

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const name = files[0].name.replace(/\.pdf$/i, "");
      saveAs(zipBlob, `${name}_slides.zip`);
    } catch {
      alert("Error converting PDF. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout slug="pdf-to-ppt" title="PDF to PowerPoint" description="Export PDF pages as slide images." color="#3498DB">
      <FileDropzone files={files} onFilesAdded={(f) => setFiles(f.slice(0, 1))} onRemove={() => setFiles([])} multiple={false} />
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <p className="text-sm text-muted">Each PDF page will be exported as a high-quality image, packaged in a ZIP file ready for import into PowerPoint.</p>
          <button onClick={handleConvert} disabled={processing}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
            {processing ? "Converting..." : "Export as Slide Images"}
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
