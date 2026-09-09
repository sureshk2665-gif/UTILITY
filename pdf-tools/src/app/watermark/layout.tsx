import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Watermark to PDF — Free Online Tool",
  description: "Add custom text watermarks to your PDF files. Control opacity, size, and position.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
