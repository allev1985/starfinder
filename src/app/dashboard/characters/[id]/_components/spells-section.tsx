"use client";

import { useState, useEffect, useTransition } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
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
import { addSpellAction, removeSpellAction, fetchSpellsKnownLimitsAction } from "../actions";
import type { Spell, CharacterSpell } from "@/db/schema";
import { useCharacter } from "./character-context";

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
  onSpellAdded,
  onSpellRemoved,
}: {
  characterId: string;
  spellLevel: number;
  known: CharacterSpellWithSpell[];
  catalog: Spell[];
  limit: number;
  isOwner: boolean;
  onSpellAdded: (spell: Spell) => void;
  onSpellRemoved: (spellId: string) => void;
}) {
  return (
    <div className="pt-4">
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
}: {
  classId: string;
  knownSpells: CharacterSpellWithSpell[];
  spellCatalog: Record<number, Spell[]>;
  spellsKnownLimits: Record<number, number>;
}) {
  const { characterId, isOwner } = useCharacter();
  const LEVELS = [0, 1, 2, 3, 4, 5, 6] as const;
  const [limits, setLimits] = useState(spellsKnownLimits);

  useEffect(() => {
    function handleLevelChange(e: Event) {
      const level = (e as CustomEvent<{ level: number }>).detail.level;
      fetchSpellsKnownLimitsAction(classId, level).then(setLimits);
    }
    window.addEventListener("character:level-changed", handleLevelChange);
    return () => window.removeEventListener("character:level-changed", handleLevelChange);
  }, [classId]);

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
        <TabsList className="mb-2">
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
