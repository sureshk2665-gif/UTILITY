"use client";

import { useState } from "react";
import AdUnit from "./AdUnit";

export default function StickyMobileAd() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="relative bg-white border-t border-border shadow-lg">
        <button
          onClick={() => setDismissed(true)}
          className="absolute -top-7 right-2 w-6 h-6 rounded-full bg-gray-800/70 text-white text-xs flex items-center justify-center hover:bg-gray-800 transition-colors"
          aria-label="Close ad"
        >
          &times;
        </button>
        <AdUnit slot="STICKY_MOBILE_SLOT" format="sticky-mobile" />
      </div>
    </div>
  );
}
