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
      <section className="relative overflow-hidden py-20 sm:py-28 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#0066DD] to-[#004AAA]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(90,200,250,0.3),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(175,82,222,0.15),transparent_60%)]" />
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 max-w-3xl mx-auto leading-tight tracking-tight">
            Every tool you need to work with PDFs
          </h1>
          <p className="text-white/75 text-base sm:text-lg max-w-2xl mx-auto mb-10">
            Merge, split, compress, convert, rotate, and edit PDF files.
            Free, online, no installation required.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {tools
              .filter((t) => t.available)
              .slice(0, 4)
              .map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/${tool.slug}`}
                  className="bg-white/15 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-2xl text-sm border border-white/20 hover:bg-white/25 hover:border-white/35 transition-all active:scale-95 shadow-sm"
                >
                  {tool.name}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Tool Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <ToolGrid />
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            Why choose our PDF Tools?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "100% Free", desc: "All basic PDF tools are completely free to use with no hidden costs.", icon: "✦" },
              { title: "No Installation", desc: "Works entirely in your browser. No software to download or install.", icon: "◎" },
              { title: "Secure & Private", desc: "All files are processed securely and automatically deleted after 2 hours.", icon: "◈" },
              { title: "Works Everywhere", desc: "Use on any device — desktop, tablet, or mobile. Any browser, any OS.", icon: "▣" },
              { title: "Fast Processing", desc: "Optimized processing engine handles your files in seconds, not minutes.", icon: "⚡" },
              { title: "No Registration", desc: "Start using tools immediately. No sign-up or account needed.", icon: "→" },
            ].map((f) => (
              <div key={f.title} className="glass-card rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-lg mb-3">
                  {f.icon}
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
