## Context

Ammunition equipment items have a `ammoCapacity` field (shots per unit) and `characterEquipment.quantity` (units carried). There is currently no way to track how many charges remain in the actively loaded unit. Players need this during play — e.g. "13 of 20 charges left in this battery."

The `characterEquipment` table is the right home for this state: it is the per-character instance of an item, and charge state is per-character, not part of the shared equipment catalog.

## Goals / Non-Goals

**Goals:**
- Track charges remaining in the active ammunition unit per character
- Provide +/− stepper to decrement/increment charges one shot at a time
- Provide a Reload action that marks the active unit spent and loads a fresh one
- No data loss for existing rows (additive schema change)

**Non-Goals:**
- Tracking multiple partially-used units (only one active unit per inventory entry)
- Automatic ammo deduction when an attack action is taken
- Ammo linking to specific weapons in the UI

## Decisions

### Nullable `currentCharges` on `characterEquipment`

**Decision**: Add `current_charges` (nullable integer) to `characterEquipment`. `null` means the active unit is full/untouched.

**Why null = full**: Existing rows need no migration — they read as full by default. It also avoids a migration that would need to read `equipment.ammo_capacity` across a join to initialize values.

**Alternative considered**: A separate `ammo_state` table keyed by `character_equipment_id`. Rejected: overkill for a single scalar value; adds a join to every equipment query.

### Reload semantics: decrement quantity, reset charges

**Decision**: Reload decrements `quantity` by 1 and sets `currentCharges` to `null` (full). The Reload button is disabled when `quantity ≤ 1` (no spare units to load from).

**Why quantity ≤ 1 disables reload**: When quantity = 1, the character has only the currently loaded unit — there is nothing to reload from. Allowing reload at quantity = 1 would silently lose the unit.

**Alternative considered**: Allow reloading at quantity = 1 (representing discarding a partially-used unit to use the same unit fresh). Rejected: too confusing and doesn't match Starfinder rules.

### +/− stepper initializes from `ammoCapacity` on first decrement

**Decision**: When `currentCharges` is `null` and the user presses −, initialize to `ammoCapacity − 1`. Pressing + on a null entry does nothing (already full).

**Why**: Avoids requiring an explicit "start tracking" action. The first shot naturally transitions from null to tracked.

### Single server action for charge updates

**Decision**: Add `updateAmmoChargesAction(characterEquipmentId, currentCharges | null)` alongside the existing `updateEquipmentQuantityAction`. Reload calls both actions (quantity update + charges reset) via separate transitions.

**Why separate actions**: Quantity and charge changes can happen independently (+/− stepper only touches charges; quantity may still change via reload). Keeping them separate avoids an overloaded combined action.

## Risks / Trade-offs

- **Stale UI optimism on reload**: Reload optimistically updates both quantity and currentCharges client-side. If either server action fails silently, state diverges. Mitigation: both actions use `startTransition` and the character context re-renders on next page load.
- **quantity = 0 state**: If reload is called when quantity = 1 it would set quantity = 0, leaving the character with a spent unit and no restock. The Reload button being disabled at quantity ≤ 1 prevents this, but the schema allows it. Mitigation: server action should validate quantity > 1 before decrementing.

## Migration Plan

1. Generate Drizzle migration adding `current_charges` nullable integer to `character_equipment`
2. No data backfill needed — null is the correct initial state (full)
3. Deploy is non-breaking: old code ignores the new column, new code handles null as full
