"use client";

import { useState } from "react";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function PDFToExcel() {
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
      const XLSX = await import("xlsx");
      const workbook = XLSX.utils.book_new();

      for (let i = 1; i <= doc.numPages; i++) {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();

        const rows: string[][] = [];
        let lastY: number | null = null;
        let currentRow: string[] = [];

        for (const item of content.items) {
          if (!("str" in item)) continue;
          const y = Math.round((item as { transform: number[] }).transform[5]);
          if (lastY !== null && Math.abs(y - lastY) > 3) {
            if (currentRow.length) rows.push(currentRow);
            currentRow = [];
          }
          const text = (item as { str: string }).str.trim();
          if (text) currentRow.push(text);
          lastY = y;
        }
        if (currentRow.length) rows.push(currentRow);

        const sheet = XLSX.utils.aoa_to_sheet(rows);
        XLSX.utils.book_append_sheet(workbook, sheet, `Page ${i}`);
      }

      const xlsxData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const name = files[0].name.replace(/\.pdf$/i, "");
      saveAs(new Blob([xlsxData], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${name}.xlsx`);
    } catch {
      alert("Error converting PDF. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout slug="pdf-to-excel" title="PDF to Excel" description="Extract PDF tables into XLSX spreadsheets." color="#3498DB">
      <FileDropzone files={files} onFilesAdded={(f) => setFiles(f.slice(0, 1))} onRemove={() => setFiles([])} multiple={false} />
      {files.length > 0 && (
        <div className="mt-6">
          <button onClick={handleConvert} disabled={processing}
            className="w-full btn-primary-glass font-semibold py-3 rounded-2xl disabled:opacity-50">
            {processing ? "Converting..." : "Convert to Excel"}
          </button>
        </div>
      )}
    </ToolPageLayout>
  );
}
