"use client";

import { useState } from "react";
import ArmorInventory from "./armor-inventory";
import WeaponCard from "./weapon-card";
import WeaponPicker from "./weapon-picker";
import EquipmentInventory from "./equipment-inventory";
import type { Armor, Weapon, Equipment } from "@/db/schema";
import type { CharacterArmorEntry, CharacterEquipmentEntry } from "@/db/queries/characters";

type Props = {
  characterId: string;
  isOwner: boolean;
  initialCharacterArmor: CharacterArmorEntry[];
  availableArmor: Armor[];
  onWornArmorChange: (armor: Armor | null) => void;
  allWeapons: Weapon[];
  initialCarriedWeapons: Weapon[];
  allEquipment: Equipment[];
  initialCharacterEquipment: CharacterEquipmentEntry[];
};

export default function InventorySection({
  characterId,
  isOwner,
  initialCharacterArmor,
  availableArmor,
  onWornArmorChange,
  allWeapons,
  initialCarriedWeapons,
  allEquipment,
  initialCharacterEquipment,
}: Props) {
  const [carriedWeapons, setCarriedWeapons] = useState<Weapon[]>(initialCarriedWeapons);

  function handleWeaponAdded(weapon: Weapon) {
    setCarriedWeapons((prev) => [...prev, weapon]);
  }

  function handleWeaponRemoved(weaponId: string) {
    setCarriedWeapons((prev) => prev.filter((w) => w.id !== weaponId));
  }

  const carriedWeaponIds = new Set(carriedWeapons.map((w) => w.id));

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Inventory
      </h2>

      <ArmorInventory
        characterId={characterId}
        isOwner={isOwner}
        initialCharacterArmor={initialCharacterArmor}
        availableArmor={availableArmor}
        onWornArmorChange={onWornArmorChange}
      />

      <div>
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Weapons</h3>
        {carriedWeapons.length === 0 ? (
          <p className="mb-3 text-sm text-muted-foreground">No weapons in inventory.</p>
        ) : (
          <div className="mb-3 flex flex-col gap-3">
            {carriedWeapons.map((weapon) => (
              <WeaponCard
                key={weapon.id}
                weapon={weapon}
                characterId={characterId}
                isOwner={isOwner}
                onWeaponRemoved={handleWeaponRemoved}
              />
            ))}
          </div>
        )}
        {isOwner && (
          <WeaponPicker
            allWeapons={allWeapons}
            carriedWeaponIds={carriedWeaponIds}
            characterId={characterId}
            onWeaponAdded={handleWeaponAdded}
          />
        )}
      </div>

      <EquipmentInventory
        characterId={characterId}
        isOwner={isOwner}
        allEquipment={allEquipment}
        initialCharacterEquipment={initialCharacterEquipment}
      />
    </section>
  );
}
