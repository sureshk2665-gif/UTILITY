"use client";

import AdUnit from "./AdUnit";

interface AdBannerProps {
  position: "leaderboard-footer" | "sidebar-tool" | "in-feed-blog" | "result-interstitial";
}

const slotMap: Record<AdBannerProps["position"], { slot: string; format: "rectangle" | "leaderboard" | "in-feed" | "sidebar" }> = {
  "leaderboard-footer": { slot: "FOOTER_LEADERBOARD_SLOT", format: "leaderboard" },
  "sidebar-tool": { slot: "SIDEBAR_TOOL_SLOT", format: "sidebar" },
  "in-feed-blog": { slot: "IN_FEED_BLOG_SLOT", format: "in-feed" },
  "result-interstitial": { slot: "RESULT_INTERSTITIAL_SLOT", format: "rectangle" },
};

export default function AdBanner({ position }: AdBannerProps) {
  const { slot, format } = slotMap[position];

  return (
    <div className="ad-wrapper my-4">
      <p className="text-[10px] text-muted/50 text-center mb-1 uppercase tracking-wider">Advertisement</p>
      <AdUnit slot={slot} format={format} className="glass-card rounded-2xl overflow-hidden" />
    </div>
  );
}
