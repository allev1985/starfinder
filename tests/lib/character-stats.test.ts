import { describe, it, expect } from "vitest";
import { calculateCombatStats } from "@/lib/character-stats";
import { characterFixture, combatStatsFixture, armorFixture, shieldFixture } from "../fixtures/character";

const baseInput = {
  scores: {
    strScore: characterFixture.strScore, // 14, mod +2
    dexScore: characterFixture.dexScore, // 16, mod +3
    conScore: characterFixture.conScore, // 12, mod +1
    wisScore: characterFixture.wisScore, // 10, mod +0
  },
  mods: {
    initiativeMiscMod: combatStatsFixture.initiativeMiscMod, // 1
    baseAttackBonus: combatStatsFixture.baseAttackBonus,     // 4
    eacMiscMod: combatStatsFixture.eacMiscMod,               // 0
    kacMiscMod: combatStatsFixture.kacMiscMod,               // 0
    fortBaseSave: combatStatsFixture.fortBaseSave,           // 3
    fortMiscMod: combatStatsFixture.fortMiscMod,             // 0
    refBaseSave: combatStatsFixture.refBaseSave,             // 4
    refMiscMod: combatStatsFixture.refMiscMod,               // 0
    willBaseSave: combatStatsFixture.willBaseSave,           // 2
    willMiscMod: combatStatsFixture.willMiscMod,             // 0
    meleeAttackMiscMod: combatStatsFixture.meleeAttackMiscMod, // 0
    rangedAttackMiscMod: combatStatsFixture.rangedAttackMiscMod, // 0
    thrownAttackMiscMod: combatStatsFixture.thrownAttackMiscMod, // 0
  },
  equippedArmor: null,
  equippedShield: null,
  hasShieldProficiency: false,
};

describe("calculateCombatStats — effectiveDex", () => {
  it("returns full dex mod when no armor or shield", () => {
    // Arrange
    const input = { ...baseInput, equippedArmor: null, equippedShield: null };
    // Act
    const result = calculateCombatStats(input);
    // Assert: dex 16 → mod +3
    expect(result.effectiveDex).toBe(3);
  });

  it("caps effectiveDex at armor maxDexBonus when lower than dex mod", () => {
    // Arrange: dex mod = +3, armor maxDex = 2
    const input = {
      ...baseInput,
      equippedArmor: { eacBonus: armorFixture.eacBonus, kacBonus: armorFixture.kacBonus, maxDexBonus: 2 },
    };
    // Act
    const result = calculateCombatStats(input);
    // Assert
    expect(result.effectiveDex).toBe(2);
  });

  it("takes the min of armor and shield maxDex when both are equipped", () => {
    // Arrange: dex mod = +3, armorMaxDex = 3, shieldMaxDex = 1
    const input = {
      ...baseInput,
      equippedArmor: { eacBonus: armorFixture.eacBonus, kacBonus: armorFixture.kacBonus, maxDexBonus: 3 },
      equippedShield: { ...shieldFixture, maxDexBonus: 1 },
      hasShieldProficiency: true,
    };
    // Act
    const result = calculateCombatStats(input);
    // Assert: min(3,1) = 1
    expect(result.effectiveDex).toBe(1);
  });

  it("uses full dex mod when cap is higher", () => {
    // Arrange: dex mod = +3, armorMaxDex = 5
    const input = {
      ...baseInput,
      equippedArmor: { eacBonus: armorFixture.eacBonus, kacBonus: armorFixture.kacBonus, maxDexBonus: 5 },
    };
    // Act
    const result = calculateCombatStats(input);
    // Assert
    expect(result.effectiveDex).toBe(3);
  });
});

describe("calculateCombatStats — EAC / KAC", () => {
  it("computes EAC = 10 + armorBonus + effectiveDex + miscMod (no shield)", () => {
    // Arrange: armor eac=4, dex mod=3 (no cap), eacMisc=0
    const input = {
      ...baseInput,
      equippedArmor: { eacBonus: 4, kacBonus: 5, maxDexBonus: null },
    };
    // Act
    const result = calculateCombatStats(input);
    // Assert: 10 + 4 + 3 + 0 = 17
    expect(result.eacTotal).toBe(17);
  });

  it("adds shield EAC bonus when proficient", () => {
    // Arrange: base eac = 17, shield eac = 1, proficient
    const input = {
      ...baseInput,
      equippedArmor: { eacBonus: 4, kacBonus: 5, maxDexBonus: null },
      equippedShield: { ...shieldFixture, eacBonus: 1 },
      hasShieldProficiency: true,
    };
    // Act
    const result = calculateCombatStats(input);
    // Assert: 10 + 4 + 1 + 3 + 0 = 18
    expect(result.eacTotal).toBe(18);
  });

  it("ignores shield EAC bonus without proficiency", () => {
    // Arrange: same as above but not proficient
    const input = {
      ...baseInput,
      equippedArmor: { eacBonus: 4, kacBonus: 5, maxDexBonus: null },
      equippedShield: { ...shieldFixture, eacBonus: 1 },
      hasShieldProficiency: false,
    };
    // Act
    const result = calculateCombatStats(input);
    // Assert: shield bonus not included — still 17
    expect(result.eacTotal).toBe(17);
  });

  it("KAC vs CM is always KAC + 8", () => {
    // Arrange: armor kac=5, dex=3, kacMisc=0 → kacTotal = 10+5+3 = 18
    const input = {
      ...baseInput,
      equippedArmor: { eacBonus: 4, kacBonus: 5, maxDexBonus: null },
    };
    // Act
    const { kacTotal, kacVsCm } = calculateCombatStats(input);
    // Assert
    expect(kacVsCm).toBe(kacTotal + 8);
  });
});

describe("calculateCombatStats — attack bonuses", () => {
  it("melee = BAB + strMod + meleeMiscMod", () => {
    // Arrange: BAB=4, str=14 (mod +2), meleeMisc=0
    // Act
    const { meleeTotal } = calculateCombatStats(baseInput);
    // Assert: 4 + 2 + 0 = 6
    expect(meleeTotal).toBe(6);
  });

  it("ranged = BAB + dexMod + rangedMiscMod", () => {
    // Arrange: BAB=4, dex=16 (mod +3), rangedMisc=0
    // Act
    const { rangedTotal } = calculateCombatStats(baseInput);
    // Assert: 4 + 3 + 0 = 7
    expect(rangedTotal).toBe(7);
  });

  it("thrown = BAB + strMod + thrownMiscMod", () => {
    // Arrange: BAB=4, str=14 (mod +2), thrownMisc=0
    // Act
    const { thrownTotal } = calculateCombatStats(baseInput);
    // Assert: 4 + 2 + 0 = 6
    expect(thrownTotal).toBe(6);
  });
});

describe("calculateCombatStats — saving throws", () => {
  it("Fort = fortBase + conMod + fortMiscMod", () => {
    // Arrange: fortBase=3, con=12 (mod +1), fortMisc=0
    // Act
    const { fortTotal } = calculateCombatStats(baseInput);
    // Assert: 3 + 1 + 0 = 4
    expect(fortTotal).toBe(4);
  });

  it("Ref = refBase + dexMod + refMiscMod", () => {
    // Arrange: refBase=4, dex=16 (mod +3), refMisc=0
    // Act
    const { refTotal } = calculateCombatStats(baseInput);
    // Assert: 4 + 3 + 0 = 7
    expect(refTotal).toBe(7);
  });

  it("Will = willBase + wisMod + willMiscMod", () => {
    // Arrange: willBase=2, wis=10 (mod +0), willMisc=0
    // Act
    const { willTotal } = calculateCombatStats(baseInput);
    // Assert: 2 + 0 + 0 = 2
    expect(willTotal).toBe(2);
  });
});

describe("calculateCombatStats — initiative", () => {
  it("initiative = dexMod + initiativeMiscMod", () => {
    // Arrange: dex=16 (mod +3), initiativeMiscMod=1
    // Act
    const { initiativeTotal } = calculateCombatStats(baseInput);
    // Assert: 3 + 1 = 4
    expect(initiativeTotal).toBe(4);
  });
});
