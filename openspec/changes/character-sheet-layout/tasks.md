## 1. Thread health/resolve props into CharacterStatsClient

- [x] 1.1 Add health/resolve props to `CharacterStatsClient` Props type (staminaPointsTotal, staminaPointsCurrent, hitPointsTotal, hitPointsCurrent, resolvePointsTotal, resolvePointsCurrent, raceType already present)
- [x] 1.2 Update `page.tsx` to pass all health/resolve values into `CharacterStatsClient` instead of rendering `HealthResolveSection` separately
- [x] 1.3 Remove the standalone `<HealthResolveSection>` render from `page.tsx`

## 2. Add tab navigation to CharacterStatsClient

- [x] 2.1 Install shadcn Tabs if not already present (`npx shadcn@latest add tabs`)
- [x] 2.2 Wrap `CharacterStatsClient` return in `<Tabs defaultValue="stats">` with `TabsList` containing "Stats" and "Abilities & Gear" triggers
- [x] 2.3 Add conditional "Spells" `TabsTrigger` rendered only when `isSpellcaster` prop is true (thread `isSpellcaster` prop through from `page.tsx`)
- [x] 2.4 Create three `TabsContent` shells: `stats`, `abilities-gear`, `spells`

## 3. Build Stats tab two-column layout

- [x] 3.1 Add `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">` inside the `stats` TabsContent
- [x] 3.2 Left column: render `AbilityScoresSection` then `SkillsSection`
- [x] 3.3 Right column: render `HealthResolveSection` (using threaded props), `CombatStatsSection`, then the Weapons subsection (weapon cards + picker)
- [x] 3.4 Extract weapon-related JSX from `InventorySection` into the right column directly (armor-inventory and equipment-inventory move to tab 2)

## 4. Build Abilities & Gear tab two-column layout

- [x] 4.1 Add `<div className="grid grid-cols-1 md:grid-cols-2 gap-6">` inside the `abilities-gear` TabsContent
- [x] 4.2 Left column: render `ClassFeaturesSection` (conditional on `hasClass`), `ThemeFeaturesSection` (conditional on `hasTheme`), `FeatsSection`
- [x] 4.3 Right column: render `ArmorInventory` then `EquipmentInventory`
- [x] 4.4 Delete or empty `InventorySection` wrapper component; verify no other file imports it

## 5. Wire Spells tab

- [x] 5.1 Move `SpellsSection` from `page.tsx` into the `spells` TabsContent inside `CharacterStatsClient`
- [x] 5.2 Thread all spells props (knownSpells, spellCatalog, spellsKnownLimits, classId) through `CharacterStatsClient` Props
- [x] 5.3 Remove the standalone `SpellsSection` render from `page.tsx`

## 6. Restyle section headers

- [x] 6.1 Update `ability-scores-section.tsx` h2 to `bg-primary text-primary-foreground` label-badge style
- [x] 6.2 Update `skills-section.tsx` h2
- [x] 6.3 Update `health-resolve-section.tsx` h2
- [x] 6.4 Update `combat-stats-section.tsx` all sub-section h2s (Initiative, Armor Class, Saving Throws, Attack Bonuses, Weapons)
- [x] 6.5 Update `class-features-section.tsx` h2
- [x] 6.6 Update `theme-features-section.tsx` h2
- [x] 6.7 Update `feats-section.tsx` h2
- [x] 6.8 Update armor and equipment section headings in their respective components

## 7. Formula-box display in CombatStatsSection

- [x] 7.1 Restyle Initiative row: bordered cell for total + `=` + DEX mod cell + misc mod cell, each with a label above
- [x] 7.2 Restyle EAC row: `[total] = 10 + [armor bonus] + [DEX mod] + [misc mod]` bordered cells
- [x] 7.3 Restyle KAC row: same pattern as EAC
- [x] 7.4 Restyle Fortitude, Reflex, Will rows: `[total] = [base] + [ability mod] + [misc mod]` bordered cells
- [x] 7.5 Restyle Melee, Ranged, Thrown rows: `[total] = [BAB] + [ability mod] + [misc mod]` bordered cells

## 8. Lint, typecheck, and verify

- [x] 8.1 Run `npm run lint` and fix any errors
- [x] 8.2 Run `npx tsc --noEmit` and fix any type errors
- [ ] 8.3 Manually verify Stats tab: ability scores, skills, initiative, health/resolve, armor class, saves, attacks, weapons all render correctly
- [ ] 8.4 Manually verify Abilities & Gear tab: class features, theme features, feats, armor, equipment all render correctly
- [ ] 8.5 Manually verify Spells tab appears for a spellcaster character and is absent for non-spellcasters
- [ ] 8.6 Verify owner-editable fields still save correctly (debounced onChange still works across tabs)
