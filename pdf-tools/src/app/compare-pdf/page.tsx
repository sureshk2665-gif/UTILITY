"use client";
import ComingSoonTool from "@/components/ComingSoonTool";

export default function ComparePDF() {
  return (
    <ComingSoonTool
      title="Compare PDF"
      description="Side-by-side comparison of two PDF documents to find differences."
      color="#E67E22"
      features={[
        "Visual side-by-side comparison",
        "Highlight text differences",
        "Page-by-page change detection",
        "Export comparison report",
      ]}
    />
  );
}
