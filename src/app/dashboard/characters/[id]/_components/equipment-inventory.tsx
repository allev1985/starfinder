"use client";

import { useState, useTransition, useRef } from "react";
import { Plus, Trash2, TriangleAlert, Minus, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants, Button } from "@/components/ui/button";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { addEquipmentAction, removeEquipmentAction, updateEquipmentQuantityAction, updateAmmoChargesAction } from "../actions";
import type { Equipment, EquipmentCategory } from "@/db/schema";
import type { CharacterEquipmentEntry } from "@/db/queries/characters";
import { useCharacter } from "./character-context";

const SYSTEM_LABELS: Record<string, string> = {
  brain: "Brain",
  eyes: "Eyes",
  ears: "Ears",
  throat: "Throat",
  arm: "Arm",
  hand: "Hand",
  lungs: "Lungs",
  spinal_column: "Spinal Column",
  feet: "Feet",
  skin: "Skin",
};

const AMMO_TYPE_LABELS: Record<string, string> = {
  battery: "Battery",
  petrochem_fuel: "Petrochem Fuel",
  small_arm_rounds: "Small Arm Rounds",
  longarm_rounds: "Longarm Rounds",
  heavy_rounds: "Heavy Rounds",
  sniper_rounds: "Sniper Rounds",
  shells: "Shells",
  darts: "Darts",
  missiles: "Missiles",
};

const AUGMENTATION_CATEGORIES: EquipmentCategory[] = ["augmentation_cybernetic", "augmentation_biotech", "personal_upgrade"];

function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

type EquipmentCardProps = {
  entry: CharacterEquipmentEntry;
  characterId: string;
  isOwner: boolean;
  onRemoved: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
  onChargesChange: (id: string, currentCharges: number | null) => void;
};

function EquipmentCard({ entry, characterId, isOwner, onRemoved, onQuantityChange, onChargesChange }: EquipmentCardProps) {
  const [, startTransition] = useTransition();
  const [removing, setRemoving] = useState(false);
  const e = entry.equipment;
  const isAmmo = e.category === "ammunition";
  const capacity = e.ammoCapacity ?? 0;
  const activeCharges = entry.currentCharges ?? capacity;
  const totalCharges = activeCharges + (entry.quantity - 1) * capacity;
  const totalCapacity = entry.quantity * capacity;
  const isFull = entry.currentCharges === null || entry.currentCharges >= capacity;
  const isEmpty = entry.currentCharges !== null && entry.currentCharges <= 0;

  function handleRemove() {
    setRemoving(true);
    onRemoved(entry.id);
    startTransition(() => {
      removeEquipmentAction(entry.id, characterId);
    });
  }

  function handleDecrement() {
    const next = entry.currentCharges === null ? capacity - 1 : entry.currentCharges - 1;
    onChargesChange(entry.id, next);
    startTransition(() => {
      updateAmmoChargesAction(entry.id, characterId, next);
    });
  }

  function handleIncrement() {
    const next = entry.currentCharges === null ? capacity : entry.currentCharges + 1;
    const clamped = Math.min(next, capacity);
    const value = clamped >= capacity ? null : clamped;
    onChargesChange(entry.id, value);
    startTransition(() => {
      updateAmmoChargesAction(entry.id, characterId, value);
    });
  }

  function handleUnitChange(delta: number) {
    const newQty = Math.max(1, entry.quantity + delta);
    onQuantityChange(entry.id, newQty);
    startTransition(() => {
      updateEquipmentQuantityAction(entry.id, characterId, newQty);
    });
  }

  function handleReload() {
    onChargesChange(entry.id, null);
    startTransition(() => {
      updateAmmoChargesAction(entry.id, characterId, null);
    });
  }

  if (removing) return null;

  const categoryLabel = e.category === "augmentation_cybernetic"
    ? "Cybernetic"
    : e.category === "augmentation_biotech"
    ? "Biotech"
    : e.category === "personal_upgrade"
    ? "Personal Upgrade"
    : "Ammunition";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <p className="text-sm font-semibold">{e.name}</p>
            <p className="text-xs text-muted-foreground">
              Level {e.itemLevel} · {categoryLabel}
              {e.system ? ` · ${SYSTEM_LABELS[e.system] ?? e.system}` : ""}
              {" · "}
              {e.price.toLocaleString()} cr
            </p>
          </div>
          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-accent transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove item?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Remove {e.name} from this character&apos;s inventory?
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

        {e.bonusHint && (
          <div className="mb-2 flex items-start gap-1.5 rounded-md bg-amber-50 px-3 py-2 text-amber-800 dark:bg-amber-950/30 dark:text-amber-300">
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span className="text-xs">{e.bonusHint}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <StatCell label="Bulk" value={e.bulk} />
          {isAmmo && e.ammoType && (
            <StatCell label="Type" value={AMMO_TYPE_LABELS[e.ammoType] ?? e.ammoType} />
          )}
          {isAmmo && isOwner && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Units</span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-7 w-7" disabled={entry.quantity <= 1} onClick={() => handleUnitChange(-1)}>
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-6 text-center text-sm font-medium tabular-nums">{entry.quantity}</span>
                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleUnitChange(1)}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
          {isAmmo && !isOwner && (
            <StatCell label="Units" value={entry.quantity} />
          )}
          {isAmmo && capacity > 0 && isOwner && (
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Charges</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={isEmpty}
                  onClick={handleDecrement}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-14 text-center text-sm font-medium tabular-nums">
                  {totalCharges} / {totalCapacity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  disabled={isFull}
                  onClick={handleIncrement}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleReload}
                  title="Reload — resets charges to full, uses 1 unit if you have spares"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
          {isAmmo && capacity > 0 && !isOwner && (
            <StatCell label="Charges" value={`${totalCharges} / ${totalCapacity}`} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

type FilterTab = "all" | "augmentations" | "ammunition";

type Props = {
  allEquipment: Equipment[];
};

export default function EquipmentInventory({ allEquipment }: Props) {
  const { characterId, isOwner, equipmentInventory: inventory, setEquipmentInventory: onInventoryChange } = useCharacter();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerFilter, setPickerFilter] = useState<FilterTab>("all");
  const [, startTransition] = useTransition();
  const optimisticCounter = useRef(0);

  const carriedIds = new Set(inventory.map((e) => e.equipmentId));

  const augmentations = inventory.filter((e) => AUGMENTATION_CATEGORIES.includes(e.equipment.category));
  const ammunition = inventory.filter((e) => e.equipment.category === "ammunition");

  function handleRemoved(id: string) {
    onInventoryChange(inventory.filter((e) => e.id !== id));
  }

  function handleQuantityChange(id: string, quantity: number) {
    onInventoryChange(inventory.map((e) => e.id === id ? { ...e, quantity } : e));
  }

  function handleChargesChange(id: string, currentCharges: number | null) {
    onInventoryChange(inventory.map((e) => e.id === id ? { ...e, currentCharges } : e));
  }

  function handleAdd(item: Equipment) {
    setPickerOpen(false);
    const optimisticId = `optimistic-${item.id}-${++optimisticCounter.current}`;
    const optimistic: CharacterEquipmentEntry = {
      id: optimisticId,
      equipmentId: item.id,
      quantity: 1,
      currentCharges: null,
      equipment: item,
    };
    const withOptimistic = [...inventory, optimistic];
    onInventoryChange(withOptimistic);
    startTransition(async () => {
      const result = await addEquipmentAction(characterId, item.id);
      if (!result.success || !result.entry) {
        onInventoryChange(inventory.filter((e) => e.id !== optimisticId));
      } else {
        onInventoryChange(withOptimistic.map((e) => e.id === optimisticId ? result.entry! : e));
      }
    });
  }

  const pickerItems = allEquipment.filter((e) => {
    if (e.category !== "ammunition" && carriedIds.has(e.id)) return false;
    if (pickerFilter === "augmentations") return AUGMENTATION_CATEGORIES.includes(e.category);
    if (pickerFilter === "ammunition") return e.category === "ammunition";
    return true;
  });

  return (
    <div>
      <h3 className="mb-2 block bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">Equipment</h3>

      <div className="mb-3">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Augmentations &amp; Upgrades</p>
        {augmentations.length === 0 ? (
          <p className="mb-3 text-sm text-muted-foreground">No augmentations in inventory.</p>
        ) : (
          <div className="mb-3 flex flex-col gap-3">
            {augmentations.map((entry) => (
              <EquipmentCard
                key={entry.id}
                entry={entry}
                characterId={characterId}
                isOwner={isOwner}
                onRemoved={handleRemoved}
                onQuantityChange={handleQuantityChange}
                onChargesChange={handleChargesChange}
              />
            ))}
          </div>
        )}

        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ammunition</p>
        {ammunition.length === 0 ? (
          <p className="mb-3 text-sm text-muted-foreground">No ammunition in inventory.</p>
        ) : (
          <div className="mb-3 flex flex-col gap-3">
            {ammunition.map((entry) => (
              <EquipmentCard
                key={entry.id}
                entry={entry}
                characterId={characterId}
                isOwner={isOwner}
                onRemoved={handleRemoved}
                onQuantityChange={handleQuantityChange}
                onChargesChange={handleChargesChange}
              />
            ))}
          </div>
        )}
      </div>

      {isOwner && (
        <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
          <DialogTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}>
            <Plus className="h-3.5 w-3.5" />
            Add Equipment
          </DialogTrigger>
          <DialogContent className="max-w-sm p-0">
            <DialogHeader className="px-4 pt-4">
              <DialogTitle>Add Equipment</DialogTitle>
            </DialogHeader>
            <div className="flex border-b">
              {(["all", "augmentations", "ammunition"] as FilterTab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setPickerFilter(tab)}
                  className={cn(
                    "flex-1 px-2 py-1.5 text-xs font-medium transition-colors",
                    pickerFilter === tab
                      ? "border-b-2 border-primary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab === "all" ? "All" : tab === "augmentations" ? "Augments" : "Ammo"}
                </button>
              ))}
            </div>
            <Command>
              <CommandInput placeholder="Search equipment…" className="h-8" />
              <CommandList>
                <CommandEmpty>No equipment found.</CommandEmpty>
                <CommandGroup>
                  {pickerItems.map((item) => (
                    <CommandItem key={item.id} value={item.name} onSelect={() => handleAdd(item)}>
                      <span>{item.name}</span>
                      <span className="ml-auto text-xs text-muted-foreground">Lv{item.itemLevel}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
