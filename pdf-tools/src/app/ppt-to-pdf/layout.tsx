import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PowerPoint to PDF — Convert PPTX to PDF",
  description: "Convert PowerPoint slides to PDF format. High-quality rendering.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
