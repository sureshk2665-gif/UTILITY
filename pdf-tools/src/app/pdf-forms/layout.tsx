import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Forms Online - Create & Fill Form Fields | PDF Tools",
  description: "Create and fill interactive form fields in your PDF. Free online PDF forms tool.",
  keywords: ["pdf forms", "fill pdf form", "create pdf form", "interactive pdf", "pdf form fields"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
