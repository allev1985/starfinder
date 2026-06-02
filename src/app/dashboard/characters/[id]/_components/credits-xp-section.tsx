"use client";

import { Input } from "@/components/ui/input";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
import { updateCreditsAction, updateXpAction } from "../actions";

type Props = {
  characterId: string;
  credits: number;
  xpEarned: number;
  onCreditsChange: (v: number) => void;
  onXpChange: (v: number) => void;
  isOwner: boolean;
};

export default function CreditsXpSection({ characterId, credits, xpEarned, onCreditsChange, onXpChange, isOwner }: Props) {
  const scheduleCreditsSave = useDebouncedSave((v: number) => updateCreditsAction(characterId, v));
  const scheduleXpSave = useDebouncedSave((v: number) => updateXpAction(characterId, v));

  function parseInput(raw: string): number {
    const n = parseInt(raw, 10);
    return isNaN(n) ? 0 : n;
  }

  return (
    <section className="mb-6">
      <h2 className="mb-3 block bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
        Credits &amp; Experience
      </h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Credits</span>
          {isOwner ? (
            <Input
              type="number"
              value={credits}
              onChange={(e) => { const v = parseInput(e.target.value); onCreditsChange(v); scheduleCreditsSave(v); }}
              className="h-8 text-sm"
            />
          ) : (
            <span className="text-sm">{credits}</span>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">XP Earned</span>
          {isOwner ? (
            <Input
              type="number"
              value={xpEarned}
              onChange={(e) => { const v = parseInput(e.target.value); onXpChange(v); scheduleXpSave(v); }}
              className="h-8 text-sm"
            />
          ) : (
            <span className="text-sm">{xpEarned}</span>
          )}
        </div>
      </div>
    </section>
  );
}
