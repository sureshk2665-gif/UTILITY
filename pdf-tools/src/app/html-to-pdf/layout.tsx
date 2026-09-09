import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HTML to PDF — Convert Webpages to PDF",
  description: "Convert any webpage to PDF by URL. Full page capture with CSS rendering.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
