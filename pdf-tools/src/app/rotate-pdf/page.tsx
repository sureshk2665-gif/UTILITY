"use client";

import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { saveAs } from "file-saver";
import ToolPageLayout from "@/components/ToolPageLayout";
import FileDropzone from "@/components/FileDropzone";

export default function RotatePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [rotation, setRotation] = useState(90);
  const [processing, setProcessing] = useState(false);

  const handleRotate = async () => {
    if (!files[0]) return;
    setProcessing(true);
    try {
      const bytes = await files[0].arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      doc.getPages().forEach((page) => {
        page.setRotation(degrees((page.getRotation().angle + rotation) % 360));
      });
      const result = await doc.save();
      saveAs(new Blob([result.buffer as ArrayBuffer], { type: "application/pdf" }), "rotated.pdf");
    } catch {
      alert("Error rotating PDF. Please try again.");
    }
    setProcessing(false);
  };

  return (
    <ToolPageLayout
      slug="rotate-pdf"
      title="Rotate PDF"
      description="Rotate all pages of your PDF by 90°, 180°, or 270°."
      color="#E74C3C"
    >
      <FileDropzone
        files={files}
        onFilesAdded={(f) => setFiles([f[0]])}
        onRemove={() => setFiles([])}
        multiple={false}
      />
      {files.length > 0 && (
        <>
          <div className="mt-6">
            <p className="text-sm font-medium mb-3">Rotation angle:</p>
            <div className="flex gap-3">
              {[90, 180, 270].map((deg) => (
                <button
                  key={deg}
                  onClick={() => setRotation(deg)}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold border transition-colors ${
                    rotation === deg
                      ? "bg-primary text-white border-primary"
                      : "bg-surface-alt border-border hover:border-primary/50"
                  }`}
                >
                  {deg}°
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleRotate}
            disabled={processing}
            className="mt-6 w-full btn-primary-glass font-semibold py-3 rounded-2xl disabled:opacity-50"
          >
            {processing ? "Rotating..." : "Rotate PDF"}
          </button>
        </>
      )}
    </ToolPageLayout>
  );
}
