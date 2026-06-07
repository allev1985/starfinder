## ADDED Requirements

### Requirement: calculateCombatStats is a pure exported function
`src/lib/character-stats.ts` SHALL export a `calculateCombatStats(input: CombatStatsInput): CombatStatsResult` function. It SHALL have no side effects and no imports from the database or React. The component `combat-stats-section.tsx` SHALL be updated to call this function instead of computing the values inline.

#### Scenario: Function is importable without a DOM or DB
- **WHEN** a test file imports `calculateCombatStats` from `@/lib/character-stats`
- **THEN** the import succeeds with no runtime errors

### Requirement: effectiveDex respects armor and shield maxDexBonus caps
The function SHALL compute `effectiveDex` as the dex modifier capped by the lower of armor `maxDexBonus` and shield `maxDexBonus` when both are equipped. If only one is equipped its cap applies. If neither is equipped the full dex modifier is used.

#### Scenario: No armor or shield — full dex mod
- **WHEN** `equippedArmor` is null and `equippedShield` is null and dexScore is 16
- **THEN** `effectiveDex` is 3

#### Scenario: Armor cap lower than dex mod
- **WHEN** dexScore is 18 (mod +4) and `equippedArmor.maxDexBonus` is 2
- **THEN** `effectiveDex` is 2

#### Scenario: Shield cap lower than armor cap
- **WHEN** dexScore is 16 (mod +3), `equippedArmor.maxDexBonus` is 3, `equippedShield.maxDexBonus` is 1
- **THEN** `effectiveDex` is 1

#### Scenario: Dex mod lower than cap — cap has no effect
- **WHEN** dexScore is 14 (mod +2) and `equippedArmor.maxDexBonus` is 5
- **THEN** `effectiveDex` is 2

### Requirement: EAC and KAC include shield bonus only with proficiency
Shield EAC and KAC bonuses SHALL be added to AC totals only when `hasShieldProficiency` is true.

#### Scenario: Shield bonus applied with proficiency
- **WHEN** `hasShieldProficiency` is true and `equippedShield.eacBonus` is 1
- **THEN** `eacTotal` includes the shield bonus

#### Scenario: Shield bonus ignored without proficiency
- **WHEN** `hasShieldProficiency` is false and `equippedShield.eacBonus` is 1
- **THEN** `eacTotal` does not include the shield bonus

### Requirement: KAC vs Combat Maneuvers is KAC + 8
The function SHALL compute `kacVsCm` as `kacTotal + 8`.

#### Scenario: kacVsCm derivation
- **WHEN** `kacTotal` is 15
- **THEN** `kacVsCm` is 23

### Requirement: Attack bonuses and saving throws use standard Starfinder formulas
Melee attack SHALL be `BAB + strMod + meleeMiscMod`. Ranged attack SHALL be `BAB + dexMod + rangedMiscMod`. Thrown attack SHALL be `BAB + strMod + thrownMiscMod`. Fort save SHALL be `fortBase + conMod + fortMiscMod`. Ref save SHALL be `refBase + dexMod + refMiscMod`. Will save SHALL be `willBase + wisMod + willMiscMod`. Initiative SHALL be `dexMod + initiativeMiscMod`.

#### Scenario: Melee attack calculation
- **WHEN** BAB is 4, strScore is 14 (mod +2), meleeMiscMod is 1
- **THEN** `meleeTotal` is 7

#### Scenario: Fort save calculation
- **WHEN** fortBase is 3, conScore is 12 (mod +1), fortMiscMod is 0
- **THEN** `fortTotal` is 4

#### Scenario: Initiative calculation
- **WHEN** dexScore is 16 (mod +3), initiativeMiscMod is 1
- **THEN** `initiativeTotal` is 4
