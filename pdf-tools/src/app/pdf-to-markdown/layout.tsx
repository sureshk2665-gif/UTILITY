import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Markdown Online - Convert PDF to MD | PDF Tools",
  description: "Convert PDF documents to Markdown format for notes and documentation. Free online PDF to Markdown converter.",
  keywords: ["pdf to markdown", "convert pdf to md", "pdf markdown converter", "pdf to text format", "pdf documentation"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
