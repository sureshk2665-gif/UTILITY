import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Word to PDF — Convert DOCX to PDF Online",
  description: "Convert Word documents to PDF format. Perfect formatting preservation.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
