"use client";

import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { saveClassChoiceAction } from "../actions";
import type { ClassAbility, ClassAbilityOption, CharacterClassChoice, WeaponCategory } from "@/db/schema";
import { useCharacter } from "./character-context";

const WEAPON_CATEGORY_LABELS: Record<WeaponCategory, string> = {
  small_arms: "Small Arms",
  longarms: "Longarms",
  heavy: "Heavy Weapons",
  sniper: "Sniper Weapons",
  melee_basic: "Basic Melee",
  melee_advanced: "Advanced Melee",
  grenade: "Grenades",
  special: "Special Weapons",
};

type Props = {
  classAbilities: ClassAbility[];
  allAbilityOptions: ClassAbilityOption[];
  weaponProficiencies: WeaponCategory[];
};

function FeatureDescription({ description }: { description: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        className="text-left text-xs text-muted-foreground hover:text-foreground"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <ChevronUp className="inline h-3 w-3 mr-1" /> : <ChevronDown className="inline h-3 w-3 mr-1" />}
        {open ? "Hide description" : "Show description"}
      </button>
      {open && (
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
          {description}
        </p>
      )}
    </div>
  );
}

function ChoicePicker({
  characterId,
  ability,
  options,
  savedChoice,
  acquiredAtLevel,
  isOwner,
  onSelect,
}: {
  characterId: string;
  ability: ClassAbility;
  options: ClassAbilityOption[];
  savedChoice: CharacterClassChoice | undefined;
  acquiredAtLevel: number;
  isOwner: boolean;
  onSelect: (choice: CharacterClassChoice) => void;
}) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  const selectedOption = options.find((o) => o.id === savedChoice?.optionId);
  const displayValue = selectedOption?.name ?? savedChoice?.customValue ?? null;

  function handleSelect(optionId: string) {
    const option = options.find((o) => o.id === optionId);
    if (!option) return;
    setOpen(false);
    startTransition(async () => {
      const result = await saveClassChoiceAction(characterId, ability.id, acquiredAtLevel, optionId, null);
      if (result.success) {
        onSelect({
          id: savedChoice?.id ?? crypto.randomUUID(),
          characterId,
          classAbilityId: ability.id,
          acquiredAtLevel,
          optionId,
          customValue: null,
        });
      }
    });
  }

  if (!isOwner) {
    return (
      <span className="text-xs text-muted-foreground italic">
        {displayValue ?? "—"}
      </span>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-7 text-xs font-normal justify-start min-w-32 max-w-56 truncate")}>
        {displayValue ?? `Choose ${ability.name}…`}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${ability.name}…`} />
          <CommandList>
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.id}
                  value={opt.name}
                  onSelect={() => handleSelect(opt.id)}
                  className="flex flex-col items-start gap-0.5"
                >
                  <span className="font-medium text-xs">{opt.name}</span>
                  {opt.prerequisites && (
                    <span className="text-xs text-muted-foreground">Prereq: {opt.prerequisites}</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default function ClassFeaturesSection({
  classAbilities,
  allAbilityOptions,
  weaponProficiencies,
}: Props) {
  const { characterId, isOwner, level: characterLevel, choices: savedChoices, setChoices, hasShieldProficiency } = useCharacter();
  const abilityOptions = allAbilityOptions.reduce<Record<string, ClassAbilityOption[]>>((acc, opt) => {
    (acc[opt.poolName] ??= []).push(opt);
    return acc;
  }, {});
  const earned = classAbilities.filter((a) => a.level <= characterLevel);

  const byLevel = earned.reduce<Record<number, ClassAbility[]>>((acc, a) => {
    (acc[a.level] ??= []).push(a);
    return acc;
  }, {});

  const choicesByAbilityAndLevel = savedChoices.reduce<Record<string, CharacterClassChoice>>((acc, c) => {
    acc[`${c.classAbilityId}:${c.acquiredAtLevel}`] = c;
    return acc;
  }, {});

  const levels = Object.keys(byLevel).map(Number).sort((a, b) => a - b);

  if (earned.length === 0 && weaponProficiencies.length === 0 && !hasShieldProficiency) return null;

  return (
    <section className="mt-8">
      <h2 className="mb-3 block bg-primary px-3 py-0.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
        Class Features
      </h2>

      {weaponProficiencies.length > 0 && (
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">Weapon Proficiencies</p>
          <div className="flex flex-wrap gap-1.5">
            {weaponProficiencies.map((cat) => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {WEAPON_CATEGORY_LABELS[cat]}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {hasShieldProficiency && (
        <div className="mb-4">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground">Shield Proficiencies</p>
          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="text-xs">Shields</Badge>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {levels.map((lvl) => (
          <div key={lvl}>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Level {lvl}</p>
            <div className="space-y-2 pl-3 border-l border-border">
              {byLevel[lvl].map((ability, idx) => {
                const options = ability.choicePool ? (abilityOptions[ability.choicePool] ?? []) : [];

                if (ability.choicePool) {
                  const savedChoice = choicesByAbilityAndLevel[`${ability.id}:${lvl}`];
                  return (
                    <div key={`${ability.id}-${idx}`} className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{ability.name}</span>
                        <ChoicePicker
                          characterId={characterId}
                          ability={ability}
                          options={options}
                          savedChoice={savedChoice}
                          acquiredAtLevel={lvl}
                          isOwner={isOwner}
                          onSelect={(choice) => setChoices(
                            savedChoices.some((c) => c.classAbilityId === choice.classAbilityId && c.acquiredAtLevel === choice.acquiredAtLevel)
                              ? savedChoices.map((c) => c.classAbilityId === choice.classAbilityId && c.acquiredAtLevel === choice.acquiredAtLevel ? choice : c)
                              : [...savedChoices, choice]
                          )}
                        />
                      </div>
                      <FeatureDescription description={ability.description} />
                    </div>
                  );
                }

                return (
                  <div key={`${ability.id}-${idx}`} className="space-y-1">
                    <span className="text-sm font-medium">{ability.name}</span>
                    <FeatureDescription description={ability.description} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
