"use client";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
import { modifier } from "@/lib/ability";
import {
  updateSkillRanksAction,
  updateSkillMiscModAction,
  removeCharacterSkillAction,
} from "../actions";
import AddSkillsDialog from "./add-skills-dialog";
import type { SkillWithClassFlag } from "@/db/queries/reference";
import type { CharacterSkill } from "@/db/schema";
import type { AbilityScores } from "@/db/queries/characters";

type Props = {
  characterId: string;
  initialSkills: CharacterSkill[];
  allSkills: SkillWithClassFlag[];
  scores: AbilityScores;
  skillRanksPerLevel: number;
  level: number;
  isOwner: boolean;
};

const ABILITY_KEY_MAP: Record<string, keyof AbilityScores> = {
  STR: "strScore",
  DEX: "dexScore",
  CON: "conScore",
  INT: "intScore",
  WIS: "wisScore",
  CHA: "chaScore",
};

function abilityLabel(ability: string, abilityAlts: string[] | null | undefined): string {
  if (!abilityAlts?.length) return ability;
  return [ability, ...abilityAlts].join(" / ");
}

function formatMod(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

function SkillRow({
  row,
  skill,
  ranks,
  maxRanks,
  scores,
  isOwner,
  characterId,
  onRanksChange,
  onRemove,
}: {
  row: CharacterSkill;
  skill: SkillWithClassFlag;
  ranks: number;
  maxRanks: number;
  scores: AbilityScores;
  isOwner: boolean;
  characterId: string;
  onRanksChange: (id: string, value: number) => void;
  onRemove: (id: string) => void;
}) {
  const [miscMod, setMiscMod] = useState(row.miscMod);

  const scheduleRanksSave = useDebouncedSave((v: number) =>
    updateSkillRanksAction(row.id, characterId, v)
  );
  const scheduleMiscSave = useDebouncedSave((v: number) =>
    updateSkillMiscModAction(row.id, characterId, v)
  );

  const effectiveAbility = row.abilityOverride ?? skill.ability;
  const abilityKey = ABILITY_KEY_MAP[effectiveAbility] ?? "intScore";
  const abilityMod = modifier(scores[abilityKey]);
  const classBonus = skill.isClassSkill && ranks > 0 ? 3 : 0;
  const total = ranks + classBonus + abilityMod + miscMod;

  function handleRanksChange(raw: string) {
    const parsed = parseInt(raw, 10);
    const v = Math.min(Math.max(0, isNaN(parsed) ? 0 : parsed), maxRanks);
    onRanksChange(row.id, v);
    scheduleRanksSave(v);
  }

  function handleMiscChange(raw: string) {
    const v = parseInt(raw, 10);
    const next = isNaN(v) ? 0 : v;
    setMiscMod(next);
    scheduleMiscSave(next);
  }

  async function handleRemove() {
    await removeCharacterSkillAction(row.id, characterId);
    onRemove(row.id);
  }

  const skillName = row.label ? `${skill.name} (${row.label})` : skill.name;

  return (
    <>
      <span className="text-sm font-medium">
        {skill.isClassSkill && <span className="mr-1 text-amber-500">★</span>}
        {skillName}
      </span>
      <span className="text-xs text-muted-foreground text-center">
        {row.abilityOverride ?? abilityLabel(skill.ability, skill.abilityAlts)}
      </span>
      {isOwner ? (
        <Input
          type="number"
          min={0}
          max={maxRanks}
          value={ranks}
          onChange={(e) => handleRanksChange(e.target.value)}
          className="h-7 text-sm text-center"
        />
      ) : (
        <span className="text-sm text-center">{ranks}</span>
      )}
      <span className="text-sm text-center text-muted-foreground">
        {classBonus > 0 ? `+${classBonus}` : "—"}
      </span>
      <span className="text-sm text-center text-muted-foreground">{formatMod(abilityMod)}</span>
      {isOwner ? (
        <Input
          type="number"
          value={miscMod}
          onChange={(e) => handleMiscChange(e.target.value)}
          className="h-7 text-sm text-center"
        />
      ) : (
        <span className="text-sm text-center">{formatMod(miscMod)}</span>
      )}
      <span className="text-sm font-semibold text-center">{formatMod(total)}</span>
      {isOwner && skill.trainedOnly ? (
        <button
          type="button"
          onClick={handleRemove}
          className="text-muted-foreground hover:text-destructive justify-self-center"
          aria-label="Remove skill"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ) : (
        <span />
      )}
    </>
  );
}

export default function SkillsSection({
  characterId,
  initialSkills,
  allSkills,
  scores,
  skillRanksPerLevel,
  level,
  isOwner,
}: Props) {
  const router = useRouter();
  const [removedIds, setRemovedIds] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogKey, setDialogKey] = useState(0);
  // Tracks live rank edits so the budget counter stays accurate across all rows.
  // Falls back to server value for any row not yet edited.
  const [rankOverrides, setRankOverrides] = useState<Map<string, number>>(new Map());

  const visibleSkills = initialSkills.filter((s) => !removedIds.has(s.id));

  const intMod = modifier(scores.intScore);
  const ranksPerLevel = Math.max(1, skillRanksPerLevel + intMod);
  const totalAvailable = ranksPerLevel * level;
  const ranksUsed = visibleSkills.reduce(
    (acc, s) => acc + (rankOverrides.get(s.id) ?? s.ranks),
    0
  );
  const remaining = totalAvailable - ranksUsed;

  const skillMap = new Map(allSkills.map((s) => [s.id, s]));

  const sortedSkills = [...visibleSkills].sort((a, b) => {
    const aName = skillMap.get(a.skillId)?.name ?? "";
    const bName = skillMap.get(b.skillId)?.name ?? "";
    if (aName !== bName) return aName.localeCompare(bName);
    return (a.label ?? "").localeCompare(b.label ?? "");
  });

  function handleRanksChange(id: string, value: number) {
    setRankOverrides((prev) => new Map(prev).set(id, value));
  }

  function handleRemove(id: string) {
    setRemovedIds((prev) => new Set([...prev, id]));
    setRankOverrides((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }

  function handleSaved() {
    setRemovedIds(new Set());
    setRankOverrides(new Map());
    router.refresh();
  }

  function openDialog() {
    setDialogKey((k) => k + 1);
    setDialogOpen(true);
  }

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Skills
          </h2>
          <span className="text-xs text-muted-foreground">
            <span className="text-amber-500">★</span> Class skill (+3 bonus when ranks &gt; 0)
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className={`text-xs ${remaining < 0 ? "text-destructive font-medium" : "text-muted-foreground"}`}>
            Ranks: {ranksUsed} / {totalAvailable}
          </span>
          {isOwner && (
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={openDialog}>
              + Add Skills
            </Button>
          )}
        </div>
      </div>

      {visibleSkills.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No skills added yet.{" "}
          {isOwner && (
            <button type="button" className="underline hover:text-foreground" onClick={openDialog}>
              Add skills
            </button>
          )}
        </p>
      ) : (
        <div className="grid grid-cols-[1fr_4.5rem_3.5rem_3.5rem_3rem_3.5rem_3rem_2rem] items-center gap-x-2 gap-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Skill</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Ability</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Ranks</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Class</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Mod</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Misc</span>
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground text-center">Total</span>
          <span />
          {sortedSkills.map((row) => {
            const skill = allSkills.find((s) => s.id === row.skillId);
            if (!skill) return null;
            const currentRanks = rankOverrides.get(row.id) ?? row.ranks;
            // This row can go up to its current value plus whatever budget is unspent
            const maxRanks = currentRanks + Math.max(0, remaining);
            return (
              <Fragment key={row.id}>
                <SkillRow
                  row={row}
                  skill={skill}
                  ranks={currentRanks}
                  maxRanks={maxRanks}
                  scores={scores}
                  isOwner={isOwner}
                  characterId={characterId}
                  onRanksChange={handleRanksChange}
                  onRemove={handleRemove}
                />
              </Fragment>
            );
          })}
        </div>
      )}

      {isOwner && (
        <AddSkillsDialog
          key={dialogKey}
          allSkills={allSkills}
          existingSkills={visibleSkills}
          characterId={characterId}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSaved={handleSaved}
        />
      )}
    </section>
  );
}
