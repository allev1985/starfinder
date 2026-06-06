"use client";

import { useEffect } from "react";
import Avatar from "@/components/avatar";
import { useCharacter } from "./character-context";
import { useAppBar } from "@/components/app-bar-context";

type Props = {
  characterName: string;
  raceName: string | null;
  className: string | null;
  themeName: string | null;
};

export default function CharacterSheetHeader({ characterName, raceName, className, themeName }: Props) {
  const { level } = useCharacter();
  const { setConfig } = useAppBar();

  useEffect(() => {
    setConfig({
      title: characterName,
      subtitle: `LV ${level}${className ? ` · ${className.toUpperCase()}` : ""}`,
    });
  }, [characterName, level, className, setConfig]);

  const sub = [raceName, className, themeName].filter(Boolean).join(" · ");

  return (
    <div className="flex items-center gap-4 px-4 py-3" style={{ backgroundColor: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
      <Avatar name={characterName} size={52} radius={14} />
      <div className="flex-1 min-w-0">
        <h1
          className="leading-tight"
          style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 21, color: "var(--text-1)" }}
        >
          {characterName}
        </h1>
        {sub && (
          <p
            className="mt-[2px]"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--text-2)" }}
          >
            {sub}
          </p>
        )}
      </div>
      {/* Level badge */}
      <div
        className="flex flex-col items-center px-3 py-2 rounded-[11px] border shrink-0"
        style={{ backgroundColor: "var(--accent-bg)", borderColor: "var(--accent-border)" }}
      >
        <span
          className="uppercase tracking-[0.08em] leading-none"
          style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--accent-text)" }}
        >
          LEVEL
        </span>
        <span
          className="leading-none mt-[3px]"
          style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 22, color: "var(--accent-text)" }}
        >
          {level}
        </span>
      </div>
    </div>
  );
}
