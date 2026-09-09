import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Redact PDF Online - Remove Sensitive Content | PDF Tools",
  description: "Permanently cover sensitive content in your PDF with black rectangles. Free online PDF redaction tool.",
  keywords: ["redact pdf", "pdf redaction", "remove sensitive content", "black out pdf", "censor pdf"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
