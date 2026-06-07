"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/session";
import { checkIsCampaignDm } from "@/db/queries/campaigns";
import { getCharacterById, updateHealthResolve } from "@/db/queries/characters";
import {
  getActiveBattleForCampaign,
  createBattle,
  deleteBattle,
  updateBattleTurn,
  updateBattleStatus,
  insertPcCombatants,
  insertEnemyCombatant,
  updateCombatantInitiative,
  updateCombatantDefeated,
  updateCombatantHidden,
  updateCombatantSortOrders,
  updateEnemyStats,
  getBattleCombatants,
} from "@/db/queries/battles";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { characterCombatStats } from "@/db/schema";
import type { HealthResolveValues } from "@/db/queries/characters";
import type { Battle, BattleCombatant } from "@/db/schema";

async function requireDm(campaignId: string) {
  const user = await getUser();
  if (!user) redirect("/");
  const isDm = await checkIsCampaignDm(campaignId, user.id);
  if (!isDm) throw new Error("Unauthorized");
  return user;
}

async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/");
  return user;
}

export async function startBattleAction(
  campaignId: string
): Promise<{ battle: Battle; combatants: BattleCombatant[] } | null> {
  await requireDm(campaignId);
  const existing = await getActiveBattleForCampaign(campaignId);
  if (existing) return null;
  const battle = await createBattle(campaignId);
  await insertPcCombatants(battle.id, campaignId);
  const combatants = await getBattleCombatants(battle.id);
  return { battle, combatants };
}

export async function fetchBattleStateAction(
  campaignId: string
): Promise<{ battle: Battle; combatants: BattleCombatant[] } | null> {
  const user = await getUser();
  if (!user) redirect("/");
  const battle = await getActiveBattleForCampaign(campaignId);
  if (!battle) return null;
  const combatants = await getBattleCombatants(battle.id);
  return { battle, combatants };
}

export async function submitInitiativeAction(
  campaignId: string,
  combatantId: string,
  characterId: string,
  roll: number
): Promise<{ error?: string }> {
  const user = await requireUser();
  const character = await getCharacterById(characterId);
  if (!character) return { error: "Character not found" };

  const isDm = await checkIsCampaignDm(campaignId, user.id);
  const isOwner = character.ownerId === user.id;
  if (!isDm && !isOwner) return { error: "Unauthorized" };

  const battle = await getActiveBattleForCampaign(campaignId);
  if (!battle) return { error: "No active battle" };

  const [stats] = await db
    .select({ initiativeMiscMod: characterCombatStats.initiativeMiscMod })
    .from(characterCombatStats)
    .where(eq(characterCombatStats.characterId, characterId))
    .limit(1);

  const total = roll + (stats?.initiativeMiscMod ?? 0);
  const updated = await updateCombatantInitiative(combatantId, total);
  if (!updated) return { error: "Combatant not found — try refreshing the page" };
  return {};
}

export async function setInitiativeTotalAction(
  campaignId: string,
  combatantId: string,
  characterId: string,
  total: number
): Promise<{ error?: string }> {
  const user = await requireUser();
  const character = await getCharacterById(characterId);
  if (!character) return { error: "Character not found" };

  const isDm = await checkIsCampaignDm(campaignId, user.id);
  const isOwner = character.ownerId === user.id;
  if (!isDm && !isOwner) return { error: "Unauthorized" };

  const battle = await getActiveBattleForCampaign(campaignId);
  if (!battle) return { error: "No active battle" };

  const updated = await updateCombatantInitiative(combatantId, total);
  if (!updated) return { error: "Combatant not found — try refreshing the page" };
  return {};
}

export async function addEnemyAction(
  campaignId: string,
  data: {
    displayName: string;
    initiativeTotal: number;
    hidden: boolean;
    hpTotal?: number;
    hpCurrent?: number;
    eac?: number;
    kac?: number;
  }
): Promise<void> {
  await requireDm(campaignId);
  const battle = await getActiveBattleForCampaign(campaignId);
  if (!battle) throw new Error("No active battle");

  await insertEnemyCombatant({ battleId: battle.id, ...data });

  if (battle.status === "active") {
    // Capture the current combatant's ID before re-sorting
    const before = await getBattleCombatants(battle.id);
    const beforeSorted = before.filter((c) => c.sortOrder !== null).sort((a, b) => a.sortOrder! - b.sortOrder!);
    const currentId = beforeSorted[battle.currentTurnIndex]?.id;

    // Re-sort all combatants by initiative descending and reassign sort_order
    const all = await getBattleCombatants(battle.id);
    const resorted = [...all].sort((a, b) => (b.initiativeTotal ?? 0) - (a.initiativeTotal ?? 0));
    await updateCombatantSortOrders(resorted.map((c, i) => ({ id: c.id, sortOrder: i })));

    // Keep current_turn_index pointing at the same combatant
    if (currentId) {
      const newIndex = resorted.findIndex((c) => c.id === currentId);
      if (newIndex !== -1 && newIndex !== battle.currentTurnIndex) {
        await updateBattleTurn(battle.id, { currentTurnIndex: newIndex, currentRound: battle.currentRound });
      }
    }
  }
}

export async function beginBattleAction(
  campaignId: string
): Promise<{ error?: string }> {
  await requireDm(campaignId);
  const battle = await getActiveBattleForCampaign(campaignId);
  if (!battle) return { error: "No active battle" };

  const combatants = await getBattleCombatants(battle.id);
  const pcsPending = combatants.filter((c) => c.type === "pc" && c.initiativeTotal === null);
  if (pcsPending.length > 0) {
    const names = pcsPending.map((c) => c.displayName).join(", ");
    return { error: `Waiting for initiative from: ${names}` };
  }

  const sorted = [...combatants].sort((a, b) => (b.initiativeTotal ?? 0) - (a.initiativeTotal ?? 0));
  const updates = sorted.map((c, i) => ({ id: c.id, sortOrder: i }));
  await updateCombatantSortOrders(updates);

  // Start at the first combatant eligible to take a turn (not hidden, not defeated)
  const firstEligible = sorted.findIndex((c) => !c.defeated && !c.hidden);
  await updateBattleTurn(battle.id, {
    currentTurnIndex: firstEligible >= 0 ? firstEligible : 0,
    currentRound: 1,
  });

  await updateBattleStatus(battle.id, "active");
  revalidatePath(`/dashboard/campaigns/${campaignId}/initiative`);
  return {};
}

export async function finishTurnAction(campaignId: string): Promise<void> {
  const user = await requireUser();
  const battle = await getActiveBattleForCampaign(campaignId);
  if (!battle || battle.status !== "active") throw new Error("No active battle");

  const combatants = await getBattleCombatants(battle.id);
  const sorted = combatants.filter((c) => c.sortOrder !== null).sort((a, b) => a.sortOrder! - b.sortOrder!);
  const current = sorted[battle.currentTurnIndex];

  if (!current) throw new Error("Invalid turn state");

  const isDm = await checkIsCampaignDm(campaignId, user.id);
  if (!isDm) {
    if (current.type !== "pc" || !current.characterId) throw new Error("Unauthorized");
    const character = await getCharacterById(current.characterId);
    if (!character || character.ownerId !== user.id) throw new Error("Unauthorized");
  }

  // Eligible = not defeated and not hidden (hidden enemies wait until revealed)
  const eligible = sorted.filter((c) => !c.defeated && !c.hidden);
  const currentEligibleIdx = eligible.findIndex((c) => c.id === current.id);
  const nextEligible = eligible[currentEligibleIdx + 1];

  let nextTurnIndex: number;
  let nextRound = battle.currentRound;

  if (nextEligible) {
    nextTurnIndex = sorted.findIndex((c) => c.id === nextEligible.id);
  } else {
    nextRound += 1;
    const firstEligible = eligible[0];
    nextTurnIndex = firstEligible ? sorted.findIndex((c) => c.id === firstEligible.id) : 0;
  }

  await updateBattleTurn(battle.id, { currentTurnIndex: nextTurnIndex, currentRound: nextRound });
}

export async function markDefeatedAction(campaignId: string, combatantId: string): Promise<void> {
  await requireDm(campaignId);
  const battle = await getActiveBattleForCampaign(campaignId);
  if (!battle) throw new Error("No active battle");

  await updateCombatantDefeated(combatantId, true);

  // If the defeated combatant is current, advance the turn
  const combatants = await getBattleCombatants(battle.id);
  const sorted = combatants.filter((c) => c.sortOrder !== null).sort((a, b) => a.sortOrder! - b.sortOrder!);
  const current = sorted[battle.currentTurnIndex];
  if (current?.id === combatantId) {
    const eligible = sorted.filter((c) => !c.defeated && !c.hidden && c.id !== combatantId);
    const nextIdx = eligible[0] ? sorted.findIndex((c) => c.id === eligible[0].id) : 0;
    await updateBattleTurn(battle.id, { currentTurnIndex: nextIdx, currentRound: battle.currentRound });
  }
}

export async function revealEnemyAction(campaignId: string, combatantId: string): Promise<void> {
  await requireDm(campaignId);
  await updateCombatantHidden(combatantId, false);
}

export async function updateEnemyStatsAction(
  campaignId: string,
  combatantId: string,
  data: { hpTotal?: number; hpCurrent?: number; eac?: number; kac?: number }
): Promise<void> {
  await requireDm(campaignId);
  await updateEnemyStats(combatantId, data);
}

export async function endInitiativeAction(campaignId: string): Promise<void> {
  await requireDm(campaignId);
  const battle = await getActiveBattleForCampaign(campaignId);
  if (!battle) return;
  await deleteBattle(battle.id);
  revalidatePath(`/dashboard/campaigns/${campaignId}/initiative`);
}

export async function updateCharacterHealthAction(
  campaignId: string,
  characterId: string,
  values: HealthResolveValues
): Promise<void> {
  const user = await requireUser();
  const character = await getCharacterById(characterId);
  if (!character) throw new Error("Character not found");
  const isDm = await checkIsCampaignDm(campaignId, user.id);
  const isOwner = character.ownerId === user.id;
  if (!isDm && !isOwner) throw new Error("Unauthorized");
  await updateHealthResolve(characterId, values);
}
