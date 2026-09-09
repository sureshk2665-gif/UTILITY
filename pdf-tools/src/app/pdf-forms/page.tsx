"use client";
import ComingSoonTool from "@/components/ComingSoonTool";

export default function PDFForms() {
  return (
    <ComingSoonTool
      title="PDF Forms"
      description="Create and fill interactive form fields in your PDF."
      color="#27AE60"
      features={[
        "Add text fields, checkboxes, and dropdowns",
        "Fill existing PDF forms",
        "Flatten form fields for sharing",
        "Export form data as JSON or CSV",
      ]}
    />
  );
}
