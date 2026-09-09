import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF to JPG — Convert PDF Pages to Images Free",
  description: "Convert PDF pages to high-quality JPG images. Free online PDF to image converter.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
