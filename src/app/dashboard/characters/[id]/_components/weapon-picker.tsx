"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addWeaponAction } from "../actions";
import type { Weapon } from "@/db/schema";

const CATEGORY_LABELS: Record<string, string> = {
  small_arms: "Small Arms",
  longarms: "Longarms",
  heavy: "Heavy Weapons",
  sniper: "Sniper Weapons",
  melee_basic: "Basic Melee",
  melee_advanced: "Advanced Melee",
  grenade: "Grenades",
  special: "Special Weapons",
};

type Props = {
  allWeapons: Weapon[];
  carriedWeaponIds: Set<string>;
  characterId: string;
  onWeaponAdded: (weapon: Weapon) => void;
};

export default function WeaponPicker({ allWeapons, carriedWeaponIds, characterId, onWeaponAdded }: Props) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  const available = allWeapons.filter((w) => !carriedWeaponIds.has(w.id));

  function handleSelect(weapon: Weapon) {
    setOpen(false);
    onWeaponAdded(weapon);
    startTransition(() => {
      addWeaponAction(characterId, weapon.id);
    });
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
        aria-expanded={open}
      >
        <Plus className="h-3.5 w-3.5" />
        Add Weapon
      </PopoverTrigger>
      <PopoverContent className="w-[360px] p-0">
        <Command>
          <CommandInput placeholder="Search weapons…" className="h-8" />
          <CommandList>
            <CommandEmpty>No weapons found.</CommandEmpty>
            <CommandGroup>
              {available.map((w) => (
                <CommandItem
                  key={w.id}
                  value={w.name}
                  onSelect={() => handleSelect(w)}
                >
                  <span>{w.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    Lv{w.itemLevel} {CATEGORY_LABELS[w.category] ?? w.category}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
