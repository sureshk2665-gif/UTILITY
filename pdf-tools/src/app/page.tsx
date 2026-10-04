import Link from "next/link";
import { tools } from "@/lib/tools";
import ToolGrid from "@/components/ToolGrid";
import AdBanner from "@/components/ads/AdBanner";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "PDF Tools Online",
  url: "https://pdf-tools-utility.vercel.app",
  description: "Free online PDF tools to merge, split, compress, convert, rotate, and edit PDF files.",
  applicationCategory: "Utility",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: tools.filter((t) => t.available).map((t) => t.name),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero */}
      <section className="py-16 sm:py-24 px-4 text-center bg-surface-alt border-b border-border">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-tight tracking-tight">
            Every tool you need to<br />
            <span className="text-primary">work with PDFs</span>
          </h1>
          <p className="text-muted text-base sm:text-lg max-w-2xl mx-auto mb-10">
            Merge, split, compress, convert, rotate, and edit PDF files with ease.
            All tools are free, online, and require no installation.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {tools
              .filter((t) => t.available)
              .slice(0, 4)
              .map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="bg-white text-foreground font-medium px-6 py-3 rounded-xl text-sm border border-border hover:border-primary hover:text-primary hover:shadow-md transition-all"
                >
                  {tool.name}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Tool Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">All PDF Tools</h2>
        <p className="text-muted text-center mb-10 max-w-xl mx-auto">
          Select a tool below to get started. All tools process files directly in your browser.
        </p>
        <ToolGrid />
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 px-4 bg-surface-alt border-t border-b border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            Why choose PDF Tools?
          </h2>
          <p className="text-muted text-center mb-10">Trusted by thousands of users worldwide</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "100% Free", desc: "All basic PDF tools are completely free to use with no hidden costs.", color: "#34C759" },
              { title: "No Installation", desc: "Works entirely in your browser. No software to download or install.", color: "#007AFF" },
              { title: "Secure & Private", desc: "All files are processed locally in your browser. Nothing is uploaded.", color: "#AF52DE" },
              { title: "Works Everywhere", desc: "Use on any device — desktop, tablet, or mobile. Any browser, any OS.", color: "#FF9500" },
              { title: "Fast Processing", desc: "Optimized processing engine handles your files in seconds, not minutes.", color: "#E74C3C" },
              { title: "No Registration", desc: "Start using tools immediately. No sign-up or account needed.", color: "#00C7BE" },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-border">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${f.color}15` }}>
                  <div className="w-3 h-3 rounded-full" style={{ background: f.color }} />
                </div>
                <h3 className="font-semibold text-base mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard Ad above footer */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <AdBanner position="leaderboard-footer" />
      </section>
    </>
  );
}
