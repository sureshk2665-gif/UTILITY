import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit PDF Online — Add Text & Annotations Free",
  description: "Edit PDF files online. Add text annotations with custom font size and color.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
