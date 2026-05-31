"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCharacterAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Race, Class, Theme, Chassis, Skill } from "@/db/schema";

const SELECT_CLASS = "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

interface Props {
  races: Race[];
  classes: Class[];
  themes: Theme[];
  chassisList: Chassis[];
  droneSkills: Skill[];
}

export default function NewCharacterForm({ races, classes, themes, chassisList, droneSkills }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [chassisError, setChassisError] = useState<string | null>(null);
  const [skillUnitError, setSkillUnitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedRaceId, setSelectedRaceId] = useState("");
  const [selectedChassisId, setSelectedChassisId] = useState("");
  const [selectedSkillUnitId, setSelectedSkillUnitId] = useState("");

  const selectedRace = races.find((r) => r.id === selectedRaceId) ?? null;
  const isDrone = selectedRace?.type === "drone";

  const selectedChassis = chassisList.find((c) => c.id === selectedChassisId) ?? null;
  const bonusSkillId = selectedChassis?.bonusSkillId ?? null;
  const skillUnitOptions = droneSkills.filter((s) => s.id !== bonusSkillId);

  function handleChassisChange(id: string) {
    setSelectedChassisId(id);
    const chassis = chassisList.find((c) => c.id === id);
    if (chassis?.bonusSkillId && selectedSkillUnitId === chassis.bonusSkillId) {
      setSelectedSkillUnitId("");
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setChassisError(null);
    setSkillUnitError(null);

    const formData = new FormData(e.currentTarget);
    if (isDrone && !formData.get("chassisId")) {
      setChassisError("Chassis is required for drone characters.");
      return;
    }
    if (isDrone && !formData.get("skillUnitSkillId")) {
      setSkillUnitError("Skill Unit is required for drone characters.");
      return;
    }

    setLoading(true);
    const result = await createCharacterAction(formData);
    setLoading(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    router.push(`/dashboard/characters/${result.characterId}`);
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>New Character</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Vex the Soldier"
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="raceId">Race</Label>
            <select
              id="raceId"
              name="raceId"
              required
              defaultValue=""
              className={SELECT_CLASS}
              onChange={(e) => {
                setSelectedRaceId(e.target.value);
                setSelectedChassisId("");
                setSelectedSkillUnitId("");
              }}
            >
              <option value="" disabled>Select a race…</option>
              {races.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          {isDrone && (
            <>
              <div className="flex flex-col gap-2">
                <Label htmlFor="chassisId">Chassis</Label>
                <select
                  id="chassisId"
                  name="chassisId"
                  value={selectedChassisId}
                  className={SELECT_CLASS}
                  onChange={(e) => handleChassisChange(e.target.value)}
                >
                  <option value="" disabled>Select a chassis…</option>
                  {chassisList.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {chassisError && <p className="text-destructive text-sm">{chassisError}</p>}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="skillUnitSkillId">Skill Unit</Label>
                <select
                  id="skillUnitSkillId"
                  name="skillUnitSkillId"
                  value={selectedSkillUnitId}
                  className={SELECT_CLASS}
                  onChange={(e) => setSelectedSkillUnitId(e.target.value)}
                >
                  <option value="" disabled>Select a skill…</option>
                  {skillUnitOptions.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                {skillUnitError && <p className="text-destructive text-sm">{skillUnitError}</p>}
              </div>
            </>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="classId">Class</Label>
            <select
              id="classId"
              name="classId"
              required
              defaultValue=""
              className={SELECT_CLASS}
            >
              <option value="" disabled>Select a class…</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {!isDrone && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="themeId">Theme</Label>
              <select
                id="themeId"
                name="themeId"
                required
                defaultValue=""
                className={SELECT_CLASS}
              >
                <option value="" disabled>Select a theme…</option>
                {themes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          )}

          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create character"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
