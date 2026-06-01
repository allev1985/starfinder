"use client";

import { useState, useTransition, useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { addArmorAction, removeArmorAction, toggleArmorWornAction } from "../actions";
import type { Armor } from "@/db/schema";
import type { CharacterArmorEntry } from "@/db/queries/characters";

function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

type ArmorCardProps = {
  entry: CharacterArmorEntry;
  characterId: string;
  isOwner: boolean;
  onWornToggle: (id: string, worn: boolean) => void;
  onRemoved: (id: string) => void;
};

function ArmorCard({ entry, characterId, isOwner, onWornToggle, onRemoved }: ArmorCardProps) {
  const [, startTransition] = useTransition();
  const [removing, setRemoving] = useState(false);
  const a = entry.armor;

  const maxDexLabel = a.maxDexBonus != null ? `+${a.maxDexBonus}` : "—";
  const speedLabel = a.speedAdjustment === 0 ? "0 ft" : `${a.speedAdjustment} ft`;

  function handleWornChange(checked: boolean) {
    onWornToggle(entry.id, checked);
    startTransition(() => {
      toggleArmorWornAction(entry.id, characterId, checked);
    });
  }

  function handleRemove() {
    setRemoving(true);
    onRemoved(entry.id);
    startTransition(() => {
      removeArmorAction(entry.id, characterId);
    });
  }

  if (removing) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-start gap-3">
            {isOwner && (
              <div className="flex flex-col items-center gap-1 pt-0.5">
                <Checkbox
                  checked={entry.worn}
                  onCheckedChange={handleWornChange}
                  aria-label="Mark as worn"
                />
                <span className="text-xs text-muted-foreground">Worn</span>
              </div>
            )}
            {!isOwner && entry.worn && (
              <div className="flex flex-col items-center gap-1 pt-0.5">
                <Checkbox checked disabled aria-label="Currently worn" />
                <span className="text-xs text-muted-foreground">Worn</span>
              </div>
            )}
            <div>
              <p className="text-sm font-semibold">{a.name}</p>
              <p className="text-xs text-muted-foreground">
                Level {a.itemLevel} · {a.type.charAt(0).toUpperCase() + a.type.slice(1)} · {a.price.toLocaleString()} cr
              </p>
            </div>
          </div>
          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-accent transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove armor?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Remove {a.name} from this character&apos;s inventory?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRemove}>Remove</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        <div className="grid grid-cols-4 gap-x-4 gap-y-2">
          <StatCell label="EAC" value={`+${a.eacBonus}`} />
          <StatCell label="KAC" value={`+${a.kacBonus}`} />
          <StatCell label="Max DEX" value={maxDexLabel} />
          <StatCell label="ACP" value={a.armorCheckPenalty} />
          <StatCell label="Speed" value={speedLabel} />
          <StatCell label="Bulk" value={a.bulk} />
          <StatCell label="Slots" value={a.upgradeSlots} />
        </div>
      </CardContent>
    </Card>
  );
}

type Props = {
  characterId: string;
  isOwner: boolean;
  initialCharacterArmor: CharacterArmorEntry[];
  availableArmor: Armor[];
  onWornArmorChange: (armor: Armor | null) => void;
};

export default function ArmorInventory({ characterId, isOwner, initialCharacterArmor, availableArmor, onWornArmorChange }: Props) {
  const [inventory, setInventory] = useState<CharacterArmorEntry[]>(initialCharacterArmor);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [, startTransition] = useTransition();
  const optimisticCounter = useRef(0);

  function handleWornToggle(id: string, worn: boolean) {
    const updated = inventory.map((e) =>
      e.id === id ? { ...e, worn } : worn ? { ...e, worn: false } : e
    );
    setInventory(updated);
    const wornEntry = updated.find((e) => e.worn);
    onWornArmorChange(wornEntry?.armor ?? null);
  }

  function handleRemoved(id: string) {
    const updated = inventory.filter((e) => e.id !== id);
    setInventory(updated);
    const wornEntry = updated.find((e) => e.worn);
    onWornArmorChange(wornEntry?.armor ?? null);
  }

  function handleAdd(armorItem: Armor) {
    setPickerOpen(false);
    const optimisticId = `optimistic-${armorItem.id}-${++optimisticCounter.current}`;
    const optimistic: CharacterArmorEntry = {
      id: optimisticId,
      armorId: armorItem.id,
      worn: false,
      armor: armorItem,
    };
    setInventory((prev) => [...prev, optimistic]);
    startTransition(async () => {
      const result = await addArmorAction(characterId, armorItem.id);
      if (!result.success) {
        setInventory((prev) => prev.filter((e) => e.id !== optimisticId));
      }
    });
  }

  return (
    <div className="mb-4">
      <h3 className="mb-2 block bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">Armor</h3>

      {inventory.length === 0 ? (
        <p className="mb-3 text-sm text-muted-foreground">No armor in inventory.</p>
      ) : (
        <div className="mb-3 flex flex-col gap-3">
          {inventory.map((entry) => (
            <ArmorCard
              key={entry.id}
              entry={entry}
              characterId={characterId}
              isOwner={isOwner}
              onWornToggle={handleWornToggle}
              onRemoved={handleRemoved}
            />
          ))}
        </div>
      )}

      {isOwner && (
        <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
          <PopoverTrigger
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
            aria-expanded={pickerOpen}
            disabled={availableArmor.length === 0}
          >
            <Plus className="h-3.5 w-3.5" />
            {availableArmor.length === 0 ? "Select a class to add armor" : "Add Armor"}
          </PopoverTrigger>
          <PopoverContent className="w-[340px] p-0">
            <Command>
              <CommandInput placeholder="Search armor…" className="h-8" />
              <CommandList>
                <CommandEmpty>No armor found.</CommandEmpty>
                <CommandGroup>
                  {availableArmor.map((a) => (
                    <CommandItem
                      key={a.id}
                      value={a.name}
                      onSelect={() => handleAdd(a)}
                    >
                      <span>{a.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">
                        Lv{a.itemLevel} {a.type}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
