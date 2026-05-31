"use client";

import { useState, useTransition } from "react";
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { updateEquippedArmorAction } from "../actions";
import type { Armor } from "@/db/schema";

type Props = {
  availableArmor: Armor[];
  equippedArmor: Armor | null;
  characterId: string;
  isOwner: boolean;
  onArmorChange: (armor: Armor | null) => void;
};

function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

export default function ArmorPicker({ availableArmor, equippedArmor, characterId, isOwner, onArmorChange }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedArmor, setSelectedArmor] = useState<Armor | null>(equippedArmor);
  const [, startTransition] = useTransition();

  function handleSelect(armor: Armor | null) {
    setSelectedArmor(armor);
    onArmorChange(armor);
    setOpen(false);
    startTransition(() => {
      updateEquippedArmorAction(characterId, armor?.id ?? null);
    });
  }

  const maxDexLabel = selectedArmor?.maxDexBonus != null ? `+${selectedArmor.maxDexBonus}` : "—";
  const speedLabel = !selectedArmor || selectedArmor.speedAdjustment === 0 ? "0 ft" : `${selectedArmor.speedAdjustment} ft`;

  const pickerButton = isOwner ? (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
        aria-expanded={open}
      >
        {selectedArmor ? "Change Armor" : "Select Armor"}
        <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0">
        <Command>
          <CommandInput placeholder="Search armor…" className="h-8" />
          <CommandList>
            <CommandEmpty>No armor found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value="__none__"
                onSelect={() => handleSelect(null)}
                data-checked={selectedArmor === null}
              >
                <span className="text-muted-foreground">None</span>
              </CommandItem>
              {availableArmor.map((a) => (
                <CommandItem
                  key={a.id}
                  value={a.name}
                  onSelect={() => handleSelect(a)}
                  data-checked={selectedArmor?.id === a.id}
                >
                  <span>{a.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">Lv{a.itemLevel} {a.type}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  ) : null;

  return (
    <div className="mb-4">
      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Armor</h3>
      <Card>
        <CardContent className="p-4">
          {selectedArmor ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">{selectedArmor.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Level {selectedArmor.itemLevel} · {selectedArmor.type.charAt(0).toUpperCase() + selectedArmor.type.slice(1)} · {selectedArmor.price.toLocaleString()} cr
                  </p>
                </div>
                {pickerButton}
              </div>
              <div className="grid grid-cols-4 gap-x-4 gap-y-2">
                <StatCell label="EAC" value={`+${selectedArmor.eacBonus}`} />
                <StatCell label="KAC" value={`+${selectedArmor.kacBonus}`} />
                <StatCell label="Max DEX" value={maxDexLabel} />
                <StatCell label="ACP" value={selectedArmor.armorCheckPenalty} />
                <StatCell label="Speed" value={speedLabel} />
                <StatCell label="Bulk" value={selectedArmor.bulk} />
                <StatCell label="Slots" value={selectedArmor.upgradeSlots} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">No armor equipped</p>
              {isOwner && availableArmor.length === 0
                ? <span className="text-xs text-muted-foreground">Select a class to enable armor selection</span>
                : pickerButton}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
