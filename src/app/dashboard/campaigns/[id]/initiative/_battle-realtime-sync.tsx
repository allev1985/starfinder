"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { fetchBattleStateAction } from "./actions";
import type { Battle, BattleCombatant } from "@/db/schema";

type Props = {
  campaignId: string;
  battleId: string | null;
  characterIds: string[];
  onBattleUpdate: (battle: Partial<Battle>) => void;
  onBattleDelete: () => void;
  onCombatantUpdate: (combatant: BattleCombatant) => void;
  onBattleInsert: (battle: Battle, combatants: BattleCombatant[]) => void;
  onHealthUpdate: (
    characterId: string,
    health: { sp: number; hp: number; rp: number }
  ) => void;
};

export default function BattleRealtimeSync({
  campaignId,
  battleId,
  characterIds,
  onBattleUpdate,
  onBattleDelete,
  onCombatantUpdate,
  onBattleInsert,
  onHealthUpdate,
}: Props) {
  useEffect(() => {
    const supabase = createClient();

    const battleChannel = supabase
      .channel(`battle-${campaignId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "battles",
          filter: `campaign_id=eq.${campaignId}`,
        },
        async () => {
          // Fetch full state (battle + combatants) rather than relying on the INSERT
          // payload alone — combatant rows are already inserted by this point.
          const state = await fetchBattleStateAction(campaignId);
          if (state) onBattleInsert(state.battle, state.combatants);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "battles",
          filter: `campaign_id=eq.${campaignId}`,
        },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          onBattleUpdate({
            status: row.status as Battle["status"],
            currentRound: row.current_round as number,
            currentTurnIndex: row.current_turn_index as number,
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "battles",
          // Supabase only supports PK filtering on DELETE events.
          ...(battleId ? { filter: `id=eq.${battleId}` } : {}),
        },
        (payload) => {
          const old = payload.old as Record<string, unknown>;
          if (!battleId && old.campaign_id !== campaignId) return;
          onBattleDelete();
        }
      );

    if (battleId) {
      battleChannel
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "battle_combatants",
            filter: `battle_id=eq.${battleId}`,
          },
          (payload) => {
            const row = payload.new as Record<string, unknown>;
            onCombatantUpdate(sanitizeCombatantRow(row));
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "battle_combatants",
            filter: `battle_id=eq.${battleId}`,
          },
          (payload) => {
            const row = payload.new as Record<string, unknown>;
            onCombatantUpdate(sanitizeCombatantRow(row));
          }
        );
    }

    battleChannel.subscribe();

    const healthChannels = characterIds.map((characterId) =>
      supabase
        .channel(`battle-health-${characterId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "character_combat_stats",
            filter: `character_id=eq.${characterId}`,
          },
          (payload) => {
            const row = payload.new as Record<string, number>;
            onHealthUpdate(characterId, {
              sp: row.stamina_points_current,
              hp: row.hit_points_current,
              rp: row.resolve_points_current,
            });
          }
        )
        .subscribe()
    );

    return () => {
      supabase.removeChannel(battleChannel);
      healthChannels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [campaignId, battleId, characterIds, onBattleUpdate, onBattleDelete, onCombatantUpdate, onBattleInsert, onHealthUpdate]);

  return null;
}

function sanitizeCombatantRow(row: Record<string, unknown>): BattleCombatant {
  return {
    id: row.id as string,
    battleId: row.battle_id as string,
    type: row.type as BattleCombatant["type"],
    characterId: (row.character_id as string | null) ?? null,
    displayName: row.display_name as string,
    initiativeTotal: (row.initiative_total as number | null) ?? null,
    hidden: row.hidden as boolean,
    defeated: row.defeated as boolean,
    sortOrder: (row.sort_order as number | null) ?? null,
    // Enemy stat columns stripped — never applied from client realtime
    hpTotal: null,
    hpCurrent: null,
    eac: null,
    kac: null,
  };
}
