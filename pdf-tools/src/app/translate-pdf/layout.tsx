import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Translate PDF Online - AI Document Translation | PDF Tools",
  description: "Translate your PDF documents to 50+ languages using AI. Free online PDF translation tool.",
  keywords: ["translate pdf", "pdf translator", "document translation", "ai translate pdf", "multilingual pdf"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
