"use client";
import ComingSoonTool from "@/components/ComingSoonTool";

export default function ScanToPDF() {
  return (
    <ComingSoonTool
      title="Scan to PDF"
      description="Capture document scans from your camera and convert to PDF."
      color="#E67E22"
      features={[
        "Use phone or webcam to scan documents",
        "Auto-detect document edges",
        "Enhance scan quality automatically",
        "Combine multiple scans into one PDF",
      ]}
    />
  );
}
