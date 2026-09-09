import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to Excel — Extract Tables to XLSX Free",
  description: "Extract tables from PDF to Excel spreadsheets. Smart table detection.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
