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
  merge: <Layers className="w-6 h-6" />,
  split: <Scissors className="w-6 h-6" />,
  remove: <Trash2 className="w-6 h-6" />,
  extract: <FileOutput className="w-6 h-6" />,
  rotate: <RotateCw className="w-6 h-6" />,
  compress: <Minimize2 className="w-6 h-6" />,
  organize: <FileText className="w-6 h-6" />,
  numbers: <Hash className="w-6 h-6" />,
  image: <Image className="w-6 h-6" />,
  word: <FileText className="w-6 h-6" />,
  ppt: <Presentation className="w-6 h-6" />,
  excel: <FileSpreadsheet className="w-6 h-6" />,
  html: <Globe className="w-6 h-6" />,
  archive: <Archive className="w-6 h-6" />,
  markdown: <Code className="w-6 h-6" />,
  edit: <Pencil className="w-6 h-6" />,
  sign: <PenTool className="w-6 h-6" />,
  watermark: <Droplets className="w-6 h-6" />,
  forms: <FormInput className="w-6 h-6" />,
  redact: <EyeOff className="w-6 h-6" />,
  crop: <Crop className="w-6 h-6" />,
  repair: <Wrench className="w-6 h-6" />,
  compare: <GitCompare className="w-6 h-6" />,
  scan: <Camera className="w-6 h-6" />,
  unlock: <Unlock className="w-6 h-6" />,
  lock: <Lock className="w-6 h-6" />,
  ocr: <ScanText className="w-6 h-6" />,
  ai: <Bot className="w-6 h-6" />,
  translate: <Languages className="w-6 h-6" />,
};

export default function ToolGrid() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered =
    activeCategory === "all"
      ? tools
      : tools.filter((t) => t.category === activeCategory);

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all active:scale-95 ${
              activeCategory === cat.id
                ? "btn-primary-glass text-white"
                : "btn-glass"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((tool) => {
          const inner = (
            <div
              className={`group relative glass-card rounded-2xl p-5 ${
                !tool.available ? "opacity-50 cursor-default" : ""
              }`}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 text-white shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${tool.color}, ${tool.color}dd)`,
                }}
              >
                {iconMap[tool.icon] || <FileText className="w-6 h-6" />}
              </div>
              <h3 className="font-semibold text-sm mb-1">{tool.name}</h3>
              <p className="text-xs text-muted leading-relaxed">
                {tool.description}
              </p>
              {!tool.available && (
                <span className="absolute top-3 right-3 bg-primary/8 text-primary/60 text-[10px] px-2.5 py-0.5 rounded-full font-medium backdrop-blur-sm">
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
