"use client";

import { Input } from "@/components/ui/input";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
import { useNumericInput } from "@/hooks/use-numeric-input";
import { updateCreditsAction, updateXpAction } from "../actions";
import { useCharacter } from "./character-context";

export default function CreditsXpSection() {
  const { characterId, isOwner, credits, setCredits, xpEarned, setXpEarned } = useCharacter();
  const scheduleCreditsSave = useDebouncedSave((v: number) => updateCreditsAction(characterId, v));
  const scheduleXpSave = useDebouncedSave((v: number) => updateXpAction(characterId, v));

  const creditsInput = useNumericInput(credits, (v) => { setCredits(v); scheduleCreditsSave(v); });
  const xpInput = useNumericInput(xpEarned, (v) => { setXpEarned(v); scheduleXpSave(v); });

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
              value={creditsInput.inputValue}
              onChange={creditsInput.handleChange}
              onBlur={creditsInput.handleBlur}
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
              value={xpInput.inputValue}
              onChange={xpInput.handleChange}
              onBlur={xpInput.handleBlur}
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
