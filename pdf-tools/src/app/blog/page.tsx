import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "PDF Tools Blog — Tips, Guides & How-Tos",
  description: "Learn how to work with PDFs effectively. Guides on compressing, converting, merging, and editing PDF files online for free.",
  alternates: { canonical: "https://pdf-tools-utility.vercel.app/blog" },
};

const posts = [
  {
    slug: "how-to-compress-pdf-without-losing-quality",
    title: "How to Compress PDF Without Losing Quality (2026 Guide)",
    excerpt: "Learn 5 proven methods to reduce PDF file size while maintaining visual quality. Perfect for email attachments and web uploads.",
    date: "September 5, 2026",
    readTime: "5 min read",
  },
  {
    slug: "merge-pdf-files-free-guide",
    title: "How to Merge PDF Files Online for Free — Complete Guide",
    excerpt: "Step-by-step guide to combining multiple PDF documents into one file. No software installation needed.",
    date: "September 3, 2026",
    readTime: "4 min read",
  },
  {
    slug: "pdf-to-word-conversion-tips",
    title: "PDF to Word Conversion: Tips for Perfect Formatting",
    excerpt: "Get the best results when converting PDF documents to editable Word files. Avoid common formatting pitfalls.",
    date: "September 1, 2026",
    readTime: "6 min read",
  },
  {
    slug: "best-free-pdf-tools-2026",
    title: "10 Best Free Online PDF Tools in 2026 — Compared",
    excerpt: "A comprehensive comparison of the top free PDF tools including iLovePDF, SmallPDF, Adobe Acrobat Online, and PDF Tools Online.",
    date: "August 28, 2026",
    readTime: "8 min read",
  },
];

export default function Blog() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">PDF Tools Blog</h1>
      <p className="text-muted mb-10">Tips, guides, and how-tos for working with PDF files.</p>

      <div className="space-y-6">
        {posts.map((post, i) => (
          <div key={post.slug}>
            <article className="glass-card rounded-2xl p-6">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-bold mb-2 hover:text-primary transition-colors">{post.title}</h2>
              </Link>
              <p className="text-sm text-muted mb-3">{post.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-muted">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </article>
            {/* In-feed ad after 2nd post */}
            {i === 1 && <AdBanner position="in-feed-blog" />}
          </div>
        ))}
      </div>

      {/* Leaderboard ad at bottom */}
      <div className="mt-10">
        <AdBanner position="leaderboard-footer" />
      </div>
    </div>
  );
}
