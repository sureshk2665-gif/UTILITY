import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for PDF Tools Online.",
  alternates: { canonical: "https://pdf-tools-utility.vercel.app/terms" },
};

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      <p className="text-sm text-muted mb-6">Last updated: September 9, 2026</p>

      <div className="space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. Service Description</h2>
          <p>PDF Tools Online provides free browser-based PDF manipulation tools. All processing occurs client-side in your browser — no files are uploaded to our servers.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Acceptable Use</h2>
          <p>You agree to use our tools only for lawful purposes. You are responsible for ensuring you have the right to process any documents you use with our tools.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. No Warranty</h2>
          <p>Our tools are provided &quot;as is&quot; without warranty of any kind. While we strive for accuracy and reliability, we cannot guarantee that conversions will be perfect in all cases.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Limitation of Liability</h2>
          <p>PDF Tools Online shall not be liable for any damages arising from the use of our tools, including but not limited to data loss, file corruption, or inaccurate conversions.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. Intellectual Property</h2>
          <p>The tools, interface, and code of PDF Tools Online are protected by copyright. You may not copy, modify, or distribute our tools without permission.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Changes to Terms</h2>
          <p>We may update these terms at any time. Continued use of the site constitutes acceptance of the updated terms.</p>
        </section>
      </div>
    </div>
  );
}
