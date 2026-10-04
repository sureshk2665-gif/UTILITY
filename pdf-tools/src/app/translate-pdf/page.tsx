"use client";

import { useState } from "react";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

const languages = [
  { code: "es", name: "Spanish", flag: "ES" },
  { code: "fr", name: "French", flag: "FR" },
  { code: "de", name: "German", flag: "DE" },
  { code: "it", name: "Italian", flag: "IT" },
  { code: "pt", name: "Portuguese", flag: "PT" },
  { code: "zh-CN", name: "Chinese", flag: "CN" },
  { code: "ja", name: "Japanese", flag: "JP" },
  { code: "ko", name: "Korean", flag: "KR" },
  { code: "ar", name: "Arabic", flag: "AR" },
  { code: "hi", name: "Hindi", flag: "IN" },
  { code: "ru", name: "Russian", flag: "RU" },
  { code: "nl", name: "Dutch", flag: "NL" },
  { code: "tr", name: "Turkish", flag: "TR" },
  { code: "pl", name: "Polish", flag: "PL" },
  { code: "sv", name: "Swedish", flag: "SE" },
  { code: "vi", name: "Vietnamese", flag: "VN" },
];

async function translateText(text: string, targetLang: string): Promise<string> {
  const chunks: string[] = [];
  const maxLen = 1800;
  let remaining = text;
  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining);
      break;
    }
    let splitAt = remaining.lastIndexOf(". ", maxLen);
    if (splitAt < maxLen * 0.3) splitAt = remaining.lastIndexOf(" ", maxLen);
    if (splitAt < maxLen * 0.3) splitAt = maxLen;
    chunks.push(remaining.slice(0, splitAt + 1));
    remaining = remaining.slice(splitAt + 1);
  }

  const translated: string[] = [];
  for (const chunk of chunks) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en|${targetLang}`;
    const resp = await fetch(url);
    const data = await resp.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      translated.push(data.responseData.translatedText);
    } else {
      translated.push(chunk);
    }
    if (chunks.length > 1) await new Promise((r) => setTimeout(r, 500));
  }
  return translated.join(" ");
}

export default function TranslatePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [targetLang, setTargetLang] = useState("es");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, status: "" });
  const [translatedPages, setTranslatedPages] = useState<{ original: string; translated: string }[]>([]);
  const [showOriginal, setShowOriginal] = useState(false);

  const reset = () => {
    setFiles([]);
    setTranslatedPages([]);
    setProgress({ current: 0, total: 0, status: "" });
  };

  const handleTranslate = async () => {
    if (!files[0]) return;
    setProcessing(true);
    setTranslatedPages([]);
    try {
      setProgress({ current: 0, total: 0, status: "Extracting text from PDF..." });
      const bytes = await files[0].arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;

      const pages: string[] = [];
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const text = content.items
          .filter((item) => "str" in item)
          .map((item) => (item as unknown as { str: string }).str).join(" ").trim();
        pages.push(text);
      }

      const results: { original: string; translated: string }[] = [];
      for (let i = 0; i < pages.length; i++) {
        setProgress({ current: i + 1, total: pages.length, status: `Translating page ${i + 1} of ${pages.length}...` });
        if (pages[i].length < 5) {
          results.push({ original: pages[i], translated: pages[i] });
          continue;
        }
        const translated = await translateText(pages[i], targetLang);
        results.push({ original: pages[i], translated });
      }

      setTranslatedPages(results);
    } catch {
      alert("Error translating PDF. Please try again.");
    }
    setProcessing(false);
  };

  const downloadAsText = () => {
    const langName = languages.find((l) => l.code === targetLang)?.name || targetLang;
    const content = translatedPages
      .map((p, i) => `--- Page ${i + 1} (${langName}) ---\n${p.translated}`)
      .join("\n\n");
    const name = files[0]?.name.replace(/\.pdf$/i, "") || "translated";
    saveAs(new Blob([content], { type: "text/plain;charset=utf-8" }), `${name}_${targetLang}.txt`);
  };

  const downloadAsPDF = async () => {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;
    const margin = 50;
    const lineHeight = fontSize * 1.4;

    for (let i = 0; i < translatedPages.length; i++) {
      const text = translatedPages[i].translated;
      const words = text.split(/\s+/);
      let page = doc.addPage();
      const { width, height } = page.getSize();
      const maxWidth = width - margin * 2;
      let y = height - margin;
      let line = "";

      for (const word of words) {
        const testLine = line ? `${line} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);
        if (testWidth > maxWidth && line) {
          if (y < margin + lineHeight) {
            page = doc.addPage();
            y = page.getSize().height - margin;
          }
          page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
          y -= lineHeight;
          line = word;
        } else {
          line = testLine;
        }
      }
      if (line) {
        if (y < margin + lineHeight) {
          page = doc.addPage();
          y = page.getSize().height - margin;
        }
        page.drawText(line, { x: margin, y, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
      }
    }

    const result = await doc.save();
    const name = files[0]?.name.replace(/\.pdf$/i, "") || "translated";
    saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), `${name}_${targetLang}.pdf`);
  };

  const langName = languages.find((l) => l.code === targetLang)?.name || "";

  return (
    <ToolPageLayout slug="translate-pdf" title="Translate PDF" description="Translate your PDF documents to 16+ languages." color="#16A085">
      <FileDropzone files={files} onFilesAdded={(f) => { setFiles(f.slice(0, 1)); setTranslatedPages([]); }}
        onRemove={reset} multiple={false} />

      {files.length > 0 && translatedPages.length === 0 && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Translate to</label>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
              {languages.map((l) => (
                <button key={l.code} onClick={() => setTargetLang(l.code)}
                  className={`text-xs py-2.5 rounded-xl border transition-all active:scale-95 ${targetLang === l.code ? "border-primary bg-primary/10 text-primary font-semibold" : "border-border text-muted hover:border-primary/50"}`}>
                  <span className="block text-[10px] opacity-60">{l.flag}</span>
                  {l.name}
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleTranslate} disabled={processing}
            className="w-full btn-primary-glass font-semibold py-3 rounded-2xl disabled:opacity-50">
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
                {progress.status}
              </span>
            ) : `Translate to ${langName}`}
          </button>
          {processing && progress.total > 0 && (
            <div className="w-full bg-border/30 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(progress.current / progress.total) * 100}%` }} />
            </div>
          )}
          <p className="text-xs text-muted text-center">Uses MyMemory Translation API. Best results with English source documents.</p>
        </div>
      )}

      {translatedPages.length > 0 && (
        <div className="mt-6 space-y-4">
          <div className="bg-accent-green/10 border border-accent-green/30 rounded-xl p-3 text-sm text-accent-green font-medium text-center">
            Translation complete! {translatedPages.length} page(s) translated to {langName}.
          </div>

          <div className="flex gap-2">
            <button onClick={downloadAsPDF} className="flex-1 btn-primary-glass font-semibold py-3 rounded-2xl">
              Download PDF
            </button>
            <button onClick={downloadAsText} className="flex-1 btn-glass font-semibold py-3 rounded-2xl">
              Download .txt
            </button>
          </div>

          <button onClick={() => setShowOriginal(!showOriginal)}
            className="w-full text-xs text-muted hover:text-foreground transition-colors py-1">
            {showOriginal ? "Hide original text" : "Show original alongside translation"}
          </button>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {translatedPages.map((p, i) => (
              <div key={i} className="glass-card rounded-xl p-4">
                <h4 className="text-xs font-bold text-primary mb-2">Page {i + 1}</h4>
                {showOriginal && (
                  <div className="mb-3 pb-3 border-b border-border">
                    <p className="text-[10px] uppercase tracking-wider text-muted mb-1">Original</p>
                    <p className="text-sm text-foreground/60">{p.original.slice(0, 500)}{p.original.length > 500 ? "..." : ""}</p>
                  </div>
                )}
                <div>
                  {showOriginal && <p className="text-[10px] uppercase tracking-wider text-muted mb-1">{langName}</p>}
                  <p className="text-sm">{p.translated.slice(0, 800)}{p.translated.length > 800 ? "..." : ""}</p>
                </div>
              </div>
            ))}
          </div>

          <button onClick={reset}
            className="w-full text-sm text-muted hover:text-foreground transition-colors py-2">
            Translate another document
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
