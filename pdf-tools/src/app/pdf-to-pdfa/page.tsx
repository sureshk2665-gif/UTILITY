"use client";
import ComingSoonTool from "@/components/ComingSoonTool";

export default function PDFtoPDFA() {
  return (
    <ComingSoonTool
      title="PDF to PDF/A"
      description="Convert your PDF to ISO-standard archive format for long-term preservation."
      color="#3498DB"
      features={[
        "Convert to PDF/A-1b, PDF/A-2b, PDF/A-3b",
        "ISO 19005 compliant archival format",
        "Embed all fonts and color profiles",
        "Validate compliance after conversion",
      ]}
    />
  );
}
