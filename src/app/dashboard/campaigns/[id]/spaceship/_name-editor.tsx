"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Spaceship } from "@/db/schema";
import { updateSpaceshipAction } from "./actions";

type Props = {
  campaignId: string;
  spaceship: Spaceship;
};

type TextField = "name" | "makeAndModel" | "speed" | "size" | "frame";
type NumField = "pilotRank" | "sizeMod" | "armorBonus" | "acMiscMod" | "countermeasures" | "tlMiscMod";

const TEXT_FIELDS: { field: TextField; label: string }[] = [
  { field: "name", label: "Name" },
  { field: "makeAndModel", label: "Make and Model" },
  { field: "speed", label: "Speed" },
  { field: "size", label: "Size" },
  { field: "frame", label: "Frame" },
];

export default function SpaceshipEditor({ campaignId, spaceship }: Props) {
  const textTimers = useRef<Partial<Record<TextField, ReturnType<typeof setTimeout>>>>({});
  const numTimers = useRef<Partial<Record<NumField, ReturnType<typeof setTimeout>>>>({});

  const [driftRating, setDriftRating] = useState(spaceship.driftRating);
  const [pilotRank, setPilotRank] = useState(spaceship.pilotRank);
  const [sizeMod, setSizeMod] = useState(spaceship.sizeMod);
  const [armorBonus, setArmorBonus] = useState(spaceship.armorBonus);
  const [acMiscMod, setAcMiscMod] = useState(spaceship.acMiscMod);
  const [countermeasures, setCountermeasures] = useState(spaceship.countermeasures);
  const [tlMiscMod, setTlMiscMod] = useState(spaceship.tlMiscMod);

  const ac = 10 + pilotRank + armorBonus + sizeMod + acMiscMod;
  const tl = 10 + pilotRank + countermeasures + sizeMod + tlMiscMod;

  const setters: Record<NumField, (v: number) => void> = {
    pilotRank: setPilotRank,
    sizeMod: setSizeMod,
    armorBonus: setArmorBonus,
    acMiscMod: setAcMiscMod,
    countermeasures: setCountermeasures,
    tlMiscMod: setTlMiscMod,
  };

  function handleTextChange(field: TextField, value: string) {
    if (textTimers.current[field]) clearTimeout(textTimers.current[field]);
    textTimers.current[field] = setTimeout(() => {
      updateSpaceshipAction(campaignId, spaceship.id, { [field]: value || null });
    }, 600);
  }

  function handleNumChange(field: NumField, raw: string) {
    const value = parseInt(raw, 10);
    const next = isNaN(value) ? 0 : value;
    setters[field](next);
    if (numTimers.current[field]) clearTimeout(numTimers.current[field]);
    numTimers.current[field] = setTimeout(() => {
      updateSpaceshipAction(campaignId, spaceship.id, { [field]: next });
    }, 600);
  }

  async function changeDrift(next: number) {
    if (next < 0) return;
    setDriftRating(next);
    await updateSpaceshipAction(campaignId, spaceship.id, { driftRating: next });
  }

  return (
    <div className="flex flex-col gap-5 max-w-sm">
      {TEXT_FIELDS.map(({ field, label }) => (
        <div key={field} className="flex flex-col gap-1.5">
          <Label htmlFor={`ship-${field}`}>{label}</Label>
          <Input
            id={`ship-${field}`}
            defaultValue={spaceship[field] ?? ""}
            onChange={(e) => handleTextChange(field, e.target.value)}
          />
        </div>
      ))}

      <div className="flex flex-col gap-1.5">
        <Label>Drift Rating</Label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => changeDrift(driftRating - 1)}
            disabled={driftRating <= 0}
            aria-label="Decrease drift rating"
          >
            −
          </Button>
          <span className="w-6 text-center text-sm font-medium">{driftRating}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => changeDrift(driftRating + 1)}
            aria-label="Increase drift rating"
          >
            +
          </Button>
        </div>
      </div>

      <div className="border-t pt-5">
        <h2 className="text-sm font-semibold mb-4">Defensive Scores</h2>

        <div className="flex flex-col gap-3 mb-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ship-pilotRank">Pilot Rank</Label>
            <Input
              id="ship-pilotRank"
              type="number"
              value={pilotRank}
              onChange={(e) => handleNumChange("pilotRank", e.target.value)}
              className="w-24"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ship-sizeMod">Size Mod</Label>
            <Input
              id="ship-sizeMod"
              type="number"
              value={sizeMod}
              onChange={(e) => handleNumChange("sizeMod", e.target.value)}
              className="w-24"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">AC</div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ship-armorBonus">Armor Bonus</Label>
              <Input
                id="ship-armorBonus"
                type="number"
                value={armorBonus}
                onChange={(e) => handleNumChange("armorBonus", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ship-acMiscMod">Misc Mod</Label>
              <Input
                id="ship-acMiscMod"
                type="number"
                value={acMiscMod}
                onChange={(e) => handleNumChange("acMiscMod", e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between pt-1 border-t">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold">{ac}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">TL</div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ship-countermeasures">Countermeasures</Label>
              <Input
                id="ship-countermeasures"
                type="number"
                value={countermeasures}
                onChange={(e) => handleNumChange("countermeasures", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ship-tlMiscMod">Misc Mod</Label>
              <Input
                id="ship-tlMiscMod"
                type="number"
                value={tlMiscMod}
                onChange={(e) => handleNumChange("tlMiscMod", e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between pt-1 border-t">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-xl font-bold">{tl}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
