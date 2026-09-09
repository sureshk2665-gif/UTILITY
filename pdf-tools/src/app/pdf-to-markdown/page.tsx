"use client";
import ComingSoonTool from "@/components/ComingSoonTool";

export default function PDFtoMarkdown() {
  return (
    <ComingSoonTool
      title="PDF to Markdown"
      description="Convert PDF documents to Markdown format for notes and documentation."
      color="#3498DB"
      features={[
        "Extract text with Markdown formatting",
        "Preserve headings, lists, and tables",
        "Support for complex document layouts",
        "Copy or download as .md file",
      ]}
    />
  );
}
