import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/seo";

export const metadata: Metadata = getToolMetadata("repair-pdf");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
