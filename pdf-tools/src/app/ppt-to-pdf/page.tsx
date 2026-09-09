"use client";

import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function PPTToPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const JSZip = (await import("jszip")).default;
      const zip = await JSZip.loadAsync(await files[0].arrayBuffer());

      const slides: string[] = [];
      let slideNum = 1;
      while (true) {
        const slideFile = zip.file(`ppt/slides/slide${slideNum}.xml`);
        if (!slideFile) break;
        const xml = await slideFile.async("text");
        const textMatches = xml.match(/<a:t>([^<]*)<\/a:t>/g) || [];
        const texts = textMatches.map((m) => m.replace(/<[^>]+>/g, ""));
        slides.push(texts.join("\n"));
        slideNum++;
      }

      if (slides.length === 0) throw new Error("No slides found");

      const doc = await PDFDocument.create();
      for (let i = 0; i < slides.length; i++) {
        const page = doc.addPage([960, 540]);
        page.drawRectangle({ x: 0, y: 0, width: 960, height: 540, color: rgb(1, 1, 1) });
        page.drawText(`Slide ${i + 1}`, { x: 40, y: 500, size: 10, color: rgb(0.5, 0.5, 0.5) });

        const lines = slides[i].split("\n").filter((l) => l.trim());
        let y = 460;
        for (const line of lines.slice(0, 20)) {
          const fontSize = y > 440 ? 24 : 14;
          page.drawText(line.slice(0, 80), { x: 40, y, size: fontSize, color: rgb(0.1, 0.1, 0.1) });
          y -= fontSize * 1.8;
          if (y < 40) break;
        }
      }

      const pdfBytes = await doc.save();
      const name = files[0].name.replace(/\.(pptx?)$/i, "");
      saveAs(new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }), `${name}.pdf`);
    } catch {
      alert("Error converting PowerPoint. Please ensure it's a valid .pptx file.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout title="PowerPoint to PDF" description="Convert PPT and PPTX slides to PDF." color="#3498DB">
      <FileDropzone files={files} onFilesAdded={(f) => setFiles(f.slice(0, 1))} onRemove={() => setFiles([])}
        multiple={false} accept={{ "application/vnd.openxmlformats-officedocument.presentationml.presentation": [".pptx"] }} />
      {files.length > 0 && (
        <div className="mt-6">
          <button onClick={handleConvert} disabled={processing}
            className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
            {processing ? "Converting..." : "Convert to PDF"}
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
