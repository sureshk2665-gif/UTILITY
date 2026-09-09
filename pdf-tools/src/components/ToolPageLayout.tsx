"use client";

import { ReactNode } from "react";
import TrustSignals from "./TrustSignals";

interface ToolPageLayoutProps {
  title: string;
  description: string;
  color: string;
  children: ReactNode;
}

export default function ToolPageLayout({
  title,
  description,
  color,
  children,
}: ToolPageLayoutProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <div className="py-10 sm:py-14 text-center px-4" style={{ backgroundColor: color }}>
        <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">
          {title}
        </h1>
        <p className="text-white/80 text-sm sm:text-base max-w-xl mx-auto">
          {description}
        </p>
        <p className="text-white/60 text-xs mt-3">Free — No registration required</p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 -mt-6 sm:-mt-8 relative z-10 pb-16">
        <div className="bg-surface border border-border rounded-2xl shadow-lg p-5 sm:p-8">
          {children}
          <TrustSignals />
        </div>
      </div>
    </div>
  );
}
