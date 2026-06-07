import type { Campaign, Battle, BattleCombatant } from "@/db/schema";

export const dmUserId = "user-dm-001";
export const playerUserId = "user-player-001";

export const campaignFixture: Campaign = {
  id: "campaign-001",
  name: "Dead Suns",
  dmId: dmUserId,
  joinCode: "ABC123",
  editionId: "edition-001",
  createdAt: new Date("2025-01-01T00:00:00Z"),
};

export const battleFixture: Battle = {
  id: "battle-001",
  campaignId: "campaign-001",
  status: "active",
  currentRound: 1,
  currentTurnIndex: 0,
  createdAt: new Date("2025-01-01T00:00:00Z"),
};

export const combatantsFixture: BattleCombatant[] = [
  {
    id: "comb-001",
    battleId: "battle-001",
    type: "pc",
    characterId: "char-001",
    displayName: "Aria Voss",
    initiativeTotal: 20,
    hidden: false,
    defeated: false,
    sortOrder: 0,
    hpTotal: null,
    hpCurrent: null,
    eac: null,
    kac: null,
  },
  {
    id: "comb-002",
    battleId: "battle-001",
    type: "enemy",
    characterId: null,
    displayName: "Space Goblin",
    initiativeTotal: 15,
    hidden: false,
    defeated: true,
    sortOrder: 1,
    hpTotal: 12,
    hpCurrent: 0,
    eac: 12,
    kac: 13,
  },
  {
    id: "comb-003",
    battleId: "battle-001",
    type: "enemy",
    characterId: null,
    displayName: "Akata",
    initiativeTotal: 10,
    hidden: false,
    defeated: false,
    sortOrder: 2,
    hpTotal: 20,
    hpCurrent: 20,
    eac: 13,
    kac: 14,
  },
];
