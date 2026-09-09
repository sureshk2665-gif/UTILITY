"use client";
import ComingSoonTool from "@/components/ComingSoonTool";

export default function RepairPDF() {
  return (
    <ComingSoonTool
      title="Repair PDF"
      description="Fix damaged or corrupted PDF files and recover content."
      color="#E67E22"
      features={[
        "Fix corrupted or damaged PDF files",
        "Recover text, images, and formatting",
        "Repair broken internal structure",
        "Preview repaired document before download",
      ]}
    />
  );
}
