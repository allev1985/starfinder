import type { ReactNode } from "react";

type Variant = "dm" | "lv" | "code";

const styles: Record<Variant, string> = {
  dm: [
    "bg-[var(--chrome)] text-white",
    "font-[family-name:var(--font-mono)] text-[9.5px] font-semibold uppercase tracking-[0.06em]",
    "px-2 py-0.5 rounded-full",
  ].join(" "),
  lv: [
    "bg-[var(--accent-bg)] text-[var(--accent-text)] border border-[var(--accent-border)]",
    "font-[family-name:var(--font-mono)] text-[9.5px] font-semibold uppercase tracking-[0.06em]",
    "px-2 py-0.5 rounded-full",
  ].join(" "),
  code: [
    "bg-[var(--surface-2)] text-[var(--text-2)] border border-[var(--border)]",
    "font-[family-name:var(--font-mono)] text-[12px] tracking-[0.05em]",
    "px-2 py-0.5 rounded-full",
  ].join(" "),
};

export default function Pill({
  variant,
  children,
}: {
  variant: Variant;
  children: ReactNode;
}) {
  return <span className={styles[variant]}>{children}</span>;
}
