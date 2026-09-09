import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organize PDF Online - Reorder & Remove Pages | PDF Tools",
  description: "Reorder, duplicate, or remove pages from your PDF. Free online PDF page organizer tool.",
  keywords: ["organize pdf", "reorder pdf pages", "rearrange pdf", "sort pdf pages", "pdf page order"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
