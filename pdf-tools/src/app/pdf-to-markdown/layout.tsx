import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/seo";

export const metadata: Metadata = getToolMetadata("pdf-to-markdown");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
