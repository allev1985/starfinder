"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useAppBar } from "./app-bar-context";

export default function AppBar() {
  const { config } = useAppBar();
  const { title, subtitle, backHref } = config;

  return (
    <header
      className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center px-2"
      style={{ height: 56, backgroundColor: "var(--chrome)" }}
    >
      {/* Back button */}
      <div className="w-[40px] flex items-center justify-start">
        {backHref ? (
          <Link
            href={backHref}
            className="flex items-center justify-center rounded-[9px]"
            style={{ width: 34, height: 34, backgroundColor: "var(--chrome-3)", color: "var(--chrome-text)" }}
          >
            <ChevronLeft size={18} />
          </Link>
        ) : (
          <div style={{ width: 34 }} />
        )}
      </div>

      {/* Center: title + subtitle */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        {title && (
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontWeight: 700,
              fontSize: 16,
              color: "var(--chrome-text)",
              lineHeight: 1.2,
            }}
          >
            {title}
          </span>
        )}
        {subtitle && (
          <span
            className="uppercase tracking-[0.05em]"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              color: "var(--chrome-muted)",
              lineHeight: 1.2,
            }}
          >
            {subtitle}
          </span>
        )}
      </div>

      <div className="w-[40px]" />
    </header>
  );
}
