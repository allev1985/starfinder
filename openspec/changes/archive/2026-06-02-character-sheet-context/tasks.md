## 1. Create CharacterContext

- [x] 1.1 Create `src/app/dashboard/characters/[id]/_components/character-context.tsx` with `CharacterState` type, `CharacterContext`, `CharacterProvider` component, and `useCharacter()` hook
- [x] 1.2 Define `CharacterState` to include: `characterId`, `isOwner`, `scores`, `level`, `equippedArmor`, `armorInventory`, `carriedWeapons`, `equipmentInventory`, `feats`, `languages`, `credits`, `xpEarned`, `healthValues`, `combatMods`
- [x] 1.3 Expose a typed setter for each mutable field (`setScores`, `setLevel`, `setEquippedArmor`, `setArmorInventory`, `setCarriedWeapons`, `setEquipmentInventory`, `setFeats`, `setLanguages`, `setCredits`, `setXpEarned`, `setHealthValues`, `setCombatMods`)
- [x] 1.4 `CharacterProvider` accepts all initial values as props, initialises state via `useState`, and renders `CharacterContext.Provider`

## 2. Migrate CharacterStatsClient

- [x] 2.1 Wrap the JSX returned by `CharacterStatsClient` in `<CharacterProvider>` passing all initial values
- [x] 2.2 Remove all `useState` calls from `CharacterStatsClient`
- [x] 2.3 Remove `handleWeaponAdded` and `handleWeaponRemoved` helper functions (move weapon array mutations into context or inline in components)
- [x] 2.4 Remove all `on*Change` callback props from every component usage in JSX

## 3. Update Section Components

- [x] 3.1 Update `LevelControl` — remove `onLevelChange` prop; call `useCharacter()` to get `setLevel`
- [x] 3.2 Update `AbilityScoresSection` — remove `scores` and `onScoreChange` props; use context
- [x] 3.3 Update `SkillsSection` — remove `scores` and `level` props (read-only cross-cuts); use context
- [x] 3.4 Update `CombatStatsSection` — remove `strScore`, `dexScore`, `conScore`, `wisScore`, `mods`, `onModsChange`, `equippedArmor`, `equippedArmorDr`, `equippedArmorResistances` props; use context
- [x] 3.5 Update `HealthResolveSection` — remove `values` and `onValuesChange` props; use context
- [x] 3.6 Update `ArmorInventory` — remove `inventory`, `onInventoryChange`, `onWornArmorChange` props; use context
- [x] 3.7 Update `EquipmentInventory` — remove `inventory` and `onInventoryChange` props; use context
- [x] 3.8 Update `WeaponCard` — remove `characterId` prop; use context
- [x] 3.9 Update `WeaponPicker` — remove `characterId`, `carriedWeaponIds`, `onWeaponAdded` props; use context
- [x] 3.10 Update `FeatsSection` — remove `feats`, `onFeatsChange`, `characterId` props; use context
- [x] 3.11 Update `LanguagesSection` — remove `languages`, `onLanguagesChange`, `characterId` props; use context
- [x] 3.12 Update `CreditsXpSection` — remove `credits`, `xpEarned`, `onCreditsChange`, `onXpChange`, `characterId` props; use context
- [x] 3.13 Update `ClassFeaturesSection` — remove `characterId` prop; use context
- [x] 3.14 Update `SpellsSection` — remove `characterId` prop; use context
- [x] 3.15 Update `DescriptionSection` — remove `characterId` prop; use context
- [x] 3.16 Update `MechanicPanel` — remove `characterId` prop; use context

## 4. Verify

- [x] 4.1 Run `npm run lint` — no errors
- [x] 4.2 Run `npx tsc --noEmit` — no errors
