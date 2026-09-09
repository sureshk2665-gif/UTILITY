import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Page Counter — Count Pages in PDF Online Free",
  description: "Instantly count the number of pages in any PDF file. Check file size too. Free online PDF page counter — no signup needed.",
  keywords: ["pdf page counter", "count pages in pdf", "how many pages in pdf", "pdf page count online"],
  alternates: { canonical: "https://pdf-tools-utility.vercel.app/pdf-page-counter" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
