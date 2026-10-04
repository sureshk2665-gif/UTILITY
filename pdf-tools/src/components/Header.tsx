"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { tools } from "@/lib/tools";

const navTools = tools.filter((t) => t.available);

const categoryLabels: Record<string, string> = {
  organize: "Organize PDF",
  convert: "Convert PDF",
  edit: "Edit PDF",
  optimize: "Optimize",
  security: "Security",
  intelligence: "Intelligence",
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
            <span className="w-9 h-9 bg-gradient-to-br from-[#E74C3C] to-[#C0392B] rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm">
              P
            </span>
            <span className="hidden sm:inline font-bold text-foreground">
              PDF Tools
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navTools.slice(0, 5).map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="px-3 py-2 text-sm text-muted hover:text-foreground rounded-lg hover:bg-surface-alt transition-colors"
              >
                {tool.name}
              </Link>
            ))}
            <div className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
              >
                All Tools
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
              </button>
              {toolsOpen && (
                <>
                  <div className="fixed inset-0" onClick={() => setToolsOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-[680px] bg-white rounded-2xl shadow-2xl border border-border p-6 grid grid-cols-3 gap-6">
                    {Object.entries(categoryLabels).map(([catId, label]) => {
                      const catTools = tools.filter((t) => t.category === catId);
                      if (catTools.length === 0) return null;
                      return (
                        <div key={catId}>
                          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2.5">{label}</h3>
                          <ul className="space-y-0.5">
                            {catTools.map((tool) => (
                              <li key={tool.slug}>
                                <Link
                                  href={tool.available ? `/${tool.slug}` : "#"}
                                  onClick={() => setToolsOpen(false)}
                                  className={`text-sm block py-1.5 px-2 rounded-lg transition-colors ${tool.available ? "text-foreground hover:text-primary hover:bg-primary/5" : "text-muted/40 cursor-default"}`}
                                >
                                  {tool.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted hover:text-foreground rounded-lg transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <nav className="px-4 py-3 space-y-0.5 max-h-[70vh] overflow-y-auto">
            {Object.entries(categoryLabels).map(([catId, label]) => {
              const catTools = tools.filter((t) => t.category === catId && t.available);
              if (catTools.length === 0) return null;
              return (
                <div key={catId} className="py-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted px-3 mb-1.5">{label}</h3>
                  {catTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/${tool.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
