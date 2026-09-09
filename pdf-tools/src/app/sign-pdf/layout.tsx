import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign PDF Online - Draw & Place Signature on PDF | PDF Tools",
  description: "Draw your signature and place it on any page of your PDF document. Free online PDF signing tool with touch support.",
  keywords: ["sign pdf", "pdf signature", "electronic signature", "draw signature on pdf", "sign document online"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
