import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to PDF/A Online - Convert to Archive Format | PDF Tools",
  description: "Convert your PDF to ISO-standard PDF/A archive format for long-term preservation. Free online converter.",
  keywords: ["pdf to pdfa", "pdf/a converter", "archive pdf", "iso 19005", "long term pdf preservation"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
