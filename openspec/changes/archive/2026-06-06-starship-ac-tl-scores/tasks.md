## 1. Database Migration

- [x] 1.1 Apply migration adding six integer columns to `spaceships`: `pilot_rank`, `size_mod`, `armor_bonus`, `ac_misc_mod`, `countermeasures`, `tl_misc_mod` — all `NOT NULL DEFAULT 0`
- [x] 1.2 Update `spaceships` table definition in `src/db/schema.ts` to include all six new fields

## 2. Server Action

- [x] 2.1 Add the six new fields to the `Partial<Pick<Spaceship, ...>>` type in `updateSpaceshipAction` in `src/app/dashboard/campaigns/[id]/spaceship/actions.ts`

## 3. UI Component

- [x] 3.1 Add AC/TL state and debounced save logic to `_name-editor.tsx` for all six new fields
- [x] 3.2 Render shared inputs (Pilot Rank, Size Mod) above the AC/TL two-column layout
- [x] 3.3 Render AC column: Armor Bonus input, Misc Mod input, computed total (`10 + pilotRank + armorBonus + sizeMod + acMiscMod`)
- [x] 3.4 Render TL column: Countermeasures input, Misc Mod input, computed total (`10 + pilotRank + countermeasures + sizeMod + tlMiscMod`)

## 4. Verification

- [x] 4.1 Run `npm run lint` and `npx tsc --noEmit` — zero errors
- [ ] 4.2 Manually verify: entering values updates computed totals immediately and persists after 600ms
