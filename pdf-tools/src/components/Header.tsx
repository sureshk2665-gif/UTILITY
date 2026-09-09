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
    <header className="sticky top-0 z-50 bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white text-sm font-bold">
              P
            </span>
            <span className="hidden sm:inline">PDF Tools</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navTools.slice(0, 4).map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                className="px-3 py-2 text-sm font-medium text-muted hover:text-foreground rounded-lg hover:bg-surface-alt transition-colors"
              >
                {tool.name}
              </Link>
            ))}
            <div className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-primary hover:bg-primary-light rounded-lg transition-colors"
              >
                All PDF Tools
                <ChevronDown className={`w-4 h-4 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
              </button>
              {toolsOpen && (
                <>
                  <div className="fixed inset-0" onClick={() => setToolsOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-[720px] bg-surface border border-border rounded-xl shadow-lg p-6 grid grid-cols-3 gap-4">
                    {["organize", "optimize", "convert", "edit", "security", "intelligence"].map((cat) => (
                      <div key={cat}>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
                          {cat === "convert" ? "Convert PDF" : cat === "organize" ? "Organize PDF" : cat === "edit" ? "Edit PDF" : cat === "optimize" ? "Optimize PDF" : cat === "security" ? "PDF Security" : "PDF Intelligence"}
                        </h3>
                        <ul className="space-y-1">
                          {tools.filter((t) => t.category === cat).map((tool) => (
                            <li key={tool.slug}>
                              <Link
                                href={tool.available ? `/${tool.slug}` : "#"}
                                onClick={() => setToolsOpen(false)}
                                className={`text-sm block py-0.5 ${tool.available ? "text-foreground hover:text-primary" : "text-muted/50 cursor-default"}`}
                              >
                                {tool.name}
                                {!tool.available && <span className="text-[10px] ml-1 text-muted/40">Soon</span>}
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

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-muted hover:text-foreground"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-surface">
          <nav className="px-4 py-3 space-y-1">
            {navTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/${tool.slug}`}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-foreground hover:bg-surface-alt rounded-lg"
              >
                {tool.name}
              </Link>
            ))}
            <hr className="border-border my-2" />
            <p className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted">
              Coming Soon
            </p>
            {tools.filter((t) => !t.available).slice(0, 8).map((tool) => (
              <span
                key={tool.slug}
                className="block px-3 py-2 text-sm text-muted/50"
              >
                {tool.name}
              </span>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
