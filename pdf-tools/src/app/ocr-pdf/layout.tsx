import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OCR PDF Online - Extract Text from Scanned Documents | PDF Tools",
  description: "Extract text from scanned PDF documents using AI-powered optical character recognition. Free online OCR tool.",
  keywords: ["ocr pdf", "extract text from pdf", "scanned pdf to text", "optical character recognition", "pdf text extraction"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
