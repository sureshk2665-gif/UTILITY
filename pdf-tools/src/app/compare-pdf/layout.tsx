import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare PDF Online - Find Differences Between PDFs | PDF Tools",
  description: "Compare two PDF documents side by side and find differences. Free online PDF comparison tool.",
  keywords: ["compare pdf", "pdf diff", "pdf comparison", "find differences in pdf", "side by side pdf"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
