"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function OCRPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [pageCount, setPageCount] = useState(0);

  const handleExtract = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
      setPageCount(doc.numPages);
      let extracted = "";

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .filter((item) => "str" in item)
          .map((item) => (item as unknown as { str: string }).str)
          .join(" ");
        extracted += `--- Page ${i} ---\n${pageText}\n\n`;
      }

      setText(extracted.trim() || "No text content found. This PDF may contain only scanned images.");
    } catch {
      alert("Error extracting text. Please try again.");
    }
    setProcessing(false);
  };

  const handleDownload = () => {
    const name = files[0]?.name.replace(/\.pdf$/i, "") || "extracted";
    saveAs(new Blob([text], { type: "text/plain" }), `${name}_ocr.txt`);
  };

  return (
    <ToolPageLayout slug="ocr-pdf" title="OCR PDF" description="Extract text from PDF documents." color="#16A085">
      <FileDropzone files={files} onFilesAdded={(f) => { setFiles(f.slice(0, 1)); setText(""); }} onRemove={() => { setFiles([]); setText(""); }} multiple={false} />
      {files.length > 0 && !text && (
        <div className="mt-6">
          <button onClick={handleExtract} disabled={processing}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
            {processing ? "Extracting text..." : "Extract Text (OCR)"}
          </button>
        </div>
      )}
      {text && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted">{pageCount} page(s) processed — {text.split(/\s+/).length} words extracted</p>
          <div className="flex gap-2">
            <button onClick={handleDownload}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors">
              Download .txt
            </button>
            <button onClick={() => navigator.clipboard.writeText(text)}
              className="px-6 bg-secondary text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-colors">
              Copy
            </button>
          </div>
          <div className="bg-surface border border-border rounded-xl p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm whitespace-pre-wrap">{text}</pre>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
