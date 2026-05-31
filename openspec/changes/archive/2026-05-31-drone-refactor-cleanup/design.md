## Context

The rename migration `20260531150000_rename_android_to_droid.sql` contained this line:

```sql
UPDATE "race_descriptions" SET "race_type" = 'biological' WHERE "race_type" = 'droid';
```

The intent was to re-classify the Android *playable race* row as biological. But `race_descriptions` rows are keyed by race *type* (enum), not by race name, so the UPDATE swept all 5 drone description rows (`f2000000-*`: Chassis Type, Size, Land Speed, Fly Speed, Climb Speed) into biological. The subsequent `rename_droid_to_drone` migration didn't touch `race_descriptions`, leaving drone at 0 rows.

Current DB state:
- `biological`: 12 rows (7 correct + 5 misplaced drone fields)
- `drone`: 0 rows

The `DRONE_SKILL_NAMES` duplication exists because `reference.ts` is `server-only` and cannot be imported by the client component `skills-section.tsx`. Both define the same 6-element list independently.

## Goals / Non-Goals

**Goals:**
- Restore drone description rows to `race_type = 'drone'`
- Remove misplaced drone fields from biological
- Eliminate `DRONE_SKILL_NAMES` duplication
- Rename `ANDROID_ROWS` → `DRONE_ROWS`

**Non-Goals:**
- Changing which description fields exist for drones
- Any UI changes beyond the constant rename

## Decisions

### Decision: Fix via UPDATE migration, not delete/re-insert

The 5 rows already have stable UUIDs (`f2000000-*`) referenced by any existing `character_descriptions` data. Updating `race_type` in-place preserves those FKs. A delete/re-insert would orphan existing character description values.

### Decision: Shared constants file at `src/lib/drone.ts`

A plain TypeScript file (no `server-only` directive) can be imported by both server query files and client components. It exports only the skill names array — no DB logic.

## Risks / Trade-offs

- **No risk** to existing drone character description values — the FK in `character_descriptions` points to `race_descriptions.id`, not `race_type`. The UPDATE only changes the enum column.
- The `DRONE_SKILL_NAMES` constant appears in both a server context (array) and a client context (Set). The shared file exports an array; each consumer converts to Set if needed.

## Migration Plan

1. Apply migration: `UPDATE race_descriptions SET race_type = 'drone' WHERE id IN ('f2000000-*' × 5)`
2. No rollback risk — can reverse with `UPDATE ... SET race_type = 'biological'` if needed
