"use client";
import ComingSoonTool from "@/components/ComingSoonTool";

export default function AISummarizer() {
  return (
    <ComingSoonTool
      title="AI Summarizer"
      description="Generate concise AI-powered summaries of your PDF documents."
      color="#16A085"
      features={[
        "AI-powered document summarization",
        "Adjustable summary length (brief, detailed)",
        "Key points and highlights extraction",
        "Support for multi-page documents",
      ]}
    />
  );
}
