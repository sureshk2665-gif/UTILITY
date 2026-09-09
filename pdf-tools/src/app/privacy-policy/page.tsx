import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for PDF Tools Online. Learn how we handle your files and data.",
  alternates: { canonical: "https://pdf-tools-utility.vercel.app/privacy-policy" },
};

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-muted mb-6">Last updated: September 9, 2026</p>

      <div className="space-y-6 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">1. File Processing</h2>
          <p>All PDF processing happens entirely in your browser. Your files are never uploaded to our servers. We use client-side JavaScript libraries to handle all conversions, merges, splits, and edits locally on your device.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">2. Data Collection</h2>
          <p>We do not collect, store, or transmit any files you process. We may collect anonymous usage analytics (page views, tool usage counts) through standard analytics services to improve our tools.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">3. Cookies</h2>
          <p>We use essential cookies for site functionality and analytics cookies through Google Analytics and Google AdSense. You can disable cookies in your browser settings at any time.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">4. Third-Party Services</h2>
          <p>We use Google AdSense for advertising. Google may use cookies to serve ads based on your browsing history. Please refer to Google&apos;s privacy policy for more information.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">5. GDPR Compliance</h2>
          <p>Since all file processing is client-side, no personal document data is processed by our servers. For EU users, we comply with GDPR by minimizing data collection and providing transparency about any analytics we do use.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">6. Data Security</h2>
          <p>Your files never leave your device. All processing uses browser-native APIs and JavaScript libraries running locally. This means your documents remain private and secure at all times.</p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-foreground mb-2">7. Contact</h2>
          <p>If you have questions about this privacy policy, contact us at privacy@pdftools.online.</p>
        </section>
      </div>
    </div>
  );
}
