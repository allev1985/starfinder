"use client";

import { useState, useTransition } from "react";
import { Swords, Eye, Skull, ChevronRight, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
import BattleRealtimeSync from "./_battle-realtime-sync";
import {
  startBattleAction,
  fetchBattleStateAction,
  submitInitiativeAction,
  setInitiativeTotalAction,
  addEnemyAction,
  beginBattleAction,
  finishTurnAction,
  markDefeatedAction,
  revealEnemyAction,
  updateEnemyStatsAction,
  updateCharacterHealthAction,
  endInitiativeAction,
} from "./actions";
import type { Battle, BattleCombatant } from "@/db/schema";
import type { BattlePartyMember } from "@/db/queries/battles";

type Props = {
  campaignId: string;
  userId: string;
  isDm: boolean;
  battle: Battle | null;
  combatants: BattleCombatant[];
  partyMembers: BattlePartyMember[];
};

function mod(score: number) {
  return Math.floor((score - 10) / 2);
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p
      className="uppercase tracking-[0.1em] mb-2"
      style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)" }}
    >
      {children}
    </p>
  );
}

function StatPill({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex flex-col items-center flex-1 min-w-[48px]">
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 15, fontWeight: 700, color: "var(--text-1)" }}>
        {value}
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
    </div>
  );
}

function HealthRow({
  label,
  current,
  total,
  canEdit,
  onChangeCurrent,
}: {
  label: string;
  current: number;
  total: number;
  canEdit: boolean;
  onChangeCurrent: (v: number) => void;
}) {
  const [val, setVal] = useState(String(current));

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setVal(e.target.value);
    const n = parseInt(e.target.value, 10);
    if (!isNaN(n)) onChangeCurrent(n);
  }

  if (!canEdit) {
    return (
      <div className="flex items-center gap-1.5">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", width: 22 }}>{label}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-1)" }}>
          {current}/{total}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", width: 22 }}>{label}</span>
      <Input
        value={val}
        onChange={handleChange}
        type="number"
        aria-label={`${label} current`}
        style={{ width: 56, height: 36, fontFamily: "var(--font-mono)", fontSize: 14, padding: "0 6px" }}
      />
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-3)" }}>/{total}</span>
    </div>
  );
}

function PcInlineStats({
  member,
  canEdit,
  campaignId,
  health,
  onHealthChange,
}: {
  member: BattlePartyMember;
  canEdit: boolean;
  campaignId: string;
  health: { sp: number; hp: number; rp: number };
  onHealthChange: (field: "sp" | "hp" | "rp", value: number) => void;
}) {
  const dexMod = mod(member.dexScore);
  const strMod = mod(member.strScore);
  const eac = 10 + member.armorEacBonus + dexMod + member.eacMiscMod;
  const kac = 10 + member.armorKacBonus + dexMod + member.kacMiscMod;
  const meleeAtk = member.baseAttackBonus + strMod + member.meleeAttackMiscMod;
  const rangedAtk = member.baseAttackBonus + dexMod + member.rangedAttackMiscMod;

  const scheduleHealthSave = useDebouncedSave((values: { sp: number; hp: number; rp: number }) => {
    updateCharacterHealthAction(campaignId, member.characterId, {
      staminaPointsCurrent: values.sp,
      staminaPointsTotal: member.staminaPointsTotal,
      hitPointsCurrent: values.hp,
      hitPointsTotal: member.hitPointsTotal,
      resolvePointsCurrent: values.rp,
      resolvePointsTotal: member.resolvePointsTotal,
    });
  });

  function handleChange(field: "sp" | "hp" | "rp", value: number) {
    const next = { ...health, [field]: value };
    onHealthChange(field, value);
    scheduleHealthSave(next);
  }

  return (
    <div style={{ padding: "10px 14px 12px", borderTop: "1px solid var(--border)" }}>
      <div className="grid grid-cols-4 gap-2 mb-3">
        <StatPill label="EAC" value={eac} />
        <StatPill label="KAC" value={kac} />
        <StatPill label="Mel" value={meleeAtk >= 0 ? `+${meleeAtk}` : meleeAtk} />
        <StatPill label="Rng" value={rangedAtk >= 0 ? `+${rangedAtk}` : rangedAtk} />
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        <HealthRow label="SP" current={health.sp} total={member.staminaPointsTotal} canEdit={canEdit} onChangeCurrent={(v) => handleChange("sp", v)} />
        <HealthRow label="HP" current={health.hp} total={member.hitPointsTotal} canEdit={canEdit} onChangeCurrent={(v) => handleChange("hp", v)} />
        <HealthRow label="RP" current={health.rp} total={member.resolvePointsTotal} canEdit={canEdit} onChangeCurrent={(v) => handleChange("rp", v)} />
      </div>
    </div>
  );
}

function EnemyDmStats({
  combatantId,
  campaignId,
  hpCurrent,
  hpTotal,
  eac,
  kac,
}: {
  combatantId: string;
  campaignId: string;
  hpCurrent: number | null;
  hpTotal: number | null;
  eac: number | null;
  kac: number | null;
}) {
  const [vals, setVals] = useState({ hpCurrent: hpCurrent ?? 0, hpTotal: hpTotal ?? 0, eac: eac ?? 0, kac: kac ?? 0 });

  const scheduleStatSave = useDebouncedSave((v: typeof vals) => {
    updateEnemyStatsAction(campaignId, combatantId, v);
  });

  function handle(field: keyof typeof vals, raw: string) {
    const n = parseInt(raw, 10);
    if (isNaN(n)) return;
    const next = { ...vals, [field]: n };
    setVals(next);
    scheduleStatSave(next);
  }

  return (
    <div
      className="flex flex-wrap gap-x-5 gap-y-2"
      style={{ padding: "10px 14px 12px 14px", borderTop: "1px solid var(--border)" }}
    >
      <div className="flex items-center gap-1.5">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", minWidth: 20 }}>HP</span>
        <Input type="number" value={vals.hpCurrent} onChange={(e) => handle("hpCurrent", e.target.value)}
          aria-label="HP current" style={{ width: 60, height: 36, fontFamily: "var(--font-mono)", fontSize: 14 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-3)" }}>/</span>
        <Input type="number" value={vals.hpTotal} onChange={(e) => handle("hpTotal", e.target.value)}
          aria-label="HP max" style={{ width: 60, height: 36, fontFamily: "var(--font-mono)", fontSize: 14 }} />
      </div>
      <div className="flex items-center gap-1.5">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", minWidth: 28 }}>EAC</span>
        <Input type="number" value={vals.eac} onChange={(e) => handle("eac", e.target.value)}
          aria-label="EAC" style={{ width: 60, height: 36, fontFamily: "var(--font-mono)", fontSize: 14 }} />
      </div>
      <div className="flex items-center gap-1.5">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)", minWidth: 28 }}>KAC</span>
        <Input type="number" value={vals.kac} onChange={(e) => handle("kac", e.target.value)}
          aria-label="KAC" style={{ width: 60, height: 36, fontFamily: "var(--font-mono)", fontSize: 14 }} />
      </div>
    </div>
  );
}

function AddEnemyForm({ campaignId }: { campaignId: string }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", initiative: "", hp: "", hpMax: "", eac: "", kac: "", hidden: true,
  });

  async function handleAdd() {
    const initiative = parseInt(form.initiative, 10);
    if (!form.name.trim() || isNaN(initiative)) return;
    setSaving(true);
    await addEnemyAction(campaignId, {
      displayName: form.name.trim(),
      initiativeTotal: initiative,
      hidden: form.hidden,
      hpTotal: parseInt(form.hpMax, 10) || undefined,
      hpCurrent: parseInt(form.hp, 10) || undefined,
      eac: parseInt(form.eac, 10) || undefined,
      kac: parseInt(form.kac, 10) || undefined,
    });
    setForm({ name: "", initiative: "", hp: "", hpMax: "", eac: "", kac: "", hidden: true });
    setOpen(false);
    setSaving(false);
  }

  if (!open) {
    return (
      <div className="mb-4">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <Plus size={13} className="mr-1" /> Add Enemy
        </Button>
      </div>
    );
  }

  return (
    <div
      className="rounded-[var(--r)] mb-4"
      style={{ padding: "14px", backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
    >
      <p style={{ fontFamily: "var(--font-ui)", fontWeight: 600, fontSize: 13, color: "var(--text-1)", marginBottom: 10 }}>
        Add Enemy
      </p>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <Label style={{ fontSize: 11, color: "var(--text-3)" }}>Name</Label>
          <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Enemy name" />
        </div>
        <div>
          <Label style={{ fontSize: 11, color: "var(--text-3)" }}>Initiative</Label>
          <Input type="number" value={form.initiative} onChange={(e) => setForm((p) => ({ ...p, initiative: e.target.value }))} placeholder="Total" />
        </div>
        <div>
          <Label style={{ fontSize: 11, color: "var(--text-3)" }}>HP</Label>
          <Input type="number" value={form.hp} onChange={(e) => setForm((p) => ({ ...p, hp: e.target.value }))} placeholder="Current" />
        </div>
        <div>
          <Label style={{ fontSize: 11, color: "var(--text-3)" }}>HP Max</Label>
          <Input type="number" value={form.hpMax} onChange={(e) => setForm((p) => ({ ...p, hpMax: e.target.value }))} placeholder="Max" />
        </div>
        <div>
          <Label style={{ fontSize: 11, color: "var(--text-3)" }}>EAC</Label>
          <Input type="number" value={form.eac} onChange={(e) => setForm((p) => ({ ...p, eac: e.target.value }))} />
        </div>
        <div>
          <Label style={{ fontSize: 11, color: "var(--text-3)" }}>KAC</Label>
          <Input type="number" value={form.kac} onChange={(e) => setForm((p) => ({ ...p, kac: e.target.value }))} />
        </div>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <Switch
          id="add-enemy-hidden"
          checked={form.hidden}
          onCheckedChange={(v: boolean) => setForm((p) => ({ ...p, hidden: v }))}
        />
        <Label htmlFor="add-enemy-hidden" style={{ fontSize: 12, color: "var(--text-2)" }}>
          Hidden from players
        </Label>
      </div>
      <div className="flex gap-2">
        <Button size="sm" onClick={handleAdd} disabled={saving || !form.name.trim() || !form.initiative}>
          {saving ? <Loader2 size={13} className="animate-spin mr-1" /> : <Plus size={13} className="mr-1" />}
          Add
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </div>
  );
}

export default function InitiativeClient({
  campaignId,
  userId,
  isDm,
  battle: initialBattle,
  combatants: initialCombatants,
  partyMembers,
}: Props) {
  const [battle, setBattle] = useState(initialBattle);
  const [combatants, setCombatants] = useState(initialCombatants);
  const [isPending, startTransition] = useTransition();
  const [beginError, setBeginError] = useState<string | null>(null);
  const [rollErrors, setRollErrors] = useState<Record<string, string>>({});

  const [pcHealth, setPcHealth] = useState<Record<string, { sp: number; hp: number; rp: number }>>(
    Object.fromEntries(
      partyMembers.map((m) => [
        m.characterId,
        { sp: m.staminaPointsCurrent, hp: m.hitPointsCurrent, rp: m.resolvePointsCurrent },
      ])
    )
  );

  const [rollInputs, setRollInputs] = useState<Record<string, string>>({});

  function upsertCombatant(updated: BattleCombatant) {
    setCombatants((prev) => {
      const idx = prev.findIndex((c) => c.id === updated.id);
      if (idx === -1) return [...prev, updated];
      const next = [...prev];
      next[idx] = { ...next[idx], ...updated };
      return next;
    });
  }

  function handleBattleDelete() {
    setBattle(null);
    setCombatants([]);
  }

  function handleBattleInsert(newBattle: Battle, newCombatants: BattleCombatant[]) {
    setBattle(newBattle);
    setCombatants(newCombatants);
  }

  const sorted = [...combatants]
    .filter((c) => c.sortOrder !== null)
    .sort((a, b) => a.sortOrder! - b.sortOrder!);

  const currentCombatant = battle?.status === "active" ? sorted[battle.currentTurnIndex] : null;

  function myPcCombatantIds(): string[] {
    return combatants.filter((c) => {
      if (c.type !== "pc" || !c.characterId) return false;
      const member = partyMembers.find((m) => m.characterId === c.characterId);
      return member?.ownerId === userId;
    }).map((c) => c.id);
  }

  const myPcIds = myPcCombatantIds();

  // ── Idle state ──────────────────────────────────────────────────────────
  if (!battle) {
    return (
      <div className="px-4 py-5 sm:px-6 lg:px-8 mx-auto w-full max-w-5xl">
        <div className="flex items-center gap-2 mb-6">
          <Swords size={20} style={{ color: "var(--sf-accent)" }} />
          <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 22, color: "var(--text-1)" }}>
            Initiative
          </h1>
        </div>
        {isDm ? (
          <Button
            onClick={() => startTransition(async () => {
              const result = await startBattleAction(campaignId);
              if (result) {
                setBattle(result.battle);
                setCombatants(result.combatants);
              }
            })}
            disabled={isPending}
          >
            {isPending ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
            New Battle
          </Button>
        ) : (
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>Waiting for DM to start a battle…</p>
        )}
        <BattleRealtimeSync
          campaignId={campaignId}
          battleId={null}
          characterIds={partyMembers.map((m) => m.characterId)}
          onBattleUpdate={(b) => setBattle((prev) => prev ? { ...prev, ...b } : prev)}
          onBattleDelete={handleBattleDelete}
          onBattleInsert={handleBattleInsert}
          onCombatantUpdate={upsertCombatant}
          onHealthUpdate={(characterId, health) =>
            setPcHealth((prev) => ({ ...prev, [characterId]: health }))
          }
        />
      </div>
    );
  }

  // ── Setup state ─────────────────────────────────────────────────────────
  if (battle.status === "setup") {
    const setupCombatants = [...combatants].sort((a, b) => a.displayName.localeCompare(b.displayName));
    const allPcsReady = setupCombatants
      .filter((c) => c.type === "pc")
      .every((c) => c.initiativeTotal !== null);

    async function handleSubmitRoll(c: BattleCombatant) {
      const raw = rollInputs[c.id] ?? "";
      const roll = parseInt(raw, 10);
      if (isNaN(roll) || roll < 1 || roll > 20) {
        setRollErrors((p) => ({ ...p, [c.id]: "Enter a number between 1 and 20" }));
        return;
      }
      if (!c.characterId) return;

      const member = partyMembers.find((m) => m.characterId === c.characterId);
      const total = roll + (member?.initiativeMiscMod ?? 0);

      // Optimistic update — don't wait for realtime
      upsertCombatant({ ...c, initiativeTotal: total });
      setRollErrors((p) => ({ ...p, [c.id]: "" }));

      try {
        const result = await submitInitiativeAction(campaignId, c.id, c.characterId, roll);
        if (result.error) {
          upsertCombatant({ ...c, initiativeTotal: null });
          setRollErrors((p) => ({ ...p, [c.id]: result.error! }));
        }
      } catch {
        upsertCombatant({ ...c, initiativeTotal: null });
        setRollErrors((p) => ({ ...p, [c.id]: "Failed to save — please try again" }));
      }
    }

    return (
      <div className="px-4 py-5 sm:px-6 lg:px-8 mx-auto w-full max-w-5xl">
        <div className="flex items-center gap-2 mb-6">
          <Swords size={20} style={{ color: "var(--sf-accent)" }} />
          <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 22, color: "var(--text-1)" }}>
            Battle Setup
          </h1>
        </div>

        <div className="mb-6">
          <SectionLabel>Party — Roll Initiative</SectionLabel>
          <div className="flex flex-col gap-2">
            {setupCombatants.filter((c) => c.type === "pc").map((c) => {
              const member = partyMembers.find((m) => m.characterId === c.characterId);
              const canSubmit = isDm || myPcIds.includes(c.id);
              return (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-[var(--r)]"
                  style={{ padding: "10px 14px", backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <span style={{ flex: 1, fontFamily: "var(--font-ui)", fontWeight: 500, fontSize: 13, color: "var(--text-1)" }}>
                    {c.displayName}
                  </span>
                  {canSubmit ? (
                    <div className="flex items-center gap-2 flex-wrap justify-end">
                      {c.initiativeTotal === null && (
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>
                          d20 {member && member.initiativeMiscMod !== 0 ? (member.initiativeMiscMod > 0 ? `+${member.initiativeMiscMod}` : member.initiativeMiscMod) : ""}
                        </span>
                      )}
                      <Input
                        type="number"
                        placeholder={c.initiativeTotal === null ? "roll" : undefined}
                        value={rollInputs[c.id] ?? (c.initiativeTotal !== null ? String(c.initiativeTotal) : "")}
                        onChange={(e) => setRollInputs((p) => ({ ...p, [c.id]: e.target.value }))}
                        aria-label={`Initiative for ${c.displayName}`}
                        style={{ width: 64, fontFamily: "var(--font-mono)", fontSize: 14, height: 36 }}
                      />
                      <Button
                        size="sm"
                        variant={c.initiativeTotal !== null ? "outline" : "default"}
                        className="min-h-[36px]"
                        onClick={() => startTransition(async () => {
                          const raw = rollInputs[c.id] ?? (c.initiativeTotal !== null ? String(c.initiativeTotal) : "");
                          const val = parseInt(raw, 10);
                          if (isNaN(val)) return;
                          if (!c.characterId) return;

                          if (c.initiativeTotal === null) {
                            await handleSubmitRoll(c);
                          } else {
                            // Editing an existing total — set directly, no modifier added
                            const prev = c.initiativeTotal;
                            upsertCombatant({ ...c, initiativeTotal: val });
                            setRollErrors((p) => ({ ...p, [c.id]: "" }));
                            try {
                              const result = await setInitiativeTotalAction(campaignId, c.id, c.characterId, val);
                              if (result.error) {
                                upsertCombatant({ ...c, initiativeTotal: prev });
                                setRollErrors((p) => ({ ...p, [c.id]: result.error! }));
                              }
                            } catch {
                              upsertCombatant({ ...c, initiativeTotal: prev });
                              setRollErrors((p) => ({ ...p, [c.id]: "Failed to save — try again" }));
                            }
                          }
                        })}
                      >
                        {c.initiativeTotal !== null ? "Update" : "Submit"}
                      </Button>
                      {rollErrors[c.id] && (
                        <span style={{ fontSize: 11, color: "var(--destructive, red)" }}>{rollErrors[c.id]}</span>
                      )}
                    </div>
                  ) : c.initiativeTotal !== null ? (
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: "var(--good)" }}>
                      {c.initiativeTotal}
                    </span>
                  ) : (
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-3)" }}>Waiting…</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {setupCombatants.filter((c) => c.type === "enemy").length > 0 && (
          <div className="mb-6">
            <SectionLabel>Enemies</SectionLabel>
            <div className="flex flex-col gap-2">
              {setupCombatants.filter((c) => c.type === "enemy").map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-[var(--r)]"
                  style={{ padding: "10px 14px", backgroundColor: "var(--surface)", border: "1px solid var(--border)" }}
                >
                  <span style={{ flex: 1, fontFamily: "var(--font-ui)", fontWeight: 500, fontSize: 13, color: "var(--text-1)" }}>
                    {c.displayName} {c.hidden && <span style={{ fontSize: 10, color: "var(--text-3)" }}>(hidden)</span>}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-2)" }}>
                    {c.initiativeTotal}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {isDm && <AddEnemyForm campaignId={campaignId} />}

        {isDm && (
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => {
                setBeginError(null);
                startTransition(async () => {
                  const result = await beginBattleAction(campaignId);
                  if (result.error) setBeginError(result.error);
                });
              }}
              disabled={isPending}
            >
              {isPending ? <Loader2 size={14} className="animate-spin mr-2" /> : null}
              Begin Battle
            </Button>
            {beginError && (
              <p style={{ fontSize: 12, color: "var(--destructive, red)" }}>{beginError}</p>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => startTransition(async () => {
                await endInitiativeAction(campaignId);
                handleBattleDelete();
              })}
              disabled={isPending}
            >
              Cancel
            </Button>
          </div>
        )}

        <BattleRealtimeSync
          campaignId={campaignId}
          battleId={battle.id}
          characterIds={partyMembers.map((m) => m.characterId)}
          onBattleUpdate={(b) => setBattle((prev) => prev ? { ...prev, ...b } : prev)}
          onBattleDelete={handleBattleDelete}
          onBattleInsert={handleBattleInsert}
          onCombatantUpdate={upsertCombatant}
          onHealthUpdate={(characterId, health) =>
            setPcHealth((prev) => ({ ...prev, [characterId]: health }))
          }
        />
      </div>
    );
  }

  // ── Active state ─────────────────────────────────────────────────────────
  return (
    <div className="p-5 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Swords size={20} style={{ color: "var(--sf-accent)" }} />
          <h1 style={{ fontFamily: "var(--font-ui)", fontWeight: 700, fontSize: 22, color: "var(--text-1)" }}>
            Round {battle.currentRound}
          </h1>
        </div>
        {isDm && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => startTransition(async () => {
              await endInitiativeAction(campaignId);
              handleBattleDelete();
            })}
            disabled={isPending}
          >
            End Initiative
          </Button>
        )}
      </div>

      {/* Initiative Order */}
      <div className="mb-6">
        <SectionLabel>Initiative Order</SectionLabel>
        <ol role="list" aria-label="Initiative order" className="flex flex-col gap-2">
          {sorted.map((c) => {
            const isCurrent = c.id === currentCombatant?.id;
            // Players must not see that a hidden enemy holds the current turn
            const isCurrentVisible = isCurrent && (isDm || !c.hidden);
            const member = partyMembers.find((m) => m.characterId === c.characterId);
            const canFinish = isDm || (isCurrent && myPcIds.includes(c.id));
            const name = !isDm && c.hidden ? "???" : c.displayName;

            return (
              <li
                key={c.id}
                role="listitem"
                aria-current={isCurrentVisible ? "true" : undefined}
                className="flex flex-col rounded-[var(--r)]"
                style={{
                  backgroundColor: isCurrentVisible ? "var(--accent-dim, var(--surface))" : "var(--surface)",
                  border: `1px solid ${isCurrentVisible ? "var(--sf-accent)" : "var(--border)"}`,
                  opacity: c.defeated ? 0.45 : 1,
                }}
              >
                {/* Main row */}
                <div className="flex items-center gap-3 min-h-[48px]" style={{ padding: "10px 14px" }}>
                  {isCurrentVisible && <ChevronRight size={16} style={{ color: "var(--sf-accent)", flexShrink: 0 }} aria-hidden="true" />}
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text-3)",
                      width: 32,
                      flexShrink: 0,
                      textDecoration: c.defeated ? "line-through" : "none",
                    }}
                  >
                    {c.initiativeTotal}
                  </span>
                  <span
                    className="truncate"
                    style={{
                      flex: 1,
                      fontFamily: "var(--font-ui)",
                      fontWeight: isCurrentVisible ? 700 : 400,
                      fontSize: 14,
                      color: "var(--text-1)",
                      textDecoration: c.defeated ? "line-through" : "none",
                    }}
                  >
                    {name}
                    {c.type === "pc" && member && (
                      <span style={{ fontSize: 11, color: "var(--text-3)", marginLeft: 6 }}>PC</span>
                    )}
                  </span>
                  <div className="flex items-center gap-1 shrink-0">
                    {isCurrentVisible && !c.defeated && canFinish && (
                      <Button
                        size="sm"
                        onClick={() => startTransition(async () => { await finishTurnAction(campaignId); })}
                        disabled={isPending}
                        className="min-h-[36px]"
                      >
                        Finish Turn
                      </Button>
                    )}
                    {isDm && c.type === "enemy" && c.hidden && !c.defeated && (
                      <Button
                        size="sm"
                        variant="outline"
                        aria-label={`Reveal ${c.displayName}`}
                        onClick={() => startTransition(async () => { await revealEnemyAction(campaignId, c.id); })}
                        className="min-h-[36px]"
                      >
                        <Eye size={14} className="mr-1" aria-hidden="true" /> Reveal
                      </Button>
                    )}
                    {isDm && c.type === "enemy" && !c.defeated && (
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Mark ${c.displayName} defeated`}
                        onClick={() => startTransition(async () => { await markDefeatedAction(campaignId, c.id); })}
                        className="min-h-[36px] min-w-[36px]"
                      >
                        <Skull size={15} aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* PC inline stats */}
                {c.type === "pc" && member && !c.defeated && (
                  <PcInlineStats
                    member={member}
                    canEdit={isDm || member.ownerId === userId}
                    campaignId={campaignId}
                    health={pcHealth[member.characterId] ?? {
                      sp: member.staminaPointsCurrent,
                      hp: member.hitPointsCurrent,
                      rp: member.resolvePointsCurrent,
                    }}
                    onHealthChange={(field, value) =>
                      setPcHealth((prev) => ({
                        ...prev,
                        [member.characterId]: { ...prev[member.characterId], [field]: value },
                      }))
                    }
                  />
                )}

                {/* DM-only enemy stats — inline below the row */}
                {isDm && c.type === "enemy" && !c.defeated && (
                  <EnemyDmStats
                    combatantId={c.id}
                    campaignId={campaignId}
                    hpCurrent={c.hpCurrent}
                    hpTotal={c.hpTotal}
                    eac={c.eac}
                    kac={c.kac}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* DM: add enemy mid-battle */}
      {isDm && <AddEnemyForm campaignId={campaignId} />}

      <BattleRealtimeSync
        campaignId={campaignId}
        battleId={battle.id}
        characterIds={partyMembers.map((m) => m.characterId)}
        onBattleUpdate={(b) => setBattle((prev) => prev ? { ...prev, ...b } : prev)}
        onBattleDelete={handleBattleDelete}
        onBattleInsert={handleBattleInsert}
        onCombatantUpdate={upsertCombatant}
        onHealthUpdate={(characterId, health) =>
          setPcHealth((prev) => ({ ...prev, [characterId]: health }))
        }
      />
    </div>
  );
}
