import type { Metadata } from "next";
import Link from "next/link";
import AdBanner from "@/components/ads/AdBanner";

export const metadata: Metadata = {
  title: "How to Merge PDF Files Online for Free — Complete Guide (2026)",
  description: "Step-by-step guide to combining multiple PDF documents into one file online. No software installation or registration needed. Works on any device.",
  keywords: ["merge pdf files", "combine pdf online free", "join pdf documents", "merge pdf without software", "pdf combiner free"],
  alternates: { canonical: "https://pdf-tools-utility.vercel.app/blog/merge-pdf-files-free-guide" },
};

export default function MergePdfGuide() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "How to Merge PDF Files Online for Free — Complete Guide",
    datePublished: "2026-09-03",
    dateModified: "2026-09-03",
    author: { "@type": "Organization", name: "PDF Tools Online" },
    publisher: { "@type": "Organization", name: "PDF Tools Online", url: "https://pdf-tools-utility.vercel.app" },
    description: metadata.description as string,
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold mb-3">How to Merge PDF Files Online for Free</h1>
        <div className="flex items-center gap-3 text-sm text-muted">
          <time dateTime="2026-09-03">September 3, 2026</time>
          <span>·</span>
          <span>4 min read</span>
        </div>
      </header>

      <div className="prose prose-lg max-w-none space-y-6 text-foreground/90">
        <p>
          Need to combine multiple PDF files into a single document? Whether you&apos;re merging invoices, reports, or scanned pages, our free online tool makes it simple — no software installation, no sign-up, and no file size limits.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Why Merge PDFs Online?</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>No software needed</strong> — works directly in your browser on any device</li>
          <li><strong>Preserve formatting</strong> — original layout, fonts, and images stay intact</li>
          <li><strong>Reorder pages</strong> — drag and drop to arrange files in any order before merging</li>
          <li><strong>100% private</strong> — files are processed locally in your browser, never uploaded to a server</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">How to Merge PDF Files: Step by Step</h2>

        <h3 className="text-xl font-semibold mt-6 mb-2">Step 1: Upload Your PDF Files</h3>
        <p>
          Go to our <Link href="/merge-pdf" className="text-primary underline">Merge PDF tool</Link> and drag and drop your files into the upload area, or click to browse. You can select multiple files at once.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">Step 2: Arrange the Order</h3>
        <p>
          Once uploaded, your files appear as thumbnails. Drag them to reorder as needed. The final merged PDF will follow this sequence from top to bottom.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2">Step 3: Merge and Download</h3>
        <p>
          Click the &quot;Merge PDFs&quot; button. Processing happens instantly in your browser. Your combined PDF downloads automatically — no waiting, no email required.
        </p>

        <h2 className="text-2xl font-bold mt-10 mb-4">Common Use Cases</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Business reports</strong> — combine cover page, charts, and appendices into one document</li>
          <li><strong>Invoices and receipts</strong> — merge monthly invoices for bookkeeping or tax filing</li>
          <li><strong>Academic papers</strong> — join research sections, bibliography, and appendix</li>
          <li><strong>Scanned documents</strong> — combine multi-page scans into a single PDF</li>
          <li><strong>Job applications</strong> — merge resume, cover letter, and certificates</li>
        </ul>

        <h2 className="text-2xl font-bold mt-10 mb-4">Tips for Best Results</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Check page orientation</strong> — make sure all pages have the correct rotation before merging. Use our <Link href="/rotate-pdf" className="text-primary underline">Rotate PDF</Link> tool if needed.</li>
          <li><strong>Remove unwanted pages</strong> — use <Link href="/split-pdf" className="text-primary underline">Split PDF</Link> to extract only the pages you need before combining.</li>
          <li><strong>Compress after merging</strong> — large merged files can be reduced with our <Link href="/compress-pdf" className="text-primary underline">Compress PDF</Link> tool.</li>
          <li><strong>Add page numbers</strong> — after merging, use <Link href="/add-page-numbers" className="text-primary underline">Add Page Numbers</Link> for a professional touch.</li>
        </ol>

        <h2 className="text-2xl font-bold mt-10 mb-4">Frequently Asked Questions</h2>

        <h3 className="text-lg font-semibold mt-4 mb-1">Is there a file size limit?</h3>
        <p>No. Since processing happens in your browser, there&apos;s no server-side file size restriction. Very large files depend on your device&apos;s available memory.</p>

        <h3 className="text-lg font-semibold mt-4 mb-1">Can I merge more than two PDFs?</h3>
        <p>Yes — you can merge as many PDF files as you need in a single operation.</p>

        <h3 className="text-lg font-semibold mt-4 mb-1">Are my files secure?</h3>
        <p>Absolutely. Your files never leave your device. All processing is done client-side using JavaScript. We don&apos;t store, upload, or access your documents. Read our <Link href="/privacy-policy" className="text-primary underline">privacy policy</Link> for details.</p>

        <div className="mt-12 p-6 bg-primary/10 rounded-xl text-center">
          <h2 className="text-xl font-bold mb-2">Ready to Merge Your PDFs?</h2>
          <p className="text-muted mb-4">Free, fast, and secure. No registration needed.</p>
          <Link href="/merge-pdf" className="inline-block btn-primary-glass font-semibold px-6 py-3 rounded-2xl">
            Merge PDF Files Now →
          </Link>
        </div>
      </div>
      <div className="mt-10">
        <AdBanner position="leaderboard-footer" />
      </div>
    </article>
  );
}
