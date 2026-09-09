"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { tools } from "@/lib/tools";

const navTools = tools.filter((t) => t.available);

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg">
            <span className="w-9 h-9 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-sm">
              P
            </span>
            <span className="hidden sm:inline bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
              PDF Tools
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {navTools.slice(0, 4).map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="px-3.5 py-2 text-sm font-medium text-muted hover:text-primary rounded-xl hover:bg-primary/5 transition-all active:scale-95"
              >
                {tool.name}
              </Link>
            ))}
            <div className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex items-center gap-1 px-3.5 py-2 text-sm font-medium text-primary hover:bg-primary/8 rounded-xl transition-all active:scale-95"
              >
                All PDF Tools
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
              </button>
              {toolsOpen && (
                <>
                  <div className="fixed inset-0" onClick={() => setToolsOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-[720px] glass-strong rounded-2xl shadow-xl p-6 grid grid-cols-3 gap-4">
                    {["organize", "optimize", "convert", "edit", "security", "intelligence"].map((cat) => (
                      <div key={cat}>
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-primary/60 mb-2">
                          {cat === "convert" ? "Convert PDF" : cat === "organize" ? "Organize PDF" : cat === "edit" ? "Edit PDF" : cat === "optimize" ? "Optimize PDF" : cat === "security" ? "PDF Security" : "PDF Intelligence"}
                        </h3>
                        <ul className="space-y-0.5">
                          {tools.filter((t) => t.category === cat).map((tool) => (
                            <li key={tool.slug}>
                              <Link
                                href={tool.available ? `/${tool.slug}` : "#"}
                                onClick={() => setToolsOpen(false)}
                                className={`text-sm block py-1 px-2 rounded-lg transition-all ${tool.available ? "text-foreground hover:text-primary hover:bg-primary/5" : "text-muted/40 cursor-default"}`}
                              >
                                {tool.name}
                                {!tool.available && <span className="text-[10px] ml-1 text-muted/30">Soon</span>}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </nav>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted hover:text-primary rounded-xl hover:bg-primary/5 transition-all active:scale-90"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border glass-strong">
          <nav className="px-4 py-3 space-y-0.5">
            {navTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all active:scale-[0.98]"
              >
                {tool.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
