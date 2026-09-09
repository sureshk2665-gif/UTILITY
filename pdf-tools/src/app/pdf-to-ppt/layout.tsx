import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/seo";

export const metadata: Metadata = getToolMetadata("pdf-to-ppt");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
