"use client";

import { useState } from "react";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function ExcelToPDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const XLSX = await import("xlsx");
      const bytes = await files[0].arrayBuffer();
      const workbook = XLSX.read(bytes, { type: "array" });

      const doc = await PDFDocument.create();
      const fontSize = 9;
      const margin = 40;
      const lineHeight = fontSize * 1.6;
      const colWidth = 100;

      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        const data: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        if (data.length === 0) continue;

        const maxCols = Math.min(Math.max(...data.map((r) => r.length)), 6);
        const pageWidth = margin * 2 + maxCols * colWidth;

        let page = doc.addPage([Math.max(pageWidth, 612), 792]);
        let y = 792 - margin;

        page.drawText(`Sheet: ${sheetName}`, { x: margin, y, size: 12, color: rgb(0.2, 0.2, 0.2) });
        y -= lineHeight * 2;

        for (const row of data) {
          if (y < margin + lineHeight) {
            page = doc.addPage([Math.max(pageWidth, 612), 792]);
            y = 792 - margin;
          }
          for (let c = 0; c < Math.min(row.length, maxCols); c++) {
            const cellText = String(row[c] ?? "").slice(0, 20);
            page.drawText(cellText, {
              x: margin + c * colWidth,
              y,
              size: fontSize,
              color: rgb(0, 0, 0),
            });
          }
          y -= lineHeight;
        }
      }

      const pdfBytes = await doc.save();
      const name = files[0].name.replace(/\.(xlsx?|csv)$/i, "");
      saveAs(new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" }), `${name}.pdf`);
    } catch {
      alert("Error converting spreadsheet. Please ensure it's a valid Excel file.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout slug="excel-to-pdf" title="Excel to PDF" description="Convert XLSX spreadsheets to PDF." color="#3498DB">
      <FileDropzone files={files} onFilesAdded={(f) => setFiles(f.slice(0, 1))} onRemove={() => setFiles([])}
        multiple={false} accept={{ "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"], "application/vnd.ms-excel": [".xls"], "text/csv": [".csv"] }} />
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
