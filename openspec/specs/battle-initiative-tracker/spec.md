## Requirements

### Requirement: Initiative route and access control
The route `/dashboard/campaigns/[id]/initiative` SHALL be accessible to all campaign members (DM and players). Non-members SHALL be redirected to `/dashboard/campaigns`. The access check is enforced by the existing `campaigns/[id]/layout.tsx`.

#### Scenario: Campaign member accesses initiative route
- **WHEN** an authenticated campaign member navigates to `/dashboard/campaigns/[id]/initiative`
- **THEN** the initiative tracker page is rendered

#### Scenario: Non-member is redirected
- **WHEN** a user with no campaign membership navigates to the initiative route
- **THEN** they are redirected to `/dashboard/campaigns`

### Requirement: Idle state — no active battle
When no `battles` row exists for the campaign, the page SHALL show an idle state.

#### Scenario: DM sees "New Battle" button when idle
- **WHEN** a DM views the initiative page with no active battle
- **THEN** a "New Battle" button is displayed

#### Scenario: Player sees waiting message when idle
- **WHEN** a player views the initiative page with no active battle
- **THEN** a "Waiting for DM to start battle" message is displayed and no action controls are shown

### Requirement: DM creates a new battle
When the DM clicks "New Battle", a server action SHALL create a `battles` row with `status = 'setup'` and pre-insert one `battle_combatants` PC row per campaign character, then redirect all clients to the setup view via realtime.

#### Scenario: Battle created with all PC slots
- **WHEN** the DM clicks "New Battle"
- **THEN** a `battles` row is created and `battle_combatants` rows are inserted for all current campaign characters with `initiative_total = null`

#### Scenario: Existing active battle prevents new creation
- **WHEN** the DM clicks "New Battle" but a battle with `status = 'setup'` or `'active'` already exists
- **THEN** no new battle is created and the DM is routed to the existing battle

### Requirement: Setup phase — player submits initiative roll
During setup, each player SHALL see their own character(s) with an input for their raw d20 roll result. Submitting the roll SHALL write `initiative_total = roll + initiativeMiscMod` to their `battle_combatants` row. Only the character owner or DM MAY submit or override a PC's initiative.

#### Scenario: Player submits initiative roll
- **WHEN** a player enters their d20 roll and submits
- **THEN** their `battle_combatants.initiative_total` is set to `roll + character.initiativeMiscMod`

#### Scenario: Unauthorized player cannot submit for another's character
- **WHEN** a player attempts to submit an initiative roll for a character they do not own
- **THEN** the server action rejects the request with an authorization error

#### Scenario: DM can submit or override any PC initiative
- **WHEN** the DM enters an initiative roll for any PC combatant
- **THEN** the `initiative_total` is updated regardless of character ownership

#### Scenario: All submitted rolls visible to all clients in real-time
- **WHEN** a player submits their roll
- **THEN** all other connected clients see the updated initiative value appear in the combatant list within ~500ms

### Requirement: Setup phase — DM adds enemies
The DM SHALL be able to add enemy combatants during setup by entering a name and initiative total. Optionally the DM may enter HP total, EAC, KAC, and toggle the hidden flag. Players SHALL NOT see enemy addition controls.

#### Scenario: DM adds a visible enemy
- **WHEN** the DM enters an enemy name and initiative total and adds it
- **THEN** a `battle_combatants` row is inserted with `type = 'enemy'`, `hidden = false`, and all clients see the enemy appear in the list

#### Scenario: DM adds a hidden enemy
- **WHEN** the DM adds an enemy with the hidden flag enabled
- **THEN** the enemy row is inserted with `hidden = true`; players see a "???" placeholder in the list; DM sees the actual name

#### Scenario: Players cannot add enemies
- **WHEN** a non-DM player attempts to call the add-enemy server action
- **THEN** the action is rejected with an authorization error

### Requirement: DM begins the battle
The DM SHALL be able to click "Begin Battle" once all PC combatants have submitted initiative rolls. Clicking "Begin Battle" SHALL set `sort_order` on all combatants (highest `initiative_total` first), then set `battles.status = 'active'`. All clients transition to the active view.

#### Scenario: Begin Battle locks initiative order
- **WHEN** the DM clicks "Begin Battle"
- **THEN** `sort_order` is assigned to all combatants sorted by `initiative_total` descending and `battles.status` becomes `'active'`

#### Scenario: Begin Battle blocked if any PC has not submitted
- **WHEN** the DM clicks "Begin Battle" and one or more PC combatants have `initiative_total = null`
- **THEN** the action is rejected and an error is shown prompting the DM to wait for all players

### Requirement: Active phase — initiative order display
During the active phase, all combatants SHALL be displayed sorted by `sort_order`. The current combatant (at `current_turn_index`) SHALL be visually highlighted. Defeated combatants SHALL appear greyed out and struck-through but remain visible. Hidden enemies SHALL appear as "???" to players; the DM sees the actual name.

#### Scenario: Current turn is highlighted
- **WHEN** a battle is active
- **THEN** the combatant at `current_turn_index` is visually distinguished from others

#### Scenario: Defeated combatant remains visible
- **WHEN** a combatant is marked defeated
- **THEN** they remain in the list with a visual defeated state (greyed, struck-through) and are skipped in turn advancement

#### Scenario: Hidden enemy shown as placeholder to players
- **WHEN** an enemy has `hidden = true`
- **THEN** players see "???" in the initiative list instead of the enemy's name

### Requirement: Active phase — finish turn
The "Finish Turn" button SHALL be visible on the current combatant's row. It SHALL be actionable by the DM and, if the current combatant is a PC, by that character's owner. Clicking it SHALL advance `current_turn_index` to the next non-defeated combatant. If no non-defeated combatant follows, `current_round` SHALL increment and `current_turn_index` wrap to the first non-defeated combatant.

#### Scenario: Turn advances to next non-defeated combatant
- **WHEN** the current player or DM clicks "Finish Turn"
- **THEN** `current_turn_index` moves to the next combatant where `defeated = false`, skipping any defeated combatants between them

#### Scenario: End of round wraps to top
- **WHEN** the last non-defeated combatant finishes their turn
- **THEN** `current_round` increments by 1 and `current_turn_index` resets to the first non-defeated combatant

#### Scenario: Unauthorized player cannot advance turn
- **WHEN** a player who does not own the current PC combatant clicks "Finish Turn"
- **THEN** the action is rejected

### Requirement: Active phase — mark enemy defeated
The DM SHALL be able to mark any enemy combatant as defeated. Players SHALL NOT have access to this control.

#### Scenario: DM marks enemy as defeated
- **WHEN** the DM clicks the defeat control on an enemy row
- **THEN** `battle_combatants.defeated` is set to `true` and all clients see the enemy move to a defeated visual state

#### Scenario: Defeated enemy is skipped in turn advancement
- **WHEN** turn advancement reaches a combatant with `defeated = true`
- **THEN** that combatant is skipped and the next non-defeated combatant becomes current

### Requirement: Active phase — reveal hidden enemy
The DM SHALL be able to reveal a hidden enemy per-combatant. Players SHALL NOT see the reveal control.

#### Scenario: DM reveals hidden enemy
- **WHEN** the DM clicks "Reveal" on a hidden enemy
- **THEN** `battle_combatants.hidden` is set to `false` and all clients immediately see the enemy's actual name in the initiative list

### Requirement: Active phase — PC health editing
Each PC combatant card SHALL display SP current/total, HP current/total, and RP current/total. The character owner and DM MAY edit SP current, HP current, and RP current via inline inputs. Other players see these values as read-only. Edits SHALL write directly to `character_combat_stats` using the existing debounced save pattern.

#### Scenario: Character owner edits HP on battle screen
- **WHEN** the character owner changes HP current on the battle screen
- **THEN** `character_combat_stats.hit_points_current` is updated and all clients including open character sheets reflect the new value via realtime

#### Scenario: DM edits any PC's health
- **WHEN** the DM edits SP, HP, or RP current for any PC
- **THEN** the value is saved to `character_combat_stats` for that character

#### Scenario: Non-owner player sees read-only health
- **WHEN** a player views another PC's card on the battle screen
- **THEN** SP/HP/RP values are displayed but no edit controls are shown

### Requirement: Active phase — PC stat display
Each PC combatant card SHALL display EAC, KAC, and attack bonus (melee/ranged) as computed read-only values. These SHALL be derived from existing character data: `EAC = 10 + armor.eacBonus + DEX mod + eacMiscMod`, `KAC = 10 + armor.kacBonus + DEX mod + kacMiscMod`, `melee ATK = BAB + STR mod + meleeAttackMiscMod`, `ranged ATK = BAB + DEX mod + rangedAttackMiscMod`.

#### Scenario: PC card shows computed EAC and KAC
- **WHEN** a battle is active and the PC has equipped armor
- **THEN** the correct EAC and KAC totals are displayed on the battle screen

#### Scenario: PC card shows attack bonuses
- **WHEN** a battle is active
- **THEN** melee and ranged attack bonus totals are displayed on each PC card

### Requirement: Active phase — DM enemy stat editing
The DM SHALL see HP current/total, EAC, and KAC on enemy combatant rows, editable inline. These fields SHALL never be visible to players. DM edits SHALL write to `battle_combatants` via server actions only — not via client realtime.

#### Scenario: DM sees and edits enemy HP
- **WHEN** the DM views an enemy row in the active battle
- **THEN** HP current and total are displayed and editable

#### Scenario: Enemy stats are invisible to players
- **WHEN** a player views the battle initiative list
- **THEN** no enemy HP, EAC, or KAC values are rendered or accessible

### Requirement: End initiative
The DM SHALL be able to click "End Initiative" to end the battle. This SHALL delete the `battles` row (cascade-deleting all `battle_combatants`) and return all clients to the idle state. No battle data persists after the battle ends.

#### Scenario: DM ends initiative and records are removed
- **WHEN** the DM clicks "End Initiative"
- **THEN** the `battles` row and all associated `battle_combatants` rows are deleted, and all clients return to the idle view

#### Scenario: Player cannot end initiative
- **WHEN** a non-DM player attempts to call the end-initiative server action
- **THEN** the action is rejected with an authorization error
