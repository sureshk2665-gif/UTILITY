import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI PDF Summarizer - Generate Smart Summaries | PDF Tools",
  description: "Generate concise AI-powered summaries of your PDF documents. Free online AI summarizer tool.",
  keywords: ["ai pdf summarizer", "summarize pdf", "pdf summary generator", "ai document summary", "pdf key points"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
