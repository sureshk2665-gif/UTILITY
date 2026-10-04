"use client";

import { ReactNode } from "react";
import TrustSignals from "./TrustSignals";
import { ToolJsonLd } from "./ToolJsonLd";
import AdBanner from "./ads/AdBanner";

interface ToolPageLayoutProps {
  title: string;
  description: string;
  color: string;
  slug?: string;
  children: ReactNode;
}

export default function ToolPageLayout({
  title,
  description,
  color,
  slug,
  children,
}: ToolPageLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {slug && <ToolJsonLd slug={slug} />}
      <div className="py-10 sm:py-14 text-center px-4" style={{ background: color }}>
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
          {title}
        </h1>
        <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto">
          {description}
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-6 relative z-10 pb-16">
        <div className="bg-white rounded-2xl shadow-lg border border-border p-5 sm:p-8">
          {children}
          <TrustSignals />
        </div>

        <div className="mt-8">
          <AdBanner position="sidebar-tool" />
        </div>
      </div>
    </div>
  );
}
