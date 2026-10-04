"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function OCRPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState<"auto" | "ocr" | "text">("auto");

  const extractTextLayer = async (bytes: ArrayBuffer) => {
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
        .join(" ").trim();
      if (pageText) extracted += `--- Page ${i} ---\n${pageText}\n\n`;
    }
    return { text: extracted.trim(), doc };
  };

  const ocrFromPdf = async (bytes: ArrayBuffer) => {
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
    const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
    setPageCount(doc.numPages);

    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker("eng", 1, {
      logger: (m: { progress: number }) => {
        if (m.progress) setProgress(Math.round(m.progress * 100));
      },
    });

    let extracted = "";
    for (let i = 1; i <= doc.numPages; i++) {
      setProgress(0);
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport } as never).promise;

      const { data } = await worker.recognize(canvas);
      extracted += `--- Page ${i} ---\n${data.text.trim()}\n\n`;
    }

    await worker.terminate();
    return extracted.trim();
  };

  const handleExtract = async () => {
    if (!files[0]) return;
    setProcessing(true);
    setProgress(0);
    try {
      const bytes = await files[0].arrayBuffer();

      if (mode === "text") {
        const { text: layerText } = await extractTextLayer(bytes);
        setText(layerText || "No text layer found. Try OCR mode for scanned documents.");
      } else if (mode === "ocr") {
        const ocrText = await ocrFromPdf(bytes);
        setText(ocrText || "No text could be recognized.");
      } else {
        const { text: layerText } = await extractTextLayer(bytes);
        if (layerText && layerText.split(/\s+/).length > 20) {
          setText(layerText);
        } else {
          setProgress(0);
          const ocrText = await ocrFromPdf(bytes);
          setText(ocrText || "No text could be recognized.");
        }
      }
    } catch {
      alert("Error processing PDF. Please try again.");
    }
    setProcessing(false);
  };

  const handleDownload = () => {
    const name = files[0]?.name.replace(/\.pdf$/i, "") || "extracted";
    saveAs(new Blob([text], { type: "text/plain" }), `${name}_ocr.txt`);
  };

  return (
    <ToolPageLayout slug="ocr-pdf" title="OCR PDF" description="Extract text from scanned PDFs and images using optical character recognition." color="#16A085">
      <FileDropzone files={files} onFilesAdded={(f) => { setFiles(f.slice(0, 1)); setText(""); }} onRemove={() => { setFiles([]); setText(""); }} multiple={false} />
      {files.length > 0 && !text && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Extraction Mode</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: "auto" as const, label: "Auto Detect" },
                { id: "ocr" as const, label: "Force OCR" },
                { id: "text" as const, label: "Text Layer Only" },
              ]).map((m) => (
                <button key={m.id} onClick={() => setMode(m.id)}
                  className={`text-xs py-2.5 rounded-xl border transition-all active:scale-95 ${mode === m.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted hover:border-primary/50"}`}>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleExtract} disabled={processing}
            className="w-full btn-primary-glass font-semibold py-3 rounded-2xl disabled:opacity-50">
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
                {progress > 0 ? `Recognizing text... ${progress}%` : "Processing..."}
              </span>
            ) : "Extract Text (OCR)"}
          </button>
          {mode !== "text" && (
            <p className="text-xs text-muted text-center">OCR uses Tesseract.js to recognize text from scanned images. Processing may take a moment.</p>
          )}
        </div>
      )}
      {text && (
        <div className="mt-6 space-y-4">
          <p className="text-sm text-muted">{pageCount} page(s) processed — {text.split(/\s+/).length} words extracted</p>
          <div className="flex gap-2">
            <button onClick={handleDownload} className="flex-1 btn-primary-glass font-semibold py-3 rounded-2xl">
              Download .txt
            </button>
            <button onClick={() => navigator.clipboard.writeText(text)}
              className="px-6 btn-glass font-semibold py-3 rounded-2xl">
              Copy
            </button>
          </div>
          <div className="glass-card rounded-xl p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm whitespace-pre-wrap">{text}</pre>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
