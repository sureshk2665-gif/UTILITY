"use client";

import { useState } from "react";
import AdUnit from "./AdUnit";

export default function StickyMobileAd() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="relative bg-white/90 backdrop-blur-xl border-t border-border shadow-lg">
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-7 right-2 w-6 h-6 rounded-full bg-foreground/10 backdrop-blur-sm text-foreground/60 text-xs flex items-center justify-center hover:bg-foreground/20 transition-all"
          aria-label="Close ad"
        >
          ✕
        </button>
        <AdUnit slot="STICKY_MOBILE_SLOT" format="sticky-mobile" />
      </div>
    </div>
  );
}
