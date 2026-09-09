"use client";
import ComingSoonTool from "@/components/ComingSoonTool";

export default function UnlockPDF() {
  return (
    <ComingSoonTool
      title="Unlock PDF"
      description="Remove password protection from your PDF documents."
      color="#8E44AD"
      features={[
        "Remove open password (password required)",
        "Remove permissions restrictions",
        "Batch unlock multiple PDFs",
        "Preserve original document quality",
      ]}
    />
  );
}
