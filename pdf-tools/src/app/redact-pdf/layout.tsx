import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/seo";

export const metadata: Metadata = getToolMetadata("redact-pdf");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
