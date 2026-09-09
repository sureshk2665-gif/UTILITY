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
      {/* Hero */}
      <div className="relative overflow-hidden py-10 sm:py-14 text-center px-4">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 tracking-tight">
            {title}
          </h1>
          <p className="text-white/75 text-sm sm:text-base max-w-xl mx-auto">
            {description}
          </p>
          <p className="text-white/50 text-xs mt-3 font-medium">Free — No registration required</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10 pb-16">
        <div className="glass-strong rounded-2xl shadow-lg p-5 sm:p-8">
          {children}
          <TrustSignals />
        </div>

        {/* Ad below tool card — away from file input area per AdSense policy */}
        <div className="mt-8">
          <AdBanner position="sidebar-tool" />
        </div>
      </div>
    </div>
  );
}
