## 1. Database: Enable Realtime Publication

- [x] 1.1 Create a Drizzle migration that runs `alter publication supabase_realtime add table characters, character_combat_stats`
- [x] 1.2 Verify RLS policies on `characters` allow campaign members to read rows they don't own; add a policy if missing
- [x] 1.3 Verify RLS policies on `character_combat_stats` allow campaign members to read rows they don't own; add a policy if missing

## 2. Equipment State Bug Fix

- [x] 2.1 In `EquipmentCard`, remove `const [quantity, setQuantity] = useState(entry.quantity)` — replace all usages of `quantity` with `entry.quantity`
- [x] 2.2 In `EquipmentCard`, remove `const [currentCharges, setCurrentCharges] = useState(...)` — replace all usages of `currentCharges` with `entry.currentCharges`
- [x] 2.3 Verify derived values (`activeCharges`, `totalCharges`, `totalCapacity`, `isFull`, `isEmpty`) still compute correctly from `entry` props
- [x] 2.4 Run `npm run lint` and `npx tsc --noEmit` — fix any errors

## 3. CharacterRealtimeSync Component

- [x] 3.1 Create `src/app/dashboard/characters/[id]/_components/character-realtime-sync.tsx` as a render-null `"use client"` component
- [x] 3.2 Import and call `useCharacter()` to get `characterId` and all required setters (`setHealthValues`, `setCombatMods`, `setScores`, `setLevel`, `setCredits`, `setXpEarned`)
- [x] 3.3 Import the browser Supabase client from `src/lib/supabase/client.ts`
- [x] 3.4 In a `useEffect`, create a Supabase Realtime channel and subscribe to `postgres_changes` INSERT+UPDATE on `character_combat_stats` with filter `characterId=eq.${characterId}`
- [x] 3.5 On `character_combat_stats` events, map `event.new` fields to `setHealthValues` (staminaPoints*, hitPoints*, resolvePoints*) and `setCombatMods` (initiativeMiscMod, baseAttackBonus, all saves and attack mods)
- [x] 3.6 In the same `useEffect`, subscribe to `postgres_changes` INSERT+UPDATE on `characters` with filter `id=eq.${characterId}`
- [x] 3.7 On `characters` events, map `event.new` fields to `setLevel`, `setScores` (str/dex/con/int/wis/chaScore), `setCredits`, `setXpEarned`
- [x] 3.8 Return a cleanup function from the `useEffect` that calls `supabase.removeChannel(channel)`
- [x] 3.9 Run `npm run lint` and `npx tsc --noEmit` — fix any errors

## 4. Mount the Sync Component

- [x] 4.1 In the character sheet page (`src/app/dashboard/characters/[id]/page.tsx`) or its layout, add `<CharacterRealtimeSync />` as a child inside `CharacterProvider`

## 5. Verification

- [ ] 5.1 Open the character sheet in two browsers (or two incognito windows with different accounts in the same campaign); reduce HP in one — confirm the other updates within ~500ms
- [ ] 5.2 Open the same character sheet as the owner in two tabs; make a change in Tab 1 — confirm Tab 2 updates
- [ ] 5.3 Confirm equipment quantity and charge controls still work correctly (no regression from the state fix)
