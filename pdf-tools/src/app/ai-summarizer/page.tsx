"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function AISummarizer() {
  const [files, setFiles] = useState<File[]>([]);
  const [summary, setSummary] = useState("");
  const [processing, setProcessing] = useState(false);
  const [length, setLength] = useState<"brief" | "detailed">("brief");

  const handleSummarize = async () => {
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
          .map((item) => (item as unknown as { str: string }).str).join(" ") + " ";
      }

      const sentences: string[] = fullText.match(/[^.!?]+[.!?]+/g) || [];
      if (sentences.length === 0) {
        setSummary("No text content found to summarize.");
        setProcessing(false);
        return;
      }

      const wordFreq: Record<string, number> = {};
      const words = fullText.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/);
      const stopWords = new Set(["the","a","an","is","are","was","were","be","been","being","have","has","had","do","does","did","will","would","could","should","may","might","shall","can","need","dare","ought","used","to","of","in","for","on","with","at","by","from","as","into","through","during","before","after","above","below","between","out","off","over","under","again","further","then","once","and","but","or","nor","not","so","yet","both","either","neither","each","every","all","any","few","more","most","other","some","such","no","only","same","than","too","very","just","because","if","when","where","how","what","which","who","whom","this","that","these","those","i","me","my","we","our","you","your","he","him","his","she","her","it","its","they","them","their"]);
      for (const w of words) if (w.length > 2 && !stopWords.has(w)) wordFreq[w] = (wordFreq[w] || 0) + 1;

      const scored = sentences.map((s) => {
        const sWords = s.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/);
        const score = sWords.reduce((sum: number, w: string) => sum + (wordFreq[w] || 0), 0) / Math.max(sWords.length, 1);
        return { sentence: s.trim(), score };
      });

      scored.sort((a, b) => b.score - a.score);
      const topN = length === "brief" ? Math.min(5, sentences.length) : Math.min(15, sentences.length);
      const topSentences = scored.slice(0, topN);
      topSentences.sort((a, b) => sentences.indexOf(a.sentence) - sentences.indexOf(b.sentence));

      const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 10);

      let result = `📄 Document Summary\n`;
      result += `Pages: ${doc.numPages} | Words: ${words.length} | Sentences: ${sentences.length}\n\n`;
      result += `Key Points:\n${topSentences.map((s) => `• ${s.sentence}`).join("\n")}\n\n`;
      result += `Top Keywords: ${topWords.map(([w]) => w).join(", ")}`;

      setSummary(result);
    } catch {
      alert("Error summarizing PDF. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout slug="ai-summarizer" title="AI Summarizer" description="Generate smart summaries of your PDF documents." color="#16A085">
      <FileDropzone files={files} onFilesAdded={(f) => { setFiles(f.slice(0, 1)); setSummary(""); }} onRemove={() => { setFiles([]); setSummary(""); }} multiple={false} />
      {files.length > 0 && !summary && (
        <div className="mt-6 space-y-4">
          <div className="flex gap-2">
            {(["brief", "detailed"] as const).map((l) => (
              <button key={l} onClick={() => setLength(l)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${length === l ? "border-primary bg-primary/10 text-primary" : "border-border bg-surface text-muted"}`}>
                {l === "brief" ? "Brief (5 points)" : "Detailed (15 points)"}
              </button>
            ))}
          </div>
          <button onClick={handleSummarize} disabled={processing}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
            {processing ? "Analyzing..." : "Summarize PDF"}
          </button>
        </div>
      )}
      {summary && (
        <div className="mt-6 space-y-4">
          <div className="flex gap-2">
            <button onClick={() => saveAs(new Blob([summary], { type: "text/plain" }), "summary.txt")}
              className="flex-1 bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors">
              Download Summary
            </button>
            <button onClick={() => navigator.clipboard.writeText(summary)}
              className="px-6 bg-secondary text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-colors">
              Copy
            </button>
          </div>
          <div className="bg-surface border border-border rounded-xl p-5">
            <pre className="text-sm whitespace-pre-wrap">{summary}</pre>
          </div>
        </div>
      )}
    </ToolPageLayout>
  );
}
