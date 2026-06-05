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

const TEXT_FIELDS: { field: TextField; label: string }[] = [
  { field: "name", label: "Name" },
  { field: "makeAndModel", label: "Make and Model" },
  { field: "speed", label: "Speed" },
  { field: "size", label: "Size" },
  { field: "frame", label: "Frame" },
];

export default function SpaceshipEditor({ campaignId, spaceship }: Props) {
  const timers = useRef<Partial<Record<TextField, ReturnType<typeof setTimeout>>>>({});
  const [driftRating, setDriftRating] = useState(spaceship.driftRating);

  function handleTextChange(field: TextField, value: string) {
    if (timers.current[field]) clearTimeout(timers.current[field]);
    timers.current[field] = setTimeout(() => {
      updateSpaceshipAction(campaignId, spaceship.id, { [field]: value || null });
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
    </div>
  );
}
