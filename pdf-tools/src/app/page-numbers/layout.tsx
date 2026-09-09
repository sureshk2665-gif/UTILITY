import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Page Numbers to PDF — Free Online",
  description: "Add page numbers to PDF with custom position and starting number. Free online tool.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
