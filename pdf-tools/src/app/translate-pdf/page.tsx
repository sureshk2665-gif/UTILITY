"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

const languages = [
  { code: "es", name: "Spanish" }, { code: "fr", name: "French" }, { code: "de", name: "German" },
  { code: "it", name: "Italian" }, { code: "pt", name: "Portuguese" }, { code: "zh", name: "Chinese" },
  { code: "ja", name: "Japanese" }, { code: "ko", name: "Korean" }, { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" }, { code: "ru", name: "Russian" }, { code: "nl", name: "Dutch" },
];

export default function TranslatePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [targetLang, setTargetLang] = useState("es");
  const [processing, setProcessing] = useState(false);
  const [extracted, setExtracted] = useState(false);

  const handleExtract = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;
      let fullText = "";
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        fullText += content.items
          .filter((item) => "str" in item)
          .map((item) => (item as unknown as { str: string }).str).join(" ") + "\n\n";
      }
      setText(fullText.trim());
      setExtracted(true);
    } catch {
      alert("Error extracting text. Please try again.");
    }
    setProcessing(false);
  };

  const openTranslate = () => {
    const url = `https://translate.google.com/?sl=auto&tl=${targetLang}&text=${encodeURIComponent(text.slice(0, 5000))}`;
    window.open(url, "_blank");
  };

  return (
    <ToolPageLayout slug="translate-pdf" title="Translate PDF" description="Extract text and translate your PDF documents." color="#16A085">
      <FileDropzone files={files} onFilesAdded={(f) => { setFiles(f.slice(0, 1)); setText(""); setExtracted(false); }}
        onRemove={() => { setFiles([]); setText(""); setExtracted(false); }} multiple={false} />
      {files.length > 0 && !extracted && (
        <div className="mt-6">
          <button onClick={handleExtract} disabled={processing}
            className="w-full btn-primary-glass font-semibold py-3 rounded-2xl disabled:opacity-50">
            {processing ? "Extracting text..." : "Extract Text for Translation"}
          </button>
        </div>
      )}
      {extracted && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Target Language</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {languages.map((l) => (
                <button key={l.code} onClick={() => setTargetLang(l.code)}
                  className={`text-xs py-2 rounded-lg border transition-colors ${targetLang === l.code ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-muted hover:border-primary"}`}>
                  {l.name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={openTranslate}
              className="flex-1 btn-primary-glass font-semibold py-3 rounded-2xl">
              Open in Google Translate
            </button>
            <button onClick={() => navigator.clipboard.writeText(text)}
              className="px-6 bg-secondary text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-colors">
              Copy Text
            </button>
          </div>
          <button onClick={() => saveAs(new Blob([text], { type: "text/plain" }), "extracted_text.txt")}
            className="w-full bg-surface border border-border text-foreground font-medium py-2.5 rounded-xl text-sm hover:bg-surface-alt transition-colors">
            Download Extracted Text (.txt)
          </button>
          <div className="bg-surface border border-border rounded-xl p-4 max-h-64 overflow-y-auto">
            <pre className="text-sm whitespace-pre-wrap">{text.slice(0, 3000)}{text.length > 3000 ? "\n\n... (truncated for preview)" : ""}</pre>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
