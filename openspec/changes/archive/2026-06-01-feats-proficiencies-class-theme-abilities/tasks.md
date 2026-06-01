## 1. Schema

- [x] 1.1 Add `class_abilities` table to `src/db/schema.ts` with columns: `id`, `classId`, `name`, `description`, `level`, `repeatable`, `choicePool`, `sourceBook`; export `ClassAbility` and `NewClassAbility` types
- [x] 1.2 Add `class_ability_options` table to `src/db/schema.ts` with columns: `id`, `classId`, `poolName`, `name`, `description`, `prerequisites`, `sourceBook`; export `ClassAbilityOption` and `NewClassAbilityOption` types
- [x] 1.3 Add `theme_abilities` table to `src/db/schema.ts` with columns: `id`, `themeId`, `name`, `description`, `level`, `sourceBook`; export `ThemeAbility` and `NewThemeAbility` types
- [x] 1.4 Add `feats` table to `src/db/schema.ts` with columns: `id`, `name`, `description`, `prerequisites`, `isCombatFeat`, `sourceBook`; export `Feat` and `NewFeat` types
- [x] 1.5 Add `class_weapon_proficiency` table to `src/db/schema.ts` with composite PK `(classId, weaponCategory)` using existing `weaponCategory` enum; export types
- [x] 1.6 Add `character_class_choices` table to `src/db/schema.ts` with columns: `id`, `characterId` (cascade delete), `classAbilityId`, `optionId` (nullable FK → `class_ability_options`), `customValue` (nullable), `acquiredAtLevel`; export `CharacterClassChoice` and `NewCharacterClassChoice` types
- [x] 1.7 Add `character_feats` table to `src/db/schema.ts` with columns: `id`, `characterId` (cascade delete), `featId` (nullable FK → `feats`), `customName` (nullable), `notes` (nullable); export `CharacterFeat` and `NewCharacterFeat` types
- [x] 1.8 Generate migration file via `npm run db:generate`

## 2. Seed Migrations — Weapon Proficiencies

- [x] 2.1 Write seed migration for `class_weapon_proficiency` covering all 7 CRB classes per the proficiency matrix in `class-weapon-proficiency/spec.md`
- [x] 2.2 Apply migration and verify row counts match expected totals

## 3. Seed Migrations — Class Abilities (Envoy)

- [x] 3.1 Write seed migration for Envoy `class_abilities` (Expertise at levels 1, 7, 12, 18; Expertise Talent at levels 2, 4, 6, 8, 10, 12, 14, 16, 18, 20; Improvisation as repeatable at levels 1–20; Skill Expertise at level 3; etc.) with full CRB descriptions
- [x] 3.2 Write seed migration for Envoy `class_ability_options` pool `improvisation` covering all CRB improvisation options with full descriptions

## 4. Seed Migrations — Class Abilities (Mechanic)

- [x] 4.1 Write seed migration for Mechanic `class_abilities` (Artificial Intelligence at level 1, Bypass, Overload, Remote Hack, Miracle Worker, Override, etc.) with full CRB descriptions
- [x] 4.2 Write seed migration for Mechanic `class_ability_options` pools `ai_type` (Drone / Exocortex) and `mechanic_trick` covering all CRB tricks

## 5. Seed Migrations — Class Abilities (Mystic)

- [x] 5.1 Write seed migration for Mystic `class_abilities` (Connection at level 1, Healing Touch, Mindlink, Healing Channel, Telepathic Bond, etc.) with full CRB descriptions
- [x] 5.2 Write seed migration for Mystic `class_ability_options` pool `connection` covering all 7 CRB connections with full descriptions
- [x] 5.3 Write seed migration for Mystic `class_ability_options` pool `mystic_spell` covering connection spells (these are already covered by the spells table; link by name reference in description)

## 6. Seed Migrations — Class Abilities (Operative)

- [x] 6.1 Write seed migration for Operative `class_abilities` (Trick Attack at level 1, Operative's Edge, Specialization, Debilitating Trick, Uncanny Agility, Evasion, etc.) with full CRB descriptions
- [x] 6.2 Write seed migration for Operative `class_ability_options` pools `specialization` (Daredevil, Ghost, Hacker, Spy, Thief) and `operative_exploit` covering all CRB exploits

## 7. Seed Migrations — Class Abilities (Solarian)

- [x] 7.1 Write seed migration for Solarian `class_abilities` (Stellar Attunement, Solar Manifestation, Sidereal Influence, Stellar Rush, Flare, Supernova, etc.) with full CRB descriptions
- [x] 7.2 Write seed migration for Solarian `class_ability_options` pools `solar_manifestation` (Solar Armor / Solar Weapon) and `stellar_revelation` covering all CRB revelations

## 8. Seed Migrations — Class Abilities (Soldier)

- [x] 8.1 Write seed migration for Soldier `class_abilities` (Fighting Style at level 1, Weapon Specialization, Combat Feat, Style Technique, Gear Boost, etc.) with full CRB descriptions
- [x] 8.2 Write seed migration for Soldier `class_ability_options` pool `fighting_style` covering all 7 CRB fighting styles (Arcane Assailant, Blitz, Bombard, Guard, Hit-and-Run, Sharpshoot, Teamwork) with full descriptions and techniques
- [x] 8.3 Write seed migration for Soldier `class_ability_options` pool `gear_boost` covering all CRB gear boosts

## 9. Seed Migrations — Class Abilities (Technomancer)

- [x] 9.1 Write seed migration for Technomancer `class_abilities` (Spell Cache at level 1, Magic Hack, Techlore, Weapon Specialization, Resolve Attunement, etc.) with full CRB descriptions
- [x] 9.2 Write seed migration for Technomancer `class_ability_options` pool `magic_hack` covering all CRB magic hacks

## 10. Seed Migrations — Theme Abilities

- [x] 10.1 Write seed migration for `theme_abilities` covering all 10 CRB themes × 4 levels (Ace Pilot, Bounty Hunter, Icon, Mercenary, Outlaw, Priest, Scholar, Spacefarer, Street Rat, Themeless) with full CRB descriptions
- [x] 10.2 Apply migration and verify `SELECT COUNT(*) FROM theme_abilities` = 40

## 11. Seed Migrations — Feats

- [x] 11.1 Write seed migration for `feats` covering all CRB general feats with full descriptions, prerequisites, and `is_combat_feat` flags (first half alphabetically, A–L)
- [x] 11.2 Write seed migration for `feats` covering all CRB combat and general feats (M–Z) with full descriptions and prerequisites
- [x] 11.3 Apply migrations and verify `SELECT COUNT(*) FROM feats WHERE source_book = 'crb'` ≥ 90

## 12. Reference Queries

- [x] 12.1 Add `getClassAbilities(classId: string)` to `src/db/queries/reference.ts` — returns all rows for the class ordered by level asc, name asc
- [x] 12.2 Add `getClassAbilityOptions(classId: string, poolName: string)` to `src/db/queries/reference.ts`
- [x] 12.3 Add `getThemeAbilities(themeId: string)` to `src/db/queries/reference.ts` — returns rows ordered by level asc
- [x] 12.4 Add `searchFeats(query: string)` to `src/db/queries/reference.ts` — case-insensitive substring match on name, limit 20, ordered alphabetically
- [x] 12.5 Add `getWeaponProficienciesForClass(classId: string)` to `src/db/queries/reference.ts`

## 13. Character Queries

- [x] 13.1 Add `getCharacterClassChoices(characterId: string)` to `src/db/queries/characters.ts`
- [x] 13.2 Add `upsertCharacterClassChoice(data: NewCharacterClassChoice)` to `src/db/queries/characters.ts` — upsert on `(character_id, class_ability_id, acquired_at_level)`
- [x] 13.3 Add `getCharacterFeats(characterId: string)` to `src/db/queries/characters.ts` — joins `feats` table for reference-linked feats
- [x] 13.4 Add `addCharacterFeat(data: NewCharacterFeat)` to `src/db/queries/characters.ts`
- [x] 13.5 Add `removeCharacterFeat(id: string, characterId: string)` to `src/db/queries/characters.ts`

## 14. Server Actions

- [x] 14.1 Add `saveClassChoice` server action in `src/app/dashboard/characters/[id]/actions.ts` — validates ownership, calls `upsertCharacterClassChoice`
- [x] 14.2 Add `addFeat` server action — validates ownership, calls `addCharacterFeat`; handles both reference and custom-name cases
- [x] 14.3 Add `removeFeat` server action — validates ownership, calls `removeCharacterFeat`
- [x] 14.4 Add `searchFeatsAction` server action — wraps `searchFeats` query for use from client components

## 15. ClassFeaturesSection Component

- [x] 15.1 Create `src/app/dashboard/characters/[id]/_components/class-features-section.tsx` as a client component; accepts `classAbilities`, `abilityOptions` (keyed by pool), `savedChoices`, `weaponProficiencies`, `characterLevel`, `characterId`, `isOwner` props
- [x] 15.2 Implement level-grouped rendering of deterministic features (expandable description on click/tap)
- [x] 15.3 Implement single-slot picker for non-repeatable choice features using shadcn Command/Popover; wire to `saveClassChoice` action with debounced save pattern
- [x] 15.4 Implement repeatable slot rendering: derive N slots from level, render N pickers each with `acquiredAtLevel`; wire each to `saveClassChoice`
- [x] 15.5 Implement Weapon Proficiencies subsection as badge list below class features

## 16. ThemeFeaturesSection Component

- [x] 16.1 Create `src/app/dashboard/characters/[id]/_components/theme-features-section.tsx` as a client component; accepts `themeAbilities`, `characterLevel` props
- [x] 16.2 Render all 4 milestone levels; unlocked features show name + expandable description; locked features show greyed name and required level indicator

## 17. FeatsSection Component

- [x] 17.1 Create `src/app/dashboard/characters/[id]/_components/feats-section.tsx` as a client component; accepts `characterFeats`, `characterId`, `isOwner` props
- [x] 17.2 Render feat list; reference-linked feats show name + expandable description + prerequisites; custom feats show name only
- [x] 17.3 Implement "Add Feat" button that opens a Command/Popover picker; picker calls `searchFeatsAction` on input change and renders results
- [x] 17.4 Implement "Add custom feat" option in picker that prompts for name input then calls `addFeat` action
- [x] 17.5 Implement per-feat remove button (owner-only) that calls `removeFeat` action

## 18. Wire Into Character Page

- [x] 18.1 Add data fetches to `src/app/dashboard/characters/[id]/page.tsx`: `getClassAbilities`, `getClassAbilityOptions` (for all pools needed by the character's class), `getThemeAbilities`, `getWeaponProficienciesForClass`, `getCharacterClassChoices`, `getCharacterFeats`
- [x] 18.2 Render `<ClassFeaturesSection />` on the character sheet after the combat stats section
- [x] 18.3 Render `<ThemeFeaturesSection />` after the Class Features section
- [x] 18.4 Render `<FeatsSection />` after the Theme Features section

## 19. Lint and Type Check

- [x] 19.1 Run `npm run lint` and fix all errors
- [x] 19.2 Run `npx tsc --noEmit` and fix all type errors
