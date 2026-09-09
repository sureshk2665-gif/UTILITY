"use client";

import ToolPageLayout from "@/components/ToolPageLayout";
import { Clock } from "lucide-react";

interface ComingSoonToolProps {
  title: string;
  description: string;
  color: string;
  features: string[];
}

export default function ComingSoonTool({ title, description, color, features }: ComingSoonToolProps) {
  return (
    <ToolPageLayout title={title} description={description} color={color}>
      <div className="text-center py-8">
        <Clock className="w-16 h-16 mx-auto text-muted/30 mb-4" />
        <h2 className="text-xl font-bold mb-2">Coming Soon</h2>
        <p className="text-sm text-muted max-w-md mx-auto mb-6">
          This tool requires server-side processing and is currently under development.
          It will be available in the next update.
        </p>
        <div className="bg-surface-alt border border-border rounded-xl p-5 text-left max-w-sm mx-auto">
          <h3 className="text-sm font-bold mb-2">What to expect:</h3>
          <ul className="space-y-1.5">
            {features.map((f, i) => (
              <li key={i} className="text-sm text-muted flex gap-2">
                <span className="text-accent-green">&#10003;</span> {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ToolPageLayout>
  );
}
