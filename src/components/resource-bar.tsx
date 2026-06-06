"use client";

type Color = "accent" | "good" | "warn" | "danger";

const colorMap: Record<Color, { dot: string; fill: string; decrement: string; decrementHover: string; increment: string; incrementHover: string }> = {
  accent:  { dot: "var(--sf-accent)",  fill: "var(--sf-accent)",  decrement: "var(--danger)", decrementHover: "var(--danger-bg)", increment: "var(--good)", incrementHover: "var(--good-bg)" },
  good:    { dot: "var(--good)",    fill: "var(--good)",    decrement: "var(--danger)", decrementHover: "var(--danger-bg)", increment: "var(--good)", incrementHover: "var(--good-bg)" },
  warn:    { dot: "var(--warn)",    fill: "var(--warn)",    decrement: "var(--danger)", decrementHover: "var(--danger-bg)", increment: "var(--good)", incrementHover: "var(--good-bg)" },
  danger:  { dot: "var(--danger)",  fill: "var(--danger)",  decrement: "var(--danger)", decrementHover: "var(--danger-bg)", increment: "var(--good)", incrementHover: "var(--good-bg)" },
};

type Props = {
  label: string;
  color: Color;
  current: number;
  max: number;
  onDecrement?: () => void;
  onIncrement?: () => void;
  onMaxChange?: (value: number) => void;
  readOnly?: boolean;
};

export default function ResourceBar({ label, color, current, max, onDecrement, onIncrement, onMaxChange, readOnly = false }: Props) {
  const c = colorMap[color];
  const pct = max > 0 ? Math.min(100, Math.round((current / max) * 100)) : 0;

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-[6px]">
        <div className="flex items-center gap-[7px]">
          <span
            className="inline-block rounded-full shrink-0"
            style={{ width: 9, height: 9, backgroundColor: c.dot }}
          />
          <span
            className="font-semibold"
            style={{ fontFamily: "var(--font-ui)", fontSize: "13.5px", color: "var(--text-1)" }}
          >
            {label}
          </span>
        </div>
        <div className="flex items-center gap-1" style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--text-2)" }}>
          <span style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: "17px", color: "var(--text-1)" }}>{current}</span>
          <span>{" / "}</span>
          {onMaxChange && !readOnly ? (
            <input
              type="number"
              value={max}
              min={0}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v) && v >= 0) onMaxChange(v);
              }}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                color: "var(--text-2)",
                width: 44,
                textAlign: "center",
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                borderRadius: "var(--r-xs)",
                padding: "1px 4px",
              }}
            />
          ) : (
            <span>{max}</span>
          )}
        </div>
      </div>

      <div
        className="w-full relative overflow-hidden"
        style={{ height: 8, borderRadius: 99, backgroundColor: "var(--surface-2)", border: "1px solid var(--border)" }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: `${pct}%`,
            backgroundColor: c.fill,
            borderRadius: 99,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {!readOnly && (
        <div className="flex gap-2 mt-[7px]">
          <button
            type="button"
            onClick={onDecrement}
            className="flex-1 py-2 rounded-[9px] border text-center transition-colors"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "15px",
              fontWeight: 600,
              color: c.decrement,
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = c.decrementHover; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--surface)"; }}
          >
            −
          </button>
          <button
            type="button"
            onClick={onIncrement}
            className="flex-1 py-2 rounded-[9px] border text-center transition-colors"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "15px",
              fontWeight: 600,
              color: c.increment,
              borderColor: "var(--border)",
              backgroundColor: "var(--surface)",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = c.incrementHover; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--surface)"; }}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
