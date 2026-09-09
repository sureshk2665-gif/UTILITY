import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protect PDF Online - Encrypt with Password | PDF Tools",
  description: "Encrypt your PDF with a password to prevent unauthorized access. Free online PDF protection tool.",
  keywords: ["protect pdf", "encrypt pdf", "password protect pdf", "pdf security", "lock pdf"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
