"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { saveCharacterSkillsAction } from "../actions";
import type { SkillWithClassFlag } from "@/db/queries/reference";
import type { CharacterSkill } from "@/db/schema";

const PROFESSION_NAME = "Profession";

function abilityLabel(ability: string, abilityAlts: string[] | null | undefined): string {
  if (!abilityAlts?.length) return ability;
  return [ability, ...abilityAlts].join(" / ");
}

type Props = {
  allSkills: SkillWithClassFlag[];
  existingSkills: CharacterSkill[];
  characterId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
  allowedSkillIds?: Set<string>;
};

type ProfessionEntry = { tempId: string; label: string; ability: string; existingId?: string };

export default function AddSkillsDialog({
  allSkills,
  existingSkills,
  characterId,
  open,
  onOpenChange,
  onSaved,
  allowedSkillIds,
}: Props) {
  const professionSkill = allSkills.find((s) => s.name === PROFESSION_NAME);
  const trainedOnlyIds = new Set(allSkills.filter((s) => s.trainedOnly).map((s) => s.id));
  const existingSkillIds = new Set(
    existingSkills
      .filter((s) => {
        if (s.skillId === professionSkill?.id) return false;
        if (allowedSkillIds) return allowedSkillIds.has(s.skillId);
        return trainedOnlyIds.has(s.skillId);
      })
      .map((s) => s.skillId)
  );
  const existingProfessions = existingSkills.filter(
    (s) => s.skillId === professionSkill?.id
  );

  const [checked, setChecked] = useState<Set<string>>(() => new Set(existingSkillIds));
  const professionAbilities = professionSkill
    ? [professionSkill.ability, ...(professionSkill.abilityAlts ?? [])]
    : ["WIS"];
  const defaultAbility = professionAbilities[0];

  const [professionChecked, setProfessionChecked] = useState(existingProfessions.length > 0);
  const [professions, setProfessions] = useState<ProfessionEntry[]>(() =>
    existingProfessions.length > 0
      ? existingProfessions.map((p) => ({
          tempId: p.id,
          label: p.label ?? "",
          ability: p.abilityOverride ?? defaultAbility,
          existingId: p.id,
        }))
      : [{ tempId: crypto.randomUUID(), label: "", ability: defaultAbility }]
  );
  const [saving, setSaving] = useState(false);

  function toggleSkill(skillId: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(skillId)) next.delete(skillId);
      else next.add(skillId);
      return next;
    });
  }

  function addProfessionEntry() {
    setProfessions((prev) => [...prev, { tempId: crypto.randomUUID(), label: "", ability: defaultAbility }]);
  }

  function removeProfessionEntry(tempId: string) {
    setProfessions((prev) => prev.filter((p) => p.tempId !== tempId));
  }

  function updateProfessionLabel(tempId: string, label: string) {
    setProfessions((prev) =>
      prev.map((p) => (p.tempId === tempId ? { ...p, label } : p))
    );
  }

  function updateProfessionAbility(tempId: string, ability: string) {
    setProfessions((prev) =>
      prev.map((p) => (p.tempId === tempId ? { ...p, ability } : p))
    );
  }

  async function handleSave() {
    setSaving(true);

    const added = [];
    const removedBySkillId: { skillId: string }[] = [];
    const removedIds: string[] = [];

    // Non-profession skills: diff against existing
    for (const skill of allSkills) {
      if (skill.name === PROFESSION_NAME) continue;
      const wasPresent = existingSkillIds.has(skill.id);
      const isNowChecked = checked.has(skill.id);
      if (!wasPresent && isNowChecked) {
        added.push({ skillId: skill.id, label: null, ranks: 0, miscMod: 0 });
      } else if (wasPresent && !isNowChecked) {
        removedBySkillId.push({ skillId: skill.id });
      }
    }

    // Profession entries
    if (professionSkill) {
      // Remove all existing profession entries upfront; re-add the current list
      if (existingProfessions.length > 0) {
        removedBySkillId.push({ skillId: professionSkill.id });
      }
      if (professionChecked) {
        for (const entry of professions) {
          const label = entry.label.trim();
          if (label) {
            added.push({ skillId: professionSkill.id, label, abilityOverride: entry.ability, ranks: 0, miscMod: 0 });
          }
        }
      }
    }

    const result = await saveCharacterSkillsAction(characterId, added, removedIds, removedBySkillId);
    setSaving(false);
    if (result.success) {
      onOpenChange(false);
      onSaved();
    }
  }

  const nonProfessionSkills = allSkills.filter((s) => {
    if (s.name === PROFESSION_NAME) return false;
    if (allowedSkillIds) return allowedSkillIds.has(s.id);
    return s.trainedOnly;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Skills</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-1 pr-1">
          {nonProfessionSkills.map((skill) => (
            <label
              key={skill.id}
              className="flex items-center gap-3 rounded px-2 py-1.5 hover:bg-muted cursor-pointer"
            >
              <Checkbox
                checked={checked.has(skill.id)}
                onCheckedChange={() => toggleSkill(skill.id)}
              />
              <span className="text-sm flex-1">
                {skill.isClassSkill && <span className="mr-1 text-amber-500">★</span>}
                {skill.name}
              </span>
              <span className="text-xs text-muted-foreground">{abilityLabel(skill.ability, skill.abilityAlts)}</span>
            </label>
          ))}

          {professionSkill && !allowedSkillIds && (
            <div className="rounded px-2 py-1.5">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={professionChecked}
                  onCheckedChange={(v) => setProfessionChecked(!!v)}
                />
                <span className="text-sm flex-1">
                  {professionSkill.isClassSkill && (
                    <span className="mr-1 text-amber-500">★</span>
                  )}
                  {professionSkill.name}
                </span>
                <span className="text-xs text-muted-foreground">{abilityLabel(professionSkill.ability, professionSkill.abilityAlts)}</span>
              </label>

              {professionChecked && (
                <div className="mt-2 ml-7 space-y-2">
                  {professions.map((entry) => (
                    <div key={entry.tempId} className="flex items-center gap-2">
                      <Input
                        placeholder="Specialization (e.g. Doctor)"
                        value={entry.label}
                        onChange={(e) => updateProfessionLabel(entry.tempId, e.target.value)}
                        className="h-7 text-sm"
                      />
                      <select
                        value={entry.ability}
                        onChange={(e) => updateProfessionAbility(entry.tempId, e.target.value)}
                        className="h-7 rounded-md border border-input bg-background px-2 text-xs text-foreground"
                      >
                        {professionAbilities.map((a) => (
                          <option key={a} value={a}>{a}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => removeProfessionEntry(entry.tempId)}
                        className="text-muted-foreground hover:text-foreground"
                        aria-label="Remove profession entry"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addProfessionEntry}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <Plus className="h-3 w-3" />
                    Add profession
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
