"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * 技術透視標籤（docs/claude_ui_optimization_prompt.md §3 邊緣技術透視框）
 * 收合：小型灰色 badge；展開：毛玻璃 Tooltip 說明技術棧與範圍。
 * 只在 no-print 區顯示，列印時隱藏。
 */
export function TechTag({
  label = "AI 萃取",
  tech,
  scope,
  className,
}: {
  label?: string;
  tech: string;
  scope?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <span className={cn("tech-tag-wrap no-print relative inline-flex items-center", className)}>
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="inline-flex items-center gap-0.5 rounded-full border border-dashed border-ai-line bg-ai-fill px-2 py-0.5 text-[10px] text-accent-2 hover:bg-ai-fill/80 focus-visible:ring-1 focus-visible:ring-accent-2"
      >
        <span>⚙</span>
        <span translate="no">{label}</span>
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-0 z-50 mb-1 w-max max-w-[260px] rounded-[10px] border border-ai-line bg-surface/90 px-3 py-2 text-xs text-ink shadow-lg backdrop-blur-sm"
        >
          <span className="label-caps block">技術棧</span>
          <span className="mt-0.5 block font-medium" translate="no">{tech}</span>
          {scope && (
            <>
              <span className="label-caps mt-1 block">範圍</span>
              <span className="mt-0.5 block text-ink-2">{scope}</span>
            </>
          )}
        </span>
      )}
    </span>
  );
}
