"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { addWeaponAction } from "../actions";
import type { Weapon } from "@/db/schema";
import { useCharacter } from "./character-context";

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
};

export default function WeaponPicker({ allWeapons }: Props) {
  const { characterId, carriedWeapons, setCarriedWeapons } = useCharacter();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  const carriedWeaponIds = new Set(carriedWeapons.map((w) => w.id));
  const available = allWeapons.filter((w) => !carriedWeaponIds.has(w.id));

  function handleSelect(weapon: Weapon) {
    setOpen(false);
    setCarriedWeapons([...carriedWeapons, weapon]);
    startTransition(() => {
      addWeaponAction(characterId, weapon.id);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
      >
        <Plus className="h-3.5 w-3.5" />
        Add Weapon
      </DialogTrigger>
      <DialogContent className="max-w-sm p-0">
        <DialogHeader className="px-4 pt-4">
          <DialogTitle>Add Weapon</DialogTitle>
        </DialogHeader>
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
      </DialogContent>
    </Dialog>
  );
}
