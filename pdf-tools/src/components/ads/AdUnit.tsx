"use client";

import { useEffect, useRef } from "react";

type AdFormat = "rectangle" | "leaderboard" | "in-feed" | "sidebar" | "sticky-mobile";

interface AdUnitProps {
  slot: string;
  format: AdFormat;
  className?: string;
}

const formatStyles: Record<AdFormat, { width: string; height: string; minHeight: string }> = {
  rectangle: { width: "100%", height: "auto", minHeight: "250px" },
  leaderboard: { width: "100%", height: "auto", minHeight: "90px" },
  "in-feed": { width: "100%", height: "auto", minHeight: "120px" },
  sidebar: { width: "100%", height: "auto", minHeight: "250px" },
  "sticky-mobile": { width: "100%", height: "auto", minHeight: "50px" },
};

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

export default function AdUnit({ slot, format, className = "" }: AdUnitProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }
  }, []);

  const styles = formatStyles[format];

  return (
    <div
      ref={adRef}
      className={`ad-container ${className}`}
      style={{ minHeight: styles.minHeight, overflow: "hidden" }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: styles.width, height: styles.height }}
        data-ad-client="ca-pub-XXXXXXXXXX"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
