"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type Props = {
  icon: ReactNode;
  title: string;
  summary?: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

export default function AccordionBlock({ icon, title, summary, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      className="overflow-hidden"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r)",
        marginBottom: 11,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-[10px] text-left transition-colors"
        style={{ padding: "13px 15px", cursor: "pointer" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--surface-2)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = ""; }}
      >
        <span style={{ color: "var(--sf-accent)", width: 16, height: 16, display: "flex", alignItems: "center", flexShrink: 0 }}>
          {icon}
        </span>
        <span
          className="uppercase tracking-[0.05em] flex-1"
          style={{ fontFamily: "var(--font-ui)", fontSize: "12.5px", fontWeight: 600, color: "var(--text-1)" }}
        >
          {title}
        </span>
        {summary && (
          <span
            style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--text-3)" }}
          >
            {summary}
          </span>
        )}
        <ChevronDown
          className="shrink-0 transition-transform duration-200"
          style={{
            width: 18,
            height: 18,
            color: "var(--text-3)",
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
          }}
        />
      </button>

      {open && (
        <div style={{ padding: "6px 15px 16px", borderTop: "1px solid var(--border)" }}>
          {children}
        </div>
      )}
    </div>
  );
}
