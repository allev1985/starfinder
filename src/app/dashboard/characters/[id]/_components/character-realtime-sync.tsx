"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useCharacter } from "./character-context";
import type { Condition } from "@/db/schema";

interface Props {
  allConditions: Condition[];
}

export default function CharacterRealtimeSync({ allConditions }: Props) {
  const {
    characterId,
    setHealthValues,
    setCombatMods,
    setScores,
    setLevel,
    setCredits,
    setXpEarned,
    activeConditions,
    setActiveConditions,
  } = useCharacter();

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`character-sync-${characterId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "character_combat_stats",
          filter: `character_id=eq.${characterId}`,
        },
        (payload) => {
          const row = payload.new as Record<string, number>;
          setHealthValues({
            staminaPointsTotal: row.stamina_points_total,
            staminaPointsCurrent: row.stamina_points_current,
            hitPointsTotal: row.hit_points_total,
            hitPointsCurrent: row.hit_points_current,
            resolvePointsTotal: row.resolve_points_total,
            resolvePointsCurrent: row.resolve_points_current,
          });
          setCombatMods({
            initiativeMiscMod: row.initiative_misc_mod,
            baseAttackBonus: row.base_attack_bonus,
            eacMiscMod: row.eac_misc_mod,
            kacMiscMod: row.kac_misc_mod,
            fortBaseSave: row.fort_base_save,
            fortMiscMod: row.fort_misc_mod,
            refBaseSave: row.ref_base_save,
            refMiscMod: row.ref_misc_mod,
            willBaseSave: row.will_base_save,
            willMiscMod: row.will_misc_mod,
            meleeAttackMiscMod: row.melee_attack_misc_mod,
            rangedAttackMiscMod: row.ranged_attack_misc_mod,
            thrownAttackMiscMod: row.thrown_attack_misc_mod,
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "characters",
          filter: `id=eq.${characterId}`,
        },
        (payload) => {
          const row = payload.new as Record<string, number>;
          setLevel(row.level);
          setScores({
            strScore: row.str_score,
            dexScore: row.dex_score,
            conScore: row.con_score,
            intScore: row.int_score,
            wisScore: row.wis_score,
            chaScore: row.cha_score,
          });
          setCredits(row.credits);
          setXpEarned(row.xp_earned);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "character_conditions",
          filter: `character_id=eq.${characterId}`,
        },
        (payload) => {
          const row = payload.new as { condition_id: string };
          const condition = allConditions.find((c) => c.id === row.condition_id);
          if (!condition) return;
          if (activeConditions.some((c) => c.id === condition.id)) return;
          setActiveConditions([...activeConditions, condition].sort((a, b) => a.name.localeCompare(b.name)));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "character_conditions",
          filter: `character_id=eq.${characterId}`,
        },
        (payload) => {
          const row = payload.old as { condition_id: string };
          setActiveConditions(activeConditions.filter((c) => c.id !== row.condition_id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [characterId, setHealthValues, setCombatMods, setScores, setLevel, setCredits, setXpEarned, allConditions, activeConditions, setActiveConditions]);

  return null;
}
