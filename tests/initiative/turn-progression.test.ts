import { describe, it, expect, vi, beforeEach } from "vitest";
import { battleFixture } from "../fixtures/campaign";
import type { BattleCombatant } from "@/db/schema";

vi.mock("@/lib/session");
vi.mock("@/db/queries/battles");
vi.mock("@/db/queries/campaigns");
vi.mock("@/db/queries/characters");

import { finishTurnAction } from "@/app/dashboard/campaigns/[id]/initiative/actions";
import { getUser } from "@/lib/session";
import {
  getActiveBattleForCampaign,
  getBattleCombatants,
  updateBattleTurn,
} from "@/db/queries/battles";
import { checkIsCampaignGm } from "@/db/queries/campaigns";

const mockGetUser = vi.mocked(getUser);
const mockGetActiveBattle = vi.mocked(getActiveBattleForCampaign);
const mockGetCombatants = vi.mocked(getBattleCombatants);
const mockUpdateTurn = vi.mocked(updateBattleTurn);
const mockCheckIsGm = vi.mocked(checkIsCampaignGm);

function makeCombatant(overrides: Partial<BattleCombatant> & { id: string; sortOrder: number }): BattleCombatant {
  return {
    battleId: "battle-001",
    type: "pc",
    characterId: null,
    displayName: "Fighter",
    initiativeTotal: 10,
    hidden: false,
    defeated: false,
    hpTotal: null,
    hpCurrent: null,
    eac: null,
    kac: null,
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  mockGetUser.mockResolvedValue({ id: "user-dm-001", email: "dm@test.com" } as Awaited<ReturnType<typeof getUser>>);
  mockCheckIsGm.mockResolvedValue(true);
  mockUpdateTurn.mockResolvedValue(undefined);
});

describe("finishTurnAction — normal advance", () => {
  it("advances to the next eligible combatant", async () => {
    // Arrange: A (idx 0) → B (idx 1) → C (idx 2), all eligible, A's turn
    const combatants = [
      makeCombatant({ id: "a", sortOrder: 0 }),
      makeCombatant({ id: "b", sortOrder: 1 }),
      makeCombatant({ id: "c", sortOrder: 2 }),
    ];
    const battle = { ...battleFixture, currentTurnIndex: 0, currentRound: 1 };
    mockGetActiveBattle.mockResolvedValue(battle);
    mockGetCombatants.mockResolvedValue(combatants);

    // Act
    await finishTurnAction("campaign-001");

    // Assert: moves to index 1, same round
    expect(mockUpdateTurn).toHaveBeenCalledWith(battle.id, { currentTurnIndex: 1, currentRound: 1 });
  });
});

describe("finishTurnAction — skip defeated", () => {
  it("skips a defeated combatant and goes to the next eligible one", async () => {
    // Arrange: A (idx 0), B defeated (idx 1), C (idx 2) — A's turn ends
    const combatants = [
      makeCombatant({ id: "a", sortOrder: 0 }),
      makeCombatant({ id: "b", sortOrder: 1, defeated: true }),
      makeCombatant({ id: "c", sortOrder: 2 }),
    ];
    const battle = { ...battleFixture, currentTurnIndex: 0, currentRound: 1 };
    mockGetActiveBattle.mockResolvedValue(battle);
    mockGetCombatants.mockResolvedValue(combatants);

    // Act
    await finishTurnAction("campaign-001");

    // Assert: B is skipped, moves to index 2
    expect(mockUpdateTurn).toHaveBeenCalledWith(battle.id, { currentTurnIndex: 2, currentRound: 1 });
  });
});

describe("finishTurnAction — skip hidden", () => {
  it("skips a hidden combatant and goes to the next eligible one", async () => {
    // Arrange: A (idx 0), B hidden (idx 1), C (idx 2) — A's turn ends
    const combatants = [
      makeCombatant({ id: "a", sortOrder: 0 }),
      makeCombatant({ id: "b", sortOrder: 1, hidden: true }),
      makeCombatant({ id: "c", sortOrder: 2 }),
    ];
    const battle = { ...battleFixture, currentTurnIndex: 0, currentRound: 1 };
    mockGetActiveBattle.mockResolvedValue(battle);
    mockGetCombatants.mockResolvedValue(combatants);

    // Act
    await finishTurnAction("campaign-001");

    // Assert: B is skipped, moves to index 2
    expect(mockUpdateTurn).toHaveBeenCalledWith(battle.id, { currentTurnIndex: 2, currentRound: 1 });
  });
});

describe("finishTurnAction — round wrap", () => {
  it("wraps to round 2 when the last eligible combatant finishes", async () => {
    // Arrange: A, B, C all eligible — C's turn (idx 2) ends
    const combatants = [
      makeCombatant({ id: "a", sortOrder: 0 }),
      makeCombatant({ id: "b", sortOrder: 1 }),
      makeCombatant({ id: "c", sortOrder: 2 }),
    ];
    const battle = { ...battleFixture, currentTurnIndex: 2, currentRound: 1 };
    mockGetActiveBattle.mockResolvedValue(battle);
    mockGetCombatants.mockResolvedValue(combatants);

    // Act
    await finishTurnAction("campaign-001");

    // Assert: wraps to A (idx 0), round increments to 2
    expect(mockUpdateTurn).toHaveBeenCalledWith(battle.id, { currentTurnIndex: 0, currentRound: 2 });
  });

  it("wraps to first eligible when head of list is defeated", async () => {
    // Arrange: A defeated (idx 0), B (idx 1), C (idx 2) — C's turn ends
    const combatants = [
      makeCombatant({ id: "a", sortOrder: 0, defeated: true }),
      makeCombatant({ id: "b", sortOrder: 1 }),
      makeCombatant({ id: "c", sortOrder: 2 }),
    ];
    const battle = { ...battleFixture, currentTurnIndex: 2, currentRound: 1 };
    mockGetActiveBattle.mockResolvedValue(battle);
    mockGetCombatants.mockResolvedValue(combatants);

    // Act
    await finishTurnAction("campaign-001");

    // Assert: wraps to B (idx 1, first eligible), round = 2
    expect(mockUpdateTurn).toHaveBeenCalledWith(battle.id, { currentTurnIndex: 1, currentRound: 2 });
  });
});
