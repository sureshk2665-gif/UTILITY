import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Excel to PDF — Convert Spreadsheets Online",
  description: "Convert Excel spreadsheets to PDF documents online.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
