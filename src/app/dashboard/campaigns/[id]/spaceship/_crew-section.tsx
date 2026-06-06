"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { Character, SpaceshipCrew, CrewRole } from "@/db/schema";
import { assignCrewAction, removeCrewAction } from "./actions";

const SINGLETON_ROLES: { role: CrewRole; label: string }[] = [
  { role: "captain", label: "Captain" },
  { role: "pilot", label: "Pilot" },
];

const MULTI_ROLES: { role: CrewRole; label: string }[] = [
  { role: "engineer", label: "Engineers" },
  { role: "gunner", label: "Gunners" },
  { role: "science_officer", label: "Science Officers" },
];

type Props = {
  campaignId: string;
  spaceshipId: string;
  characters: Character[];
  initialCrew: SpaceshipCrew[];
};

export default function CrewSection({ campaignId, spaceshipId, characters, initialCrew }: Props) {
  const [crew, setCrew] = useState<SpaceshipCrew[]>(initialCrew);
  const [multiSelects, setMultiSelects] = useState<Record<string, string>>({
    engineer: "",
    gunner: "",
    science_officer: "",
  });

  function crewForRole(role: CrewRole) {
    return crew.filter((c) => c.role === role);
  }

  function characterName(characterId: string) {
    return characters.find((c) => c.id === characterId)?.name ?? "Unknown";
  }

  async function handleSingletonChange(role: CrewRole, characterId: string) {
    if (!characterId) return;
    const result = await assignCrewAction(campaignId, spaceshipId, characterId, role);
    if (result.success) {
      setCrew((prev) => [...prev.filter((c) => c.role !== role), result.crew]);
    }
  }

  async function handleClearSingleton(role: CrewRole, crewId: string) {
    const result = await removeCrewAction(campaignId, crewId);
    if (result.success) {
      setCrew((prev) => prev.filter((c) => c.id !== crewId));
    }
  }

  async function handleAddMulti(role: CrewRole) {
    const characterId = multiSelects[role];
    if (!characterId) return;
    const result = await assignCrewAction(campaignId, spaceshipId, characterId, role);
    if (result.success) {
      setCrew((prev) => [...prev, result.crew]);
      setMultiSelects((prev) => ({ ...prev, [role]: "" }));
    }
  }

  async function handleRemoveMultiAndResetSelect(crewId: string, role: CrewRole, characterId: string) {
    const result = await removeCrewAction(campaignId, crewId);
    if (result.success) {
      setCrew((prev) => prev.filter((c) => c.id !== crewId));
      setMultiSelects((prev) => {
        if (prev[role] === characterId) return { ...prev, [role]: "" };
        return prev;
      });
    }
  }



  return (
    <div className="border-t pt-5">
      <h2 className="text-sm font-semibold mb-4">Crew</h2>
      <div className="flex flex-col gap-5">
        {SINGLETON_ROLES.map(({ role, label }) => {
          const assigned = crewForRole(role)[0];
          return (
            <div key={role} className="flex flex-col gap-1.5">
              <Label>{label}</Label>
              {assigned ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm">{characterName(assigned.characterId)}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleClearSingleton(role, assigned.id)}
                    aria-label={`Remove ${label}`}
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <select
                  className="h-9 w-48 rounded-md border border-input bg-background px-3 text-sm"
                  defaultValue=""
                  onChange={(e) => handleSingletonChange(role, e.target.value)}
                >
                  <option value="" disabled>— select —</option>
                  {characters.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>
          );
        })}

        {MULTI_ROLES.map(({ role, label }) => {
          const assigned = crewForRole(role);
          const assignedIds = new Set(assigned.map((c) => c.characterId));
          const available = characters.filter((c) => !assignedIds.has(c.id));
          return (
            <div key={role} className="flex flex-col gap-1.5">
              <Label>{label}</Label>
              {assigned.length > 0 && (
                <div className="flex flex-col gap-1 mb-1">
                  {assigned.map((c) => (
                    <div key={c.id} className="flex items-center gap-2 text-sm">
                      <span>{characterName(c.characterId)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemoveMultiAndResetSelect(c.id, role, c.characterId)}
                        aria-label={`Remove from ${label}`}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <select
                  className="h-9 w-48 rounded-md border border-input bg-background px-3 text-sm"
                  value={multiSelects[role]}
                  onChange={(e) => setMultiSelects((prev) => ({ ...prev, [role]: e.target.value }))}
                >
                  <option value="" disabled>— select —</option>
                  {available.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAddMulti(role)}
                  disabled={!multiSelects[role]}
                  className="h-9"
                >
                  Add
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
