"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

interface FormField {
  name: string;
  type: string;
  value: string;
}

export default function PDFForms() {
  const [files, setFiles] = useState<File[]>([]);
  const [fields, setFields] = useState<FormField[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFilesAdded = async (newFiles: File[]) => {
    const file = newFiles[0];
    if (!file) return;
    setFiles([file]);
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const form = doc.getForm();
      const allFields = form.getFields();
      setFields(
        allFields.map((f) => ({
          name: f.getName(),
          type: f.constructor.name.replace("PDF", "").replace("Field", ""),
          value: "",
        }))
      );
    } catch {
      setFields([]);
    }
  };

  const updateField = (idx: number, value: string) => {
    setFields((prev) => prev.map((f, i) => (i === idx ? { ...f, value } : f)));
  };

  const handleFill = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const form = doc.getForm();

      for (const field of fields) {
        if (!field.value) continue;
        try {
          const pdfField = form.getField(field.name);
          if ("setText" in pdfField) {
            (pdfField as { setText: (t: string) => void }).setText(field.value);
          }
        } catch { /* skip unsupported field types */ }
      }

      form.flatten();
      const result = await doc.save();
      saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), "filled-form.pdf");
    } catch {
      alert("Error filling PDF form. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout slug="pdf-forms" title="PDF Forms" description="Fill interactive form fields in your PDF." color="#27AE60">
      <FileDropzone files={files} onFilesAdded={handleFilesAdded} onRemove={() => { setFiles([]); setFields([]); }} multiple={false} />
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          {fields.length === 0 ? (
            <div className="bg-surface-alt border border-border rounded-xl p-5 text-center text-sm text-muted">
              No fillable form fields detected in this PDF.
            </div>
          ) : (
            <>
              <p className="text-sm font-medium">{fields.length} form field(s) found</p>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {fields.map((f, i) => (
                  <div key={i} className="bg-surface border border-border rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">{f.type}</span>
                      <span className="text-sm font-medium truncate">{f.name}</span>
                    </div>
                    <input type="text" value={f.value} onChange={(e) => updateField(i, e.target.value)}
                      placeholder={`Enter value for ${f.name}`}
                      className="w-full border border-border rounded-lg px-3 py-1.5 bg-surface text-sm focus:outline-none focus:border-primary" />
                  </div>
                ))}
              </div>
              <button onClick={handleFill} disabled={processing}
                className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50">
                {processing ? "Filling..." : "Fill & Download PDF"}
              </button>
            </>
          )}
        </div>
      )}
    </ToolPageLayout>
  );
}
