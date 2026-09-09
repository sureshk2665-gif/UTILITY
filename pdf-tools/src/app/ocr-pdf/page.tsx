"use client";
import ComingSoonTool from "@/components/ComingSoonTool";

export default function OCRPDF() {
  return (
    <ComingSoonTool
      title="OCR PDF"
      description="Extract text from scanned documents using optical character recognition."
      color="#16A085"
      features={[
        "Recognize text in scanned PDFs and images",
        "Support for 100+ languages",
        "Preserve original layout and formatting",
        "Export as searchable PDF or plain text",
      ]}
    />
  );
}
