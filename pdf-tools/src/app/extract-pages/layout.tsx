import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Extract PDF Pages — Pull Pages Into New PDF",
  description: "Extract selected pages from a PDF into a new file. Free online tool.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
