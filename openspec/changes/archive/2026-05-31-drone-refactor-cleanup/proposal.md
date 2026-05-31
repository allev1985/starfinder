## Why

The rename migration chain (android → droid → drone) incorrectly moved drone description fields to `race_type = 'biological'`, leaving biological character sheets cluttered with drone-specific fields and drone character sheets showing no description section at all. Two smaller code issues also remain: a stale `ANDROID_ROWS` constant name and a duplicated `DRONE_SKILL_NAMES` list defined independently in both a server query file and a client component.

## What Changes

- **Fix**: Migration to move 5 `race_descriptions` rows (`f2000000-*`) from `race_type = 'biological'` back to `race_type = 'drone'`
- **Fix**: Rename `ANDROID_ROWS` → `DRONE_ROWS` in `health-resolve-section.tsx`
- **Fix**: Extract `DRONE_SKILL_NAMES` to a shared non-server-only constants file (`src/lib/drone.ts`); import in both `reference.ts` and `skills-section.tsx`
- **Fix**: Update `openspec/specs/race-descriptions/spec.md` to reflect current enum values (`biological | drone`) and correct field lists

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `race-descriptions`: enum values updated from `biological | android` to `biological | drone`; drone description fields corrected

## Impact

- `supabase/migrations/` — one new migration to fix `race_descriptions` race_type
- `src/lib/drone.ts` — new shared constants file (not server-only)
- `src/db/queries/reference.ts` — import `DRONE_SKILL_NAMES` from shared file
- `src/app/dashboard/characters/[id]/_components/health-resolve-section.tsx` — rename constant
- `src/app/dashboard/characters/[id]/_components/skills-section.tsx` — import `DRONE_SKILL_NAMES` from shared file
