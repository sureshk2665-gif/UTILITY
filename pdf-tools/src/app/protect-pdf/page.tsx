"use client";
import ComingSoonTool from "@/components/ComingSoonTool";

export default function ProtectPDF() {
  return (
    <ComingSoonTool
      title="Protect PDF"
      description="Encrypt your PDF with a password to prevent unauthorized access."
      color="#8E44AD"
      features={[
        "Set open password for viewing",
        "Set permissions password for editing",
        "Choose encryption strength (128-bit / 256-bit)",
        "Restrict printing, copying, and editing",
      ]}
    />
  );
}
