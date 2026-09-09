import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Documentation - PDF Tools Developer API",
  description: "Integrate PDF processing into your applications with our REST API. Merge, split, compress, convert, and edit PDFs programmatically.",
};

const endpoints = [
  { method: "POST", path: "/api/v1/merge", desc: "Merge multiple PDFs into one" },
  { method: "POST", path: "/api/v1/split", desc: "Split PDF into individual pages" },
  { method: "POST", path: "/api/v1/compress", desc: "Compress and optimize PDF" },
  { method: "POST", path: "/api/v1/convert/jpg", desc: "Convert PDF pages to JPG" },
  { method: "POST", path: "/api/v1/convert/pdf", desc: "Convert images/docs to PDF" },
  { method: "POST", path: "/api/v1/rotate", desc: "Rotate PDF pages" },
  { method: "POST", path: "/api/v1/watermark", desc: "Add text watermark to PDF" },
  { method: "POST", path: "/api/v1/ocr", desc: "Extract text via OCR" },
];

export default function APIDocsPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-primary to-primary-dark py-12 px-4 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">PDF Tools API</h1>
        <p className="text-white/80 text-base max-w-xl mx-auto">Integrate PDF processing into your apps with our REST API.</p>
      </section>
      <section className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="bg-accent-orange/10 border border-accent-orange/30 rounded-xl p-5 text-center">
          <h2 className="font-bold text-lg mb-1">Coming Soon — Early Access</h2>
          <p className="text-sm text-muted">Our API is under active development. Enter your email below to get early access.</p>
          <div className="mt-4 flex gap-2 max-w-md mx-auto">
            <input type="email" placeholder="your@email.com"
              className="flex-1 border border-border rounded-lg px-4 py-2 text-sm bg-surface focus:outline-none focus:border-primary" />
            <button className="btn-primary-glass font-semibold px-5 py-2 rounded-2xl text-sm">
              Notify Me
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Planned Endpoints</h2>
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-alt border-b border-border">
                  <th className="text-left px-4 py-3 font-semibold">Method</th>
                  <th className="text-left px-4 py-3 font-semibold">Endpoint</th>
                  <th className="text-left px-4 py-3 font-semibold hidden sm:table-cell">Description</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((ep, i) => (
                  <tr key={i} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5">
                      <span className="bg-accent-green/15 text-accent-green font-mono text-xs px-2 py-0.5 rounded">{ep.method}</span>
                    </td>
                    <td className="px-4 py-2.5 font-mono text-xs">{ep.path}</td>
                    <td className="px-4 py-2.5 text-muted hidden sm:table-cell">{ep.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4">Example Request</h2>
          <div className="bg-[#1e1e2e] text-[#cdd6f4] rounded-xl p-5 overflow-x-auto">
            <pre className="text-sm font-mono leading-relaxed whitespace-pre">{`curl -X POST https://api.pdftools.dev/v1/merge \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "files[]=@document1.pdf" \\
  -F "files[]=@document2.pdf" \\
  -o merged.pdf`}</pre>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: "Free Tier", value: "100 requests/month", desc: "Perfect for personal projects" },
            { title: "Pro Tier", value: "10,000 requests/month", desc: "For growing applications" },
            { title: "Enterprise", value: "Unlimited", desc: "Custom volume and SLA" },
          ].map((tier) => (
            <div key={tier.title} className="bg-surface border border-border rounded-xl p-5 text-center">
              <h3 className="font-bold mb-1">{tier.title}</h3>
              <p className="text-primary font-bold text-lg">{tier.value}</p>
              <p className="text-xs text-muted mt-1">{tier.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
