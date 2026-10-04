"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

interface SummaryResult {
  title: string;
  pageCount: number;
  wordCount: number;
  sentenceCount: number;
  readingTime: number;
  keyPoints: string[];
  topKeywords: { word: string; count: number; tfidf: number }[];
  sections: { heading: string; summary: string }[];
}

const STOP_WORDS = new Set([
  "the","a","an","is","are","was","were","be","been","being","have","has","had",
  "do","does","did","will","would","could","should","may","might","shall","can",
  "need","dare","ought","used","to","of","in","for","on","with","at","by","from",
  "as","into","through","during","before","after","above","below","between","out",
  "off","over","under","again","further","then","once","and","but","or","nor","not",
  "so","yet","both","either","neither","each","every","all","any","few","more","most",
  "other","some","such","no","only","same","than","too","very","just","because","if",
  "when","where","how","what","which","who","whom","this","that","these","those","i",
  "me","my","we","our","you","your","he","him","his","she","her","it","its","they",
  "them","their","also","about","up","down","there","here","new","one","two","many",
  "much","well","way","make","like","get","go","see","know","take","come","think",
  "look","want","give","use","find","tell","ask","work","seem","feel","try","leave",
  "call","good","first","last","long","great","little","own","old","right","big",
  "high","different","small","large","next","early","young","important","public",
  "bad","still","said","may","must","now","even","back","us","say","will","using",
  "per","however","include","including","within","without","among","across","along",
  "around","away","based","become","best","better","upon","etc","eg","ie","via",
]);

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z\s'-]/g, "").split(/\s+/).filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function splitSentences(text: string): string[] {
  return (text.match(/[^.!?\n]+[.!?]+|[^.!?\n]+$/g) || [])
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).length >= 4);
}

function computeTFIDF(sentences: string[], allWords: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const w of allWords) tf.set(w, (tf.get(w) || 0) + 1);
  for (const [w, count] of tf) tf.set(w, count / allWords.length);

  const df = new Map<string, number>();
  for (const s of sentences) {
    const unique = new Set(tokenize(s));
    for (const w of unique) df.set(w, (df.get(w) || 0) + 1);
  }

  const tfidf = new Map<string, number>();
  for (const [w, tfVal] of tf) {
    const dfVal = df.get(w) || 1;
    tfidf.set(w, tfVal * Math.log(sentences.length / dfVal));
  }
  return tfidf;
}

function textRankSentences(sentences: string[], tfidf: Map<string, number>, topN: number): string[] {
  const sentenceWords = sentences.map((s) => tokenize(s));

  const similarity = (a: string[], b: string[]): number => {
    const setA = new Set(a);
    const setB = new Set(b);
    let overlap = 0;
    for (const w of setA) if (setB.has(w)) overlap += (tfidf.get(w) || 1);
    return overlap / (Math.log(a.length + 1) + Math.log(b.length + 1) + 1);
  };

  const scores = new Array(sentences.length).fill(1);
  const damping = 0.85;

  for (let iter = 0; iter < 20; iter++) {
    const newScores = new Array(sentences.length).fill(0);
    for (let i = 0; i < sentences.length; i++) {
      let sum = 0;
      let totalSim = 0;
      for (let j = 0; j < sentences.length; j++) {
        if (i === j) continue;
        const sim = similarity(sentenceWords[i], sentenceWords[j]);
        totalSim += sim;
        sum += sim * scores[j];
      }
      newScores[i] = (1 - damping) + damping * (totalSim > 0 ? sum / totalSim : 0);

      if (i < sentences.length * 0.15) newScores[i] *= 1.3;
      if (i > sentences.length * 0.85) newScores[i] *= 1.1;
    }
    for (let i = 0; i < sentences.length; i++) scores[i] = newScores[i];
  }

  const ranked = sentences.map((s, i) => ({ sentence: s, score: scores[i], index: i }));
  ranked.sort((a, b) => b.score - a.score);
  const selected = ranked.slice(0, topN);
  selected.sort((a, b) => a.index - b.index);
  return selected.map((s) => s.sentence);
}

function detectSections(fullText: string): { heading: string; body: string }[] {
  const lines = fullText.split("\n");
  const sections: { heading: string; body: string }[] = [];
  let currentHeading = "Introduction";
  let currentBody: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const isHeading =
      (trimmed.length < 80 && trimmed.length > 2 && /^[A-Z0-9]/.test(trimmed) &&
       (trimmed === trimmed.toUpperCase() || /^\d+[\.\)]\s/.test(trimmed) || !/[.!?]$/.test(trimmed))) &&
      trimmed.split(/\s+/).length <= 10;

    if (isHeading && currentBody.length > 0) {
      sections.push({ heading: currentHeading, body: currentBody.join(" ") });
      currentHeading = trimmed;
      currentBody = [];
    } else {
      currentBody.push(trimmed);
    }
  }
  if (currentBody.length > 0) {
    sections.push({ heading: currentHeading, body: currentBody.join(" ") });
  }
  return sections;
}

export default function AISummarizer() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [processing, setProcessing] = useState(false);
  const [length, setLength] = useState<"brief" | "detailed" | "comprehensive">("brief");
  const [progress, setProgress] = useState("");

  const handleSummarize = async () => {
    if (!files[0]) return;
    setProcessing(true);
    setResult(null);
    try {
      setProgress("Extracting text from PDF...");
      const bytes = await files[0].arrayBuffer();
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      const doc = await pdfjsLib.getDocument({ data: bytes }).promise;

      let fullText = "";
      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .filter((item) => "str" in item)
          .map((item) => (item as unknown as { str: string }).str).join(" ");
        fullText += pageText + "\n\n";
      }

      if (fullText.trim().length < 50) {
        setResult({
          title: files[0].name,
          pageCount: doc.numPages,
          wordCount: 0,
          sentenceCount: 0,
          readingTime: 0,
          keyPoints: ["No sufficient text content found to summarize. This may be a scanned PDF — try the OCR tool first."],
          topKeywords: [],
          sections: [],
        });
        setProcessing(false);
        return;
      }

      setProgress("Analyzing document structure...");
      const sentences = splitSentences(fullText);
      const allWords = tokenize(fullText);
      const wordCount = fullText.split(/\s+/).filter(Boolean).length;
      const readingTime = Math.ceil(wordCount / 250);

      setProgress("Computing keyword importance (TF-IDF)...");
      const tfidf = computeTFIDF(sentences, allWords);

      const keywordEntries = Array.from(tfidf.entries())
        .filter(([w]) => !STOP_WORDS.has(w) && w.length > 2)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15);

      const wordFreq = new Map<string, number>();
      for (const w of allWords) wordFreq.set(w, (wordFreq.get(w) || 0) + 1);

      const topKeywords = keywordEntries.map(([word, tfidfScore]) => ({
        word,
        count: wordFreq.get(word) || 0,
        tfidf: Math.round(tfidfScore * 1000) / 1000,
      }));

      setProgress("Running TextRank sentence extraction...");
      const topN = length === "brief" ? 5 : length === "detailed" ? 10 : 20;
      const keyPoints = textRankSentences(sentences, tfidf, topN);

      setProgress("Detecting document sections...");
      const rawSections = detectSections(fullText);
      const sectionSummaries = rawSections.slice(0, 8).map((sec) => {
        const secSentences = splitSentences(sec.body);
        if (secSentences.length === 0) return { heading: sec.heading, summary: sec.body.slice(0, 200) };
        const summary = textRankSentences(secSentences, tfidf, Math.min(2, secSentences.length));
        return { heading: sec.heading, summary: summary.join(" ") };
      });

      setResult({
        title: files[0].name.replace(/\.pdf$/i, ""),
        pageCount: doc.numPages,
        wordCount,
        sentenceCount: sentences.length,
        readingTime,
        keyPoints,
        topKeywords,
        sections: sectionSummaries,
      });
    } catch {
      alert("Error summarizing PDF. Please try again.");
    }
    setProcessing(false);
    setProgress("");
  };

  const formatSummaryText = (): string => {
    if (!result) return "";
    let text = `DOCUMENT SUMMARY: ${result.title}\n`;
    text += `${"=".repeat(50)}\n\n`;
    text += `Pages: ${result.pageCount} | Words: ${result.wordCount.toLocaleString()} | `;
    text += `Sentences: ${result.sentenceCount} | Reading Time: ~${result.readingTime} min\n\n`;
    text += `KEY POINTS\n${"-".repeat(30)}\n`;
    result.keyPoints.forEach((p, i) => { text += `${i + 1}. ${p}\n`; });
    text += `\nTOP KEYWORDS (by TF-IDF importance)\n${"-".repeat(30)}\n`;
    result.topKeywords.forEach((k) => { text += `  ${k.word} (${k.count}x, importance: ${k.tfidf})\n`; });
    if (result.sections.length > 0) {
      text += `\nSECTION SUMMARIES\n${"-".repeat(30)}\n`;
      result.sections.forEach((s) => { text += `\n[${s.heading}]\n${s.summary}\n`; });
    }
    return text;
  };

  return (
    <ToolPageLayout slug="ai-summarizer" title="AI Summarizer" description="Generate smart summaries of your PDF documents using NLP analysis." color="#16A085">
      <FileDropzone files={files} onFilesAdded={(f) => { setFiles(f.slice(0, 1)); setResult(null); }} onRemove={() => { setFiles([]); setResult(null); }} multiple={false} />
      {files.length > 0 && !result && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-2">Summary Length</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { id: "brief" as const, label: "Brief", desc: "5 key points" },
                { id: "detailed" as const, label: "Detailed", desc: "10 key points" },
                { id: "comprehensive" as const, label: "Full", desc: "20 key points" },
              ]).map((l) => (
                <button key={l.id} onClick={() => setLength(l.id)}
                  className={`py-2.5 rounded-xl border text-sm font-medium transition-all active:scale-95 ${length === l.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted hover:border-primary/50"}`}>
                  <span className="block">{l.label}</span>
                  <span className="block text-xs opacity-70">{l.desc}</span>
                </button>
              ))}
            </div>
          </div>
          <button onClick={handleSummarize} disabled={processing}
            className="w-full btn-primary-glass font-semibold py-3 rounded-2xl disabled:opacity-50">
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
                {progress}
              </span>
            ) : "Analyze & Summarize"}
          </button>
          <p className="text-xs text-muted text-center">Uses TF-IDF keyword extraction and TextRank algorithm for intelligent summarization.</p>
        </div>
      )}
      {result && (
        <div className="mt-6 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: "Pages", value: result.pageCount },
              { label: "Words", value: result.wordCount.toLocaleString() },
              { label: "Sentences", value: result.sentenceCount },
              { label: "Read Time", value: `${result.readingTime}m` },
            ].map((s) => (
              <div key={s.label} className="glass-card rounded-xl p-3 text-center">
                <div className="text-lg font-bold text-primary">{s.value}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Key Points */}
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-3">Key Points</h3>
            <ol className="space-y-2 text-sm">
              {result.keyPoints.map((point, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                  <span className="text-foreground/80">{point}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Keywords */}
          {result.topKeywords.length > 0 && (
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3">Top Keywords (TF-IDF)</h3>
              <div className="flex flex-wrap gap-2">
                {result.topKeywords.map((k) => (
                  <span key={k.word}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-xs font-medium text-primary">
                    {k.word}
                    <span className="text-muted text-[10px]">{k.count}x</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Section Summaries */}
          {result.sections.length > 1 && (
            <div className="glass-card rounded-xl p-4">
              <h3 className="font-semibold text-sm mb-3">Section Summaries</h3>
              <div className="space-y-3">
                {result.sections.map((sec, i) => (
                  <div key={i}>
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wide">{sec.heading}</h4>
                    <p className="text-sm text-foreground/80 mt-1">{sec.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <button onClick={() => saveAs(new Blob([formatSummaryText()], { type: "text/plain" }), `${result.title}_summary.txt`)}
              className="flex-1 btn-primary-glass font-semibold py-3 rounded-2xl">
              Download Summary
            </button>
            <button onClick={() => navigator.clipboard.writeText(formatSummaryText())}
              className="px-6 btn-glass font-semibold py-3 rounded-2xl">
              Copy
            </button>
          </div>
          <button onClick={() => setResult(null)}
            className="w-full text-sm text-muted hover:text-foreground transition-colors py-2">
            Analyze another document
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
