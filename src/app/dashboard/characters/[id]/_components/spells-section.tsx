"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2, Moon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  addSpellAction,
  removeSpellAction,
  fetchSpellsKnownLimitsAction,
  fetchSpellsPerDayAction,
  upsertSpellSlotsAction,
  longRestAction,
} from "../actions";
import type { Spell, CharacterSpell, CharacterSpellSlot } from "@/db/schema";
import { useCharacter } from "./character-context";
import { useDebouncedSave } from "@/hooks/use-debounced-save";

type CharacterSpellWithSpell = CharacterSpell & { spell: Spell };

const SCHOOL_LABELS: Record<string, string> = {
  abjuration: "Abjuration",
  conjuration: "Conjuration",
  divination: "Divination",
  enchantment: "Enchantment",
  evocation: "Evocation",
  illusion: "Illusion",
  necromancy: "Necromancy",
  transmutation: "Transmutation",
  universal: "Universal",
};

type SlotState = { totalSlots: number; usedSlots: number };
type SlotMap = Record<number, SlotState>;

function SlotTracker({
  spellLevel,
  totalSlots,
  usedSlots,
  isOwner,
  onTotalChange,
  onUsedChange,
}: {
  spellLevel: number;
  totalSlots: number;
  usedSlots: number;
  isOwner: boolean;
  onTotalChange: (total: number) => void;
  onUsedChange: (used: number) => void;
}) {
  const remaining = totalSlots - usedSlots;

  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-xs text-muted-foreground font-medium">Slots</span>
        <span className="text-xs tabular-nums font-medium">{remaining}</span>
        <span className="text-xs text-muted-foreground">/</span>
        {isOwner ? (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onTotalChange(Math.max(0, totalSlots - 1))}
              className="h-5 w-5 inline-flex items-center justify-center rounded border border-input text-xs hover:bg-accent transition-colors leading-none"
              aria-label={`Decrease level ${spellLevel} max slots`}
            >
              −
            </button>
            <span className="text-xs tabular-nums font-medium w-4 text-center">{totalSlots}</span>
            <button
              onClick={() => onTotalChange(totalSlots + 1)}
              className="h-5 w-5 inline-flex items-center justify-center rounded border border-input text-xs hover:bg-accent transition-colors leading-none"
              aria-label={`Increase level ${spellLevel} max slots`}
            >
              +
            </button>
          </div>
        ) : (
          <span className="text-xs tabular-nums font-medium">{totalSlots}</span>
        )}
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        {Array.from({ length: totalSlots }).map((_, i) => {
          const isUsed = i >= remaining;
          return (
            <button
              key={i}
              disabled={!isOwner}
              onClick={() => {
                if (!isOwner) return;
                if (!isUsed) {
                  onUsedChange(Math.min(usedSlots + 1, totalSlots));
                } else {
                  onUsedChange(Math.max(usedSlots - 1, 0));
                }
              }}
              title={isUsed ? "Recover slot" : "Use slot"}
              className={[
                "h-4 w-4 rounded-full border transition-colors",
                isUsed
                  ? "bg-background border-muted-foreground/40"
                  : "bg-primary border-primary",
                isOwner ? "hover:opacity-70 cursor-pointer" : "cursor-default",
              ].join(" ")}
            />
          );
        })}
        {totalSlots === 0 && (
          <span className="text-xs text-muted-foreground italic">no slots set</span>
        )}
      </div>
    </div>
  );
}

function SpellCard({
  entry,
  isOwner,
  characterId,
  onRemoved,
}: {
  entry: CharacterSpellWithSpell;
  isOwner: boolean;
  characterId: string;
  onRemoved: (spellId: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [pending, startTransition] = useTransition();
  const spell = entry.spell;

  function handleRemove() {
    startTransition(async () => {
      await removeSpellAction(characterId, spell.id);
      onRemoved(spell.id);
    });
  }

  return (
    <Card className="mb-2">
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <button
            className="flex flex-1 items-center gap-2 text-left"
            onClick={() => setExpanded((v) => !v)}
          >
            <span className="font-medium text-sm">{spell.name}</span>
            <Badge variant="outline" className="text-xs shrink-0">
              {SCHOOL_LABELS[spell.school] ?? spell.school}
            </Badge>
            {spell.damage && (
              <span className="text-xs text-muted-foreground shrink-0">{spell.damage}</span>
            )}
            <span className="ml-auto text-muted-foreground">
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </span>
          </button>
          {isOwner && (
            <button
              className="h-6 w-6 shrink-0 inline-flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-accent transition-colors"
              onClick={handleRemove}
              disabled={pending}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {expanded && (
          <div className="mt-3 space-y-2 text-xs text-muted-foreground border-t pt-3">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div><span className="font-medium text-foreground">Cast:</span> {spell.castingTime}</div>
              <div><span className="font-medium text-foreground">Range:</span> {spell.range}</div>
              {spell.area && <div><span className="font-medium text-foreground">Area:</span> {spell.area}</div>}
              {spell.targets && <div><span className="font-medium text-foreground">Targets:</span> {spell.targets}</div>}
              <div><span className="font-medium text-foreground">Duration:</span> {spell.duration}</div>
              {spell.savingThrow && <div><span className="font-medium text-foreground">Save:</span> {spell.savingThrow}</div>}
              {spell.spellResist && <div><span className="font-medium text-foreground">SR:</span> {spell.spellResist}</div>}
              {spell.damage && <div><span className="font-medium text-foreground">Damage:</span> {spell.damage}</div>}
            </div>
            {spell.damageNote && (
              <p className="italic">{spell.damageNote}</p>
            )}
            <p className="text-foreground/80 leading-relaxed">{spell.description}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AddSpellDialog({
  characterId,
  spellLevel,
  availableSpells,
  isOwner,
  atLimit,
  onAdded,
}: {
  characterId: string;
  spellLevel: number;
  availableSpells: Spell[];
  isOwner: boolean;
  atLimit: boolean;
  onAdded: (spell: Spell) => void;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSelect(spell: Spell) {
    startTransition(async () => {
      await addSpellAction(characterId, spell.id, spellLevel);
      onAdded(spell);
      setOpen(false);
    });
  }

  if (!isOwner) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        disabled={atLimit}
        className="inline-flex h-7 items-center gap-1 rounded-md border border-input bg-background px-3 text-xs font-medium hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Spell
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Level {spellLevel} Spell</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput placeholder="Search spells..." />
          <CommandList className="max-h-72">
            <CommandEmpty>No spells found.</CommandEmpty>
            <CommandGroup>
              {availableSpells.map((spell) => (
                <CommandItem
                  key={spell.id}
                  value={spell.name}
                  onSelect={() => !pending && handleSelect(spell)}
                  disabled={pending}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{spell.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {SCHOOL_LABELS[spell.school] ?? spell.school}
                      {spell.damage ? ` · ${spell.damage}` : ""}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function SpellLevelPanel({
  characterId,
  spellLevel,
  known,
  catalog,
  limit,
  isOwner,
  slotState,
  onSlotTotalChange,
  onSlotUsedChange,
  onSpellAdded,
  onSpellRemoved,
}: {
  characterId: string;
  spellLevel: number;
  known: CharacterSpellWithSpell[];
  catalog: Spell[];
  limit: number;
  isOwner: boolean;
  slotState: SlotState;
  onSlotTotalChange: (total: number) => void;
  onSlotUsedChange: (used: number) => void;
  onSpellAdded: (spell: Spell) => void;
  onSpellRemoved: (spellId: string) => void;
}) {
  return (
    <div className="pt-4">
      {spellLevel > 0 && (
        <SlotTracker
          spellLevel={spellLevel}
          totalSlots={slotState.totalSlots}
          usedSlots={slotState.usedSlots}
          isOwner={isOwner}
          onTotalChange={onSlotTotalChange}
          onUsedChange={onSlotUsedChange}
        />
      )}

      {known.length === 0 ? (
        <p className="text-sm text-muted-foreground mb-3">No spells known at this level.</p>
      ) : (
        <div className="mb-3">
          {known.map((entry) => (
            <SpellCard
              key={entry.spellId}
              entry={entry}
              isOwner={isOwner}
              characterId={characterId}
              onRemoved={onSpellRemoved}
            />
          ))}
        </div>
      )}

      <AddSpellDialog
        characterId={characterId}
        spellLevel={spellLevel}
        availableSpells={catalog}
        isOwner={isOwner}
        atLimit={limit > 0 && known.length >= limit}
        onAdded={onSpellAdded}
      />
    </div>
  );
}

export default function SpellsSection({
  classId,
  knownSpells,
  spellCatalog,
  spellsKnownLimits,
  characterSpellSlots,
  spellsPerDay,
}: {
  classId: string;
  knownSpells: CharacterSpellWithSpell[];
  spellCatalog: Record<number, Spell[]>;
  spellsKnownLimits: Record<number, number>;
  characterSpellSlots: CharacterSpellSlot[];
  spellsPerDay: Record<number, number>;
}) {
  const { characterId, isOwner } = useCharacter();
  const LEVELS = [0, 1, 2, 3, 4, 5, 6] as const;
  const [limits, setLimits] = useState(spellsKnownLimits);
  const [, setPerDayDefaults] = useState(spellsPerDay);

  const initSlotMap = useCallback(
    (slots: CharacterSpellSlot[], perDay: Record<number, number>): SlotMap => {
      const map: SlotMap = {};
      for (const lvl of [1, 2, 3, 4, 5, 6]) {
        const row = slots.find((s) => s.spellLevel === lvl);
        map[lvl] = row
          ? { totalSlots: row.totalSlots, usedSlots: row.usedSlots }
          : { totalSlots: perDay[lvl] ?? 0, usedSlots: 0 };
      }
      return map;
    },
    []
  );

  const [slotMap, setSlotMap] = useState<SlotMap>(() =>
    initSlotMap(characterSpellSlots, spellsPerDay)
  );

  useEffect(() => {
    function handleLevelChange(e: Event) {
      const level = (e as CustomEvent<{ level: number }>).detail.level;
      Promise.all([
        fetchSpellsKnownLimitsAction(classId, level),
        fetchSpellsPerDayAction(classId, level),
      ]).then(([newLimits, newPerDay]) => {
        setLimits(newLimits);
        setPerDayDefaults(newPerDay);
        setSlotMap((prev) => {
          const next = { ...prev };
          for (const lvl of [1, 2, 3, 4, 5, 6]) {
            if (!characterSpellSlots.find((s) => s.spellLevel === lvl)) {
              next[lvl] = { totalSlots: newPerDay[lvl] ?? 0, usedSlots: 0 };
            }
          }
          return next;
        });
      });
    }
    window.addEventListener("character:level-changed", handleLevelChange);
    return () => window.removeEventListener("character:level-changed", handleLevelChange);
  }, [classId, characterSpellSlots]);

  const debouncedUpsert = useDebouncedSave<{ spellLevel: number; totalSlots: number; usedSlots: number }>(
    ({ spellLevel, totalSlots, usedSlots }) => {
      upsertSpellSlotsAction(characterId, spellLevel, totalSlots, usedSlots);
    }
  );

  function handleTotalChange(spellLevel: number, total: number) {
    const clamped = Math.max(0, total);
    const usedSlots = Math.min(slotMap[spellLevel]?.usedSlots ?? 0, clamped);
    setSlotMap((prev) => ({ ...prev, [spellLevel]: { totalSlots: clamped, usedSlots } }));
    debouncedUpsert({ spellLevel, totalSlots: clamped, usedSlots });
  }

  function handleUsedChange(spellLevel: number, used: number) {
    const current = slotMap[spellLevel];
    const clamped = Math.max(0, Math.min(used, current?.totalSlots ?? 0));
    setSlotMap((prev) => ({ ...prev, [spellLevel]: { ...prev[spellLevel], usedSlots: clamped } }));
    upsertSpellSlotsAction(characterId, spellLevel, current?.totalSlots ?? 0, clamped);
  }

  const [, startLongRest] = useTransition();
  function handleLongRest() {
    startLongRest(async () => {
      await longRestAction(characterId);
      setSlotMap((prev) => {
        const next = { ...prev };
        for (const lvl of Object.keys(next)) {
          next[Number(lvl)] = { ...next[Number(lvl)], usedSlots: 0 };
        }
        return next;
      });
    });
  }

  const knownByLevel = LEVELS.reduce(
    (acc, lvl) => {
      acc[lvl] = knownSpells.filter((e) => e.spellLevel === lvl);
      return acc;
    },
    {} as Record<number, CharacterSpellWithSpell[]>
  );

  const [knownState, setKnownState] = useState<Record<number, CharacterSpellWithSpell[]>>(
    () => Object.fromEntries(LEVELS.map((lvl) => [lvl, knownByLevel[lvl]]))
  );

  const [catalogState, setCatalogState] = useState<Record<number, Spell[]>>(
    () => {
      const knownIdsByLevel = Object.fromEntries(
        LEVELS.map((lvl) => [lvl, new Set(knownByLevel[lvl].map((e) => e.spellId))])
      );
      return Object.fromEntries(
        LEVELS.map((lvl) => [lvl, (spellCatalog[lvl] ?? []).filter((s) => !knownIdsByLevel[lvl].has(s.id))])
      );
    }
  );

  function handleSpellAdded(spellLevel: number, spell: Spell) {
    const newEntry: CharacterSpellWithSpell = {
      id: crypto.randomUUID(),
      characterId,
      spellId: spell.id,
      spellLevel,
      spell,
    };
    setKnownState((prev) => ({ ...prev, [spellLevel]: [...prev[spellLevel], newEntry] }));
    setCatalogState((prev) => ({ ...prev, [spellLevel]: prev[spellLevel].filter((s) => s.id !== spell.id) }));
  }

  function handleSpellRemoved(spellLevel: number, spellId: string) {
    const removed = knownState[spellLevel].find((e) => e.spellId === spellId);
    setKnownState((prev) => ({ ...prev, [spellLevel]: prev[spellLevel].filter((e) => e.spellId !== spellId) }));
    if (removed) {
      setCatalogState((prev) => ({
        ...prev,
        [spellLevel]: [...prev[spellLevel], removed.spell].sort((a, b) => a.name.localeCompare(b.name)),
      }));
    }
  }

  return (
    <section className="mt-8">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Spells</h2>
      <Tabs defaultValue="0">
        <div className="flex items-center gap-2 mb-2 min-w-0">
          <div className="overflow-x-auto min-w-0 flex-1">
            <TabsList className="min-w-max">
              {LEVELS.map((lvl) => {
                const limit = limits[lvl] ?? 0;
                const count = knownState[lvl].length;
                const locked = limit === 0;
                return (
                  <TabsTrigger key={lvl} value={String(lvl)} disabled={locked}>
                    <span>{lvl === 0 ? "Cantrips" : `Lvl ${lvl}`}</span>
                    {!locked && (
                      <span className={["ml-1 text-xs tabular-nums", count >= limit ? "text-destructive" : "text-muted-foreground"].join(" ")}>
                        {count}/{limit}
                      </span>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
          {isOwner && (
            <button
              onClick={handleLongRest}
              className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 h-9 text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors shrink-0"
            >
              <Moon className="h-3.5 w-3.5" />
              New Day
            </button>
          )}
        </div>
        {LEVELS.map((lvl) => {
          const limit = limits[lvl] ?? 0;
          if (limit === 0) return null;
          return (
            <TabsContent key={lvl} value={String(lvl)}>
              <SpellLevelPanel
                characterId={characterId}
                spellLevel={lvl}
                known={knownState[lvl]}
                catalog={catalogState[lvl]}
                limit={limit}
                isOwner={isOwner}
                slotState={slotMap[lvl] ?? { totalSlots: 0, usedSlots: 0 }}
                onSlotTotalChange={(total) => handleTotalChange(lvl, total)}
                onSlotUsedChange={(used) => handleUsedChange(lvl, used)}
                onSpellAdded={(spell) => handleSpellAdded(lvl, spell)}
                onSpellRemoved={(spellId) => handleSpellRemoved(lvl, spellId)}
              />
            </TabsContent>
          );
        })}
      </Tabs>
    </section>
  );
}
