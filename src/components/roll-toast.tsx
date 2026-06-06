"use client";

import { useState, useCallback } from "react";

type Toast = {
  id: number;
  message: string;
};

let nextId = 0;

export function useRollToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const roll = useCallback((skillName: string, total: number) => {
    const d20 = Math.ceil(Math.random() * 20);
    const result = d20 + total;
    let message = `${skillName}: ${d20} + ${total} = ${result}`;
    if (d20 === 20) message += " · NAT 20! ✦";
    if (d20 === 1) message += " · NAT 1";

    const id = nextId++;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 1800);
  }, []);

  return { toasts, roll };
}

export function RollToastContainer({ toasts }: { toasts: Toast[] }) {
  if (toasts.length === 0) return null;
  const latest = toasts[toasts.length - 1];
  return (
    <div
      className="fixed z-[200] pointer-events-none"
      style={{
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
        animation: "slideUpFade 0.2s ease",
      }}
    >
      <div
        style={{
          backgroundColor: "var(--chrome)",
          color: "var(--chrome-text)",
          fontFamily: "var(--font-mono)",
          fontSize: 14,
          fontWeight: 600,
          padding: "10px 18px",
          borderRadius: "var(--r)",
          boxShadow: "var(--sh-md)",
          whiteSpace: "nowrap",
        }}
      >
        {latest.message.split(/(NAT 20! ✦|NAT 1)/).map((part, i) =>
          part === "NAT 20! ✦" || part === "NAT 1" ? (
            <span key={i} style={{ color: "var(--accent-bright)" }}>{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </div>
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
