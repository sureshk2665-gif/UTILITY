import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Frequently Asked Questions",
  description: "Answers to common questions about our free online PDF tools. Learn about security, file limits, supported formats, and more.",
};

const faqs = [
  { q: "Is PDF Tools Online really free?", a: "Yes, all our basic PDF tools are completely free to use. There are no hidden charges, no trials, and no credit card required." },
  { q: "Are my files secure?", a: "Absolutely. All PDF processing happens directly in your browser. Your files never leave your device and are not uploaded to any server." },
  { q: "What is the maximum file size I can process?", a: "Since processing happens in your browser, the limit depends on your device's memory. Most modern devices handle files up to 100MB without issues." },
  { q: "Do I need to create an account?", a: "No. All tools work instantly without registration, sign-up, or login. Just upload your file and start working." },
  { q: "What PDF formats are supported?", a: "We support all standard PDF files (PDF 1.0 through 2.0). Password-protected PDFs may need to be unlocked first." },
  { q: "Can I use these tools on my phone?", a: "Yes. Our tools are fully responsive and work on any device — iPhone, Android, tablet, or desktop — in any modern browser." },
  { q: "How do I merge multiple PDF files?", a: "Go to the Merge PDF tool, drag and drop your files in the order you want, then click 'Merge PDFs'. Your combined PDF downloads instantly." },
  { q: "Can I compress a PDF without losing quality?", a: "Yes. Our Compress PDF tool reduces file size by optimizing internal structures while preserving visual quality." },
  { q: "What browsers are supported?", a: "All modern browsers are supported including Chrome, Firefox, Safari, Edge, and Opera. We recommend using the latest version for best performance." },
  { q: "Do you offer an API?", a: "We are developing a REST API for developers. Visit our API documentation page for updates and early access information." },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="bg-gradient-to-b from-primary to-primary-dark py-12 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Frequently Asked Questions</h1>
        <p className="text-white/80 text-base max-w-xl mx-auto">Everything you need to know about our free PDF tools.</p>
      </section>
      <section className="max-w-3xl mx-auto px-4 py-12">
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <details key={i} className="group bg-surface border border-border rounded-xl overflow-hidden">
              <summary className="cursor-pointer px-6 py-4 font-semibold text-sm sm:text-base flex items-center justify-between gap-4 hover:bg-surface-alt transition-colors">
                {f.q}
                <span className="text-muted group-open:rotate-45 transition-transform text-xl flex-shrink-0">+</span>
              </summary>
              <div className="px-6 pb-4 text-sm text-muted leading-relaxed">{f.a}</div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
