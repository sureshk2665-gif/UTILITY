import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PDF Tools Online — Free PDF Editor, Converter & Compressor",
    template: "%s | PDF Tools Online",
  },
  description:
    "Free online PDF tools to merge, split, compress, convert, rotate, and edit PDF files. No installation, no registration required.",
  keywords: [
    "pdf tools",
    "merge pdf",
    "split pdf",
    "compress pdf",
    "pdf converter",
    "pdf editor online",
    "free pdf tools",
    "pdf to jpg",
    "jpg to pdf",
    "rotate pdf",
    "watermark pdf",
    "sign pdf",
    "redact pdf",
    "crop pdf",
    "organize pdf",
  ],
  metadataBase: new URL("https://pdf-tools-utility.vercel.app"),
  openGraph: {
    title: "PDF Tools Online — Free PDF Editor, Converter & Compressor",
    description: "Free online PDF tools to merge, split, compress, convert, rotate, and edit PDF files. No installation required.",
    url: "https://pdf-tools-utility.vercel.app",
    siteName: "PDF Tools Online",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF Tools Online — Free PDF Editor, Converter & Compressor",
    description: "Free online PDF tools to merge, split, compress, convert, rotate, and edit PDF files.",
  },
  alternates: {
    canonical: "https://pdf-tools-utility.vercel.app",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
