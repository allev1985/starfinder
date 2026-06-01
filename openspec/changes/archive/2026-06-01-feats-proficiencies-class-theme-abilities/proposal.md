## Why

Character sheets in Starfinder are largely useless without a character's class features, theme features, feats, and weapon proficiencies — these define what the character can actually do. Currently the sheet tracks class and theme as identifiers only, with no display of the abilities those choices grant.

## What Changes

- **New**: `class_abilities` reference table — CRB class features with level, description, and choice-pool metadata
- **New**: `class_ability_options` reference table — selectable sub-options for choice-based features (fighting styles, improvisations, connections, exploits, etc.)
- **New**: `theme_abilities` reference table — CRB theme features at levels 1, 6, 12, 18
- **New**: `feats` reference table — CRB general and combat feats with prerequisites and descriptions
- **New**: `class_weapon_proficiency` junction table — weapon categories each class is proficient with (parallel to existing `class_armor_proficiency`)
- **New**: `character_class_choices` table — records what a character selected for choice-based and repeatable class feature slots
- **New**: `character_feats` table — feats a character has taken; linked to `feats` reference or stored as custom freetext
- **New**: Seed data for all CRB classes (7), themes (10), and feats (~100), including full CRB descriptions
- **New**: Class Features section on the character sheet — auto-displays features earned at/below current level; choice slots show a picker backed by `class_ability_options`
- **New**: Theme Features section on the character sheet — auto-displays features earned at/below current level
- **New**: Feats section on the character sheet — managed list with reference picker and custom-feat fallback
- **New**: Weapon Proficiencies display on the character sheet — derived from class, no character data required
- **Unchanged**: All modifier/ability score values remain manual; no auto-application of bonuses from features or feats

## Capabilities

### New Capabilities

- `class-abilities-reference`: `class_abilities` and `class_ability_options` reference tables; seeding of all CRB class features and their selectable sub-options
- `theme-abilities-reference`: `theme_abilities` reference table; seeding of all CRB theme features
- `feats-reference`: `feats` reference table; seeding of all CRB feats with full descriptions and prerequisites
- `class-weapon-proficiency`: `class_weapon_proficiency` junction table; seeding of weapon proficiencies per CRB class
- `character-class-features`: Character sheet display of class features by level; choice/repeatable slot pickers backed by reference data; `character_class_choices` persistence
- `character-theme-features`: Character sheet display of theme features by level
- `character-feats`: Character sheet feats section; reference-linked feat picker with custom-feat fallback; `character_feats` persistence

### Modified Capabilities

- `db-schema`: New tables added — `class_abilities`, `class_ability_options`, `theme_abilities`, `feats`, `class_weapon_proficiency`, `character_class_choices`, `character_feats`
- `crb-reference-data`: Expanded to cover class abilities, class ability options, theme abilities, feats, and weapon proficiencies

## Impact

- `src/db/schema.ts` — seven new tables and associated type exports
- `src/db/queries/reference.ts` — new queries for class abilities, theme abilities, feats, weapon proficiencies
- `src/db/queries/characters.ts` — new queries for character class choices and character feats
- New migration files for schema additions
- New seed scripts for class abilities, theme abilities, feats, and weapon proficiencies
- `src/app/dashboard/characters/[id]/page.tsx` — fetch class abilities, theme abilities, feats, and weapon proficiency data
- New components: `ClassFeaturesSection`, `ThemeFeaturesSection`, `FeatsSection`
- No breaking changes to existing tables or APIs
