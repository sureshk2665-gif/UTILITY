"use client";

import { useState, useEffect } from "react";

export default function TrustSignals() {
  const [timer, setTimer] = useState(7200);

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(timer / 60);
  const secs = timer % 60;

  return (
    <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="flex items-center gap-2 text-xs text-muted glass-card rounded-xl px-3 py-2.5">
        <svg className="w-4 h-4 text-accent-green shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>256-bit SSL Encrypted</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted glass-card rounded-xl px-3 py-2.5">
        <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span>GDPR Compliant</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted glass-card rounded-xl px-3 py-2.5">
        <svg className="w-4 h-4 text-accent-orange shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Auto-delete in {mins}:{secs.toString().padStart(2, "0")}</span>
      </div>
    </div>
  );
}
