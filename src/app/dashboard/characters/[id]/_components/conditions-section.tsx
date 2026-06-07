"use client";

import { useState, useTransition } from "react";
import { X, Plus, Info } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useCharacter } from "./character-context";
import { toggleConditionAction } from "../actions";
import type { Condition } from "@/db/schema";

interface ConditionsSectionProps {
  allConditions: Condition[];
}

export default function ConditionsSection({ allConditions }: ConditionsSectionProps) {
  const { characterId, isOwner, activeConditions, setActiveConditions } = useCharacter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [, startTransition] = useTransition();

  function isActive(conditionId: string) {
    return activeConditions.some((c) => c.id === conditionId);
  }

  function toggle(condition: Condition) {
    const active = !isActive(condition.id);
    const next = active
      ? [...activeConditions, condition].sort((a, b) => a.name.localeCompare(b.name))
      : activeConditions.filter((c) => c.id !== condition.id);
    setActiveConditions(next);
    startTransition(async () => {
      await toggleConditionAction(characterId, condition.id, active);
    });
  }

  function remove(condition: Condition) {
    setActiveConditions(activeConditions.filter((c) => c.id !== condition.id));
    startTransition(async () => {
      await toggleConditionAction(characterId, condition.id, false);
    });
  }

  return (
    <div className="px-3 py-3" style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between mb-2">
        <span
          style={{
            fontFamily: "var(--font-ui)",
            fontWeight: 600,
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-2)",
          }}
        >
          Conditions
        </span>
        {isOwner && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              className="flex items-center gap-1 text-xs rounded px-1.5 py-0.5"
              style={{ color: "var(--sf-accent)", fontFamily: "var(--font-ui)" }}
            >
              <Plus size={12} />
              Add
            </DialogTrigger>
            <DialogContent className="max-w-sm w-full">
              <DialogHeader>
                <DialogTitle>Conditions</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-1">
                {allConditions.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No conditions configured for this edition.
                  </p>
                )}
                {allConditions.map((condition) => {
                  const active = isActive(condition.id);
                  return (
                    <button
                      key={condition.id}
                      onClick={() => toggle(condition)}
                      className="flex items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
                      style={{
                        backgroundColor: active ? "var(--accent-bg)" : "transparent",
                        border: `1px solid ${active ? "var(--sf-accent)" : "var(--border)"}`,
                      }}
                    >
                      <span
                        className="mt-0.5 shrink-0 rounded-full border flex items-center justify-center"
                        style={{
                          width: 16,
                          height: 16,
                          borderColor: active ? "var(--sf-accent)" : "var(--border)",
                          backgroundColor: active ? "var(--sf-accent)" : "transparent",
                        }}
                      >
                        {active && (
                          <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "white", display: "block" }} />
                        )}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-medium leading-tight"
                          style={{ color: "var(--text-1)", fontFamily: "var(--font-ui)" }}
                        >
                          {condition.name}
                        </p>
                        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--text-2)" }}>
                          {condition.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {activeConditions.length === 0 ? (
        <p className="text-xs" style={{ color: "var(--text-2)" }}>
          {isOwner ? "No active conditions. Tap Add to apply one." : "No active conditions."}
        </p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {activeConditions.map((condition) => (
            <ConditionChip
              key={condition.id}
              condition={condition}
              isOwner={isOwner}
              onRemove={() => remove(condition)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ConditionChip({
  condition,
  isOwner,
  onRemove,
}: {
  condition: Condition;
  isOwner: boolean;
  onRemove: () => void;
}) {
  return (
    <div
      className="flex items-center gap-1 rounded-full px-2 py-0.5"
      style={{
        backgroundColor: "var(--accent-bg)",
        border: "1px solid var(--sf-accent)",
        fontSize: 12,
        fontFamily: "var(--font-ui)",
        color: "var(--text-1)",
      }}
    >
      <Popover>
        <PopoverTrigger className="flex items-center gap-1" style={{ color: "inherit" }}>
          <Info size={11} style={{ color: "var(--sf-accent)", flexShrink: 0 }} />
          <span>{condition.name}</span>
        </PopoverTrigger>
        <PopoverContent side="top" className="w-64">
          <p className="text-sm font-medium mb-1" style={{ fontFamily: "var(--font-ui)" }}>{condition.name}</p>
          <p className="text-xs leading-relaxed" style={{ color: "var(--text-2)" }}>{condition.description}</p>
        </PopoverContent>
      </Popover>
      {isOwner && (
        <button
          onClick={onRemove}
          className="flex items-center justify-center ml-0.5"
          aria-label={`Remove ${condition.name}`}
          style={{ color: "var(--text-2)" }}
        >
          <X size={11} />
        </button>
      )}
    </div>
  );
}
