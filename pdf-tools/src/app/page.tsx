import Link from "next/link";
import { tools } from "@/lib/tools";
import ToolGrid from "@/components/ToolGrid";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary to-primary-dark py-16 sm:py-24 px-4 text-center">
        <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4 max-w-3xl mx-auto leading-tight">
          Every tool you need to work with PDFs
        </h1>
        <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto mb-8">
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
                className="bg-white text-primary-dark font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-white/90 transition-colors"
              >
                {tool.name}
              </Link>
            ))}
        </div>
      </section>

      {/* Tool Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <ToolGrid />
      </section>

      {/* Features */}
      <section className="bg-surface-alt py-12 sm:py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            Why choose our PDF Tools?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "100% Free", desc: "All basic PDF tools are completely free to use with no hidden costs." },
              { title: "No Installation", desc: "Works entirely in your browser. No software to download or install." },
              { title: "Secure & Private", desc: "All files are processed securely and automatically deleted after 2 hours." },
              { title: "Works Everywhere", desc: "Use on any device — desktop, tablet, or mobile. Any browser, any OS." },
              { title: "Fast Processing", desc: "Optimized processing engine handles your files in seconds, not minutes." },
              { title: "No Registration", desc: "Start using tools immediately. No sign-up or account needed." },
            ].map((f) => (
              <div key={f.title} className="bg-surface border border-border rounded-xl p-6">
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ad placeholder */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-surface-alt border border-border rounded-lg h-24 flex items-center justify-center text-sm text-muted">
          Advertisement Space — Google AdSense
        </div>
      </section>
    </>
  );
}
