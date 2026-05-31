## Context

The character sheet currently stores `eac_armor_bonus` and `kac_armor_bonus` as manually-entered integers in `character_combat_stats`. There is no armor reference table — players look up and type numbers themselves. The DEX modifier applied to EAC/KAC is also uncapped in the current formula, which is mechanically incorrect (armor imposes a max DEX bonus in Starfinder 1e).

This design adds a proper armor repository (CRB seed), class proficiency gating, and wires the character sheet to derive bonuses from an equipped armor row rather than manual input.

## Goals / Non-Goals

**Goals:**
- Single source of truth for armor stats: `armor` table, equipped via FK on `characters`
- Class-filtered armor picker: only show armor types the character's class can use
- Fix the DEX cap bug: apply `max_dex_bonus` when computing EAC/KAC totals
- Seed all CRB light and heavy armor; seed powered armor (unreachable until feats)
- Keep `eac_misc_mod` / `kac_misc_mod` editable for non-armor bonuses

**Non-Goals:**
- Armor upgrades (slots are stored as a count, but no upgrade item table)
- Powered armor proficiency (deferred to feat system)
- Non-CRB armor (Armory, Near Space, etc.)
- Armor pricing / shopping / economy features
- Bulk tracking or encumbrance system

## Decisions

### Drop `eac_armor_bonus` / `kac_armor_bonus` from `character_combat_stats`

**Decision**: Remove both columns; derive bonus from `characters.equipped_armor_id → armor.eac_bonus / armor.kac_bonus` at query time.

**Alternatives considered**:
- Keep fields as a writable override that armor selection pre-fills → two sources of truth with no clear winner on conflict. Rejected.
- Keep fields as computed cache → write-through on armor selection → still requires sync logic, no benefit over a join.

**Rationale**: The existing data is semantically meaningless without a real armor row behind it. Characters created before this change had no armor repository to draw from, so stored values are arbitrary. A clean break is safe and produces a correct single-source model.

### `class_armor_proficiency` as a database table (not a code constant)

**Decision**: Seed a `class_armor_proficiency` join table (`class_id`, `armor_type` PK).

**Alternatives considered**:
- Hardcode a `PROFICIENT_ARMOR_TYPES: Record<string, ArmorType[]>` constant in `src/lib/armor.ts` → simpler to query but couples class identity to string keys that can drift from the DB. Rejected.

**Rationale**: Follows the established `class_skills` pattern. Keeps all class capability data in the database where it can be joined, not scattered between DB and code.

### Powered armor: seed but exclude from picker

**Decision**: Seed powered armor rows (`source_book = 'crb'`) but omit `powered` from every class's proficiency rows. The picker filter means powered armor is unreachable without a feat system.

**Rationale**: Data is correct and complete; the access gate (feat) is simply not modeled yet. No dead code — the armor rows serve their purpose the moment feat modeling lands.

### Armor combobox placement

**Decision**: Render the armor picker above the EAC/KAC AC sub-grid, inside the existing `CombatStatsSection` component.

**Rationale**: Armor directly governs EAC and KAC — co-locating the picker with the stat rows it affects is the clearest UX. A separate "Equipment" section would require the user to navigate away to change armor mid-combat review.

### DEX cap implementation

**Decision**: Apply cap client-side in the component formula using `armor?.max_dex_bonus`.

```ts
const effectiveDex = armor?.maxDexBonus != null
  ? Math.min(dexMod, armor.maxDexBonus)
  : dexMod;
```

**Rationale**: EAC/KAC totals are always derived on the client and never stored, consistent with the existing pattern for all other derived combat stats.

### Bulk stored as text

**Decision**: `bulk` column is `text` — stores "L", "—", or a numeral string ("1", "2", etc.).

**Rationale**: Bulk is display-only in this feature. No arithmetic is needed (encumbrance is out of scope). Storing as text avoids a non-obvious numeric encoding ("L" = 0.1?) that would only confuse readers of the seed SQL.

## Risks / Trade-offs

- **Seed data accuracy** — Stats must be transcribed from Archives of Nethys (aonprd.com). A transcription error (wrong EAC bonus, wrong max DEX) would silently produce wrong totals on every character using that armor. Mitigation: cross-reference each row against the physical CRB during implementation; add a comment in the seed SQL noting the source.

- **Breaking migration** — Dropping `eac_armor_bonus` / `kac_armor_bonus` is irreversible without a snapshot backup. Existing data (manually typed numbers) has no semantic meaning and is intentionally discarded. Mitigation: the Supabase project has point-in-time recovery; document the drop in the migration comment.

- **Characters with no class** — If `characters.class_id` is null, the proficiency join returns no rows and the picker is empty. The user cannot select armor until they set a class. This is the correct behavior but may be surprising. Mitigation: show a placeholder message in the combobox: "Select a class to enable armor selection."

## Migration Plan

1. Add `armor_type` enum and `armor` table DDL
2. Add `class_armor_proficiency` table DDL
3. Seed CRB armor rows (light + heavy + powered)
4. Seed class proficiency rows (light/heavy per class, no powered)
5. Add `equipped_armor_id` nullable FK to `characters`
6. Drop `eac_armor_bonus` and `kac_armor_bonus` from `character_combat_stats`

Each step is a separate migration file. Steps 5 and 6 can be combined in one migration since they touch different tables with no dependency between them. Rollback: Supabase point-in-time recovery; no application-level rollback strategy needed given data was arbitrary.

## Open Questions

- None — design is fully resolved based on exploration session decisions.
