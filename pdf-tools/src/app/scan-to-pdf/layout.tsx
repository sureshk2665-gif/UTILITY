import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Scan to PDF Online - Camera Document Scanner | PDF Tools",
  description: "Scan documents using your camera and convert to PDF. Free online document scanner.",
  keywords: ["scan to pdf", "document scanner", "camera to pdf", "photo to pdf scan", "mobile document scanner"],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
