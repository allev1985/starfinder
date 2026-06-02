"use client";

import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { addFeatAction, removeFeatAction, searchFeatsAction } from "../actions";
import type { CharacterFeatWithName } from "@/db/queries/characters";
import type { Feat } from "@/db/schema";
import { useCharacter } from "./character-context";

function FeatRow({
  feat,
  characterId,
  isOwner,
  onRemove,
}: {
  feat: CharacterFeatWithName;
  characterId: string;
  isOwner: boolean;
  onRemove: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [, startTransition] = useTransition();

  function handleRemove() {
    startTransition(async () => {
      const result = await removeFeatAction(characterId, feat.id);
      if (result.success) onRemove(feat.id);
    });
  }

  return (
    <div className="py-2 border-b border-border last:border-0">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm font-medium">{feat.name}</span>
            {feat.isCombatFeat && (
              <span className="text-xs text-muted-foreground">(Combat)</span>
            )}
          </div>
          {feat.featId && feat.description && (
            <>
              <button
                className="text-left text-xs text-muted-foreground hover:text-foreground mt-0.5"
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? <ChevronUp className="inline h-3 w-3 mr-1" /> : <ChevronDown className="inline h-3 w-3 mr-1" />}
                {expanded ? "Hide" : "Details"}
              </button>
              {expanded && (
                <div className="mt-1 space-y-1">
                  {feat.prerequisites && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Prerequisites:</span> {feat.prerequisites}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {feat.description}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        {isOwner && (
          <button
            onClick={handleRemove}
            className="shrink-0 text-muted-foreground hover:text-destructive mt-0.5"
            aria-label="Remove feat"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function AddFeatDialog({
  characterId,
  onAdd,
}: {
  characterId: string;
  onAdd: (feat: CharacterFeatWithName) => void;
}) {
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Feat[]>([]);
  const [customMode, setCustomMode] = useState(false);
  const [customName, setCustomName] = useState("");
  const [, startTransition] = useTransition();

  function handleSearch(query: string) {
    startTransition(async () => {
      const results = await searchFeatsAction(query);
      setSearchResults(results);
    });
  }

  function handleSelectFeat(feat: Feat) {
    setOpen(false);
    startTransition(async () => {
      const result = await addFeatAction(characterId, feat.id, null);
      if (result.success) {
        onAdd({
          id: crypto.randomUUID(),
          characterId,
          featId: feat.id,
          customName: null,
          notes: null,
          name: feat.name,
          description: feat.description,
          prerequisites: feat.prerequisites,
          isCombatFeat: feat.isCombatFeat,
        });
      }
    });
  }

  function handleAddCustom() {
    if (!customName.trim()) return;
    const name = customName.trim();
    setOpen(false);
    setCustomName("");
    setCustomMode(false);
    startTransition(async () => {
      const result = await addFeatAction(characterId, null, name);
      if (result.success) {
        onAdd({
          id: crypto.randomUUID(),
          characterId,
          featId: null,
          customName: name,
          notes: null,
          name,
          description: null,
          prerequisites: null,
          isCombatFeat: false,
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setCustomMode(false); setCustomName(""); setSearchResults([]); } }}>
      <DialogTrigger className="inline-flex h-7 items-center gap-1 rounded-md border border-input bg-background px-3 text-xs font-medium hover:bg-accent hover:text-accent-foreground">
        <Plus className="h-3 w-3" />
        Add Feat
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Feat</DialogTitle>
        </DialogHeader>
        {customMode ? (
          <div className="space-y-3">
            <Input
              placeholder="Feat name"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCustom()}
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAddCustom} disabled={!customName.trim()}>
                Add
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setCustomMode(false)}>
                Back
              </Button>
            </div>
          </div>
        ) : (
          <Command>
            <CommandInput
              placeholder="Search feats…"
              onValueChange={handleSearch}
            />
            <CommandList>
              <CommandEmpty>No feats found.</CommandEmpty>
              <CommandGroup>
                {searchResults.map((feat) => (
                  <CommandItem
                    key={feat.id}
                    value={feat.name}
                    onSelect={() => handleSelectFeat(feat)}
                    className="flex flex-col items-start gap-0.5"
                  >
                    <span className="text-sm font-medium">{feat.name}</span>
                    {feat.prerequisites && (
                      <span className="text-xs text-muted-foreground">Prereq: {feat.prerequisites}</span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup>
                <CommandItem onSelect={() => setCustomMode(true)} className="text-muted-foreground">
                  <Plus className="h-3 w-3 mr-1.5" />
                  Add custom feat…
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function FeatsSection() {
  const { characterId, isOwner, feats, setFeats } = useCharacter();

  function handleAdd(feat: CharacterFeatWithName) {
    setFeats([...feats, feat]);
  }

  function handleRemove(id: string) {
    setFeats(feats.filter((f) => f.id !== id));
  }

  return (
    <section className="mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="block bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">Feats</h2>
        {isOwner && <AddFeatDialog characterId={characterId} onAdd={handleAdd} />}
      </div>

      {feats.length === 0 ? (
        <p className="text-sm text-muted-foreground">No feats added yet.</p>
      ) : (
        <div>
          {feats.map((feat) => (
            <FeatRow
              key={feat.id}
              feat={feat}
              characterId={characterId}
              isOwner={isOwner}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </section>
  );
}
