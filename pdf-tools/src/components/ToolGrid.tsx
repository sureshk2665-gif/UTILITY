"use client";

import { useState } from "react";
import Link from "next/link";
import { tools, categories } from "@/lib/tools";
import {
  Layers, Scissors, Trash2, FileOutput, RotateCw, Minimize2,
  FileText, Hash, Image, FileSpreadsheet, Presentation, Globe,
  Archive, Code, Pencil, PenTool, Droplets, FormInput, EyeOff,
  Crop, Wrench, GitCompare, Camera, Unlock, Lock, ScanText,
  Bot, Languages,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  merge: <Layers className="w-7 h-7" />,
  split: <Scissors className="w-7 h-7" />,
  remove: <Trash2 className="w-7 h-7" />,
  extract: <FileOutput className="w-7 h-7" />,
  rotate: <RotateCw className="w-7 h-7" />,
  compress: <Minimize2 className="w-7 h-7" />,
  organize: <FileText className="w-7 h-7" />,
  numbers: <Hash className="w-7 h-7" />,
  image: <Image className="w-7 h-7" />,
  word: <FileText className="w-7 h-7" />,
  ppt: <Presentation className="w-7 h-7" />,
  excel: <FileSpreadsheet className="w-7 h-7" />,
  html: <Globe className="w-7 h-7" />,
  archive: <Archive className="w-7 h-7" />,
  markdown: <Code className="w-7 h-7" />,
  edit: <Pencil className="w-7 h-7" />,
  sign: <PenTool className="w-7 h-7" />,
  watermark: <Droplets className="w-7 h-7" />,
  forms: <FormInput className="w-7 h-7" />,
  redact: <EyeOff className="w-7 h-7" />,
  crop: <Crop className="w-7 h-7" />,
  repair: <Wrench className="w-7 h-7" />,
  compare: <GitCompare className="w-7 h-7" />,
  scan: <Camera className="w-7 h-7" />,
  unlock: <Unlock className="w-7 h-7" />,
  lock: <Lock className="w-7 h-7" />,
  ocr: <ScanText className="w-7 h-7" />,
  ai: <Bot className="w-7 h-7" />,
  translate: <Languages className="w-7 h-7" />,
};

export default function ToolGrid() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? tools
      : tools.filter((t) => t.category === activeCategory);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-10 justify-center">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat.id
                ? "bg-foreground text-white shadow-md"
                : "bg-surface-alt text-muted hover:text-foreground hover:bg-gray-200 border border-border"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
        {filtered.map((tool) => {
          const inner = (
            <div
              className={`tool-card ${!tool.available ? "opacity-40 cursor-default" : ""}`}
            >
              <div
                className="tool-icon"
                style={{ background: `linear-gradient(135deg, ${tool.color}, ${tool.color}cc)` }}
              >
                {iconMap[tool.icon] || <FileText className="w-7 h-7" />}
              </div>
              <h3 className="font-semibold text-sm mb-1">{tool.name}</h3>
              <p className="text-xs text-muted leading-relaxed line-clamp-2">
                {tool.description}
              </p>
              {!tool.available && (
                <span className="mt-2 text-[10px] px-2.5 py-0.5 rounded-full bg-gray-100 text-muted font-medium">
                  Coming Soon
                </span>
              )}
            </div>
          );

          return tool.available ? (
            <Link key={tool.slug} href={`/${tool.slug}`}>
              {inner}
            </Link>
          ) : (
            <div key={tool.slug}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
