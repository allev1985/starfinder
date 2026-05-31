"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
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
import { removeWeaponAction } from "../actions";
import type { Weapon } from "@/db/schema";

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

function StatCell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function formatDamage(weapon: Weapon): string {
  return `${weapon.damageDice} ${weapon.damageTypes.join(" & ")}`;
}

function formatCritical(weapon: Weapon): string {
  if (!weapon.criticalEffect) return "—";
  if (weapon.criticalDice) return `${weapon.criticalEffect} ${weapon.criticalDice}`;
  return weapon.criticalEffect;
}

type Props = {
  weapon: Weapon;
  characterId: string;
  isOwner: boolean;
  onWeaponRemoved: (weaponId: string) => void;
};

export default function WeaponCard({ weapon, characterId, isOwner, onWeaponRemoved }: Props) {
  const [, startTransition] = useTransition();
  const [removing, setRemoving] = useState(false);

  function handleRemove() {
    setRemoving(true);
    onWeaponRemoved(weapon.id);
    startTransition(() => {
      removeWeaponAction(characterId, weapon.id);
    });
  }

  if (removing) return null;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <p className="text-sm font-semibold">{weapon.name}</p>
            <p className="text-xs text-muted-foreground">
              Level {weapon.itemLevel} · {CATEGORY_LABELS[weapon.category] ?? weapon.category}
              {weapon.ammoType ? ` · Uses: ${AMMO_TYPE_LABELS[weapon.ammoType] ?? weapon.ammoType}` : ""}
            </p>
          </div>
          {isOwner && (
            <AlertDialog>
              <AlertDialogTrigger className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-accent transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove weapon?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Remove {weapon.name} from this character&apos;s inventory?
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
        <div className="grid grid-cols-3 gap-x-4 gap-y-2">
          <StatCell label="Damage" value={formatDamage(weapon)} />
          <StatCell label="Critical" value={formatCritical(weapon)} />
          <StatCell label="Range" value={weapon.range ?? "—"} />
          <StatCell label="Capacity" value={weapon.capacity ?? "—"} />
          <StatCell label="Usage" value={weapon.usage ?? "—"} />
          <StatCell label="Bulk" value={weapon.bulk} />
          <div className="col-span-3">
            <StatCell label="Special" value={weapon.special ?? "—"} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
