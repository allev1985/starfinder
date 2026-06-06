## 1. Database Schema

- [x] 1.1 Add 8 nullable text columns to `spaceships` in `src/db/schema.ts`: `lifeSupportDamage`, `sensorsDamage`, `enginesDamage`, `powerCoreDamage`, `weaponsForwardDamage`, `weaponsPortDamage`, `weaponsStarboardDamage`, `weaponsAftDamage`
- [x] 1.2 Generate and apply Drizzle migration for the 8 new columns

## 2. UI — Damage Button Group Component

- [x] 2.1 Build a reusable `DamageStatus` inline component in `_name-editor.tsx` (or extract to `_damage-status.tsx`) that renders `[None] [Glitching] [Malfunctioning] [Wrecked]` as a button group; clicking the active state resets to None

## 3. Critical Damage Section

- [x] 3.1 Add a Critical Damage `border-t pt-5` section after the Shields block in `_name-editor.tsx` with `DamageStatus` controls for Life Support and Sensors
- [x] 3.2 Wire state and immediate `updateSpaceshipAction` call for Life Support damage
- [x] 3.3 Wire state and immediate `updateSpaceshipAction` call for Sensors damage

## 4. Weapons Section — Engines & Power Core

- [x] 4.1 Add Engines and Power Core `DamageStatus` controls at the top of the existing Weapons section in `_name-editor.tsx`
- [x] 4.2 Wire state and immediate `updateSpaceshipAction` call for Engines damage
- [x] 4.3 Wire state and immediate `updateSpaceshipAction` call for Power Core damage

## 5. Weapons Section — Arc Damage

- [x] 5.1 Add a `DamageStatus` control below each weapon list in the arc loop for Forward, Port, Starboard, and Aft (skip Turret)
- [x] 5.2 Wire state and immediate `updateSpaceshipAction` call for each arc's damage status

## 6. Lint & Typecheck

- [x] 6.1 Run `npm run lint` and resolve any errors
- [x] 6.2 Run `npx tsc --noEmit` and resolve any type errors
