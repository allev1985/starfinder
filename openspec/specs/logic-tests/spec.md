## ADDED Requirements

### Requirement: Ability modifier tests cover the standard D20 formula
`tests/lib/ability.test.ts` SHALL test `modifier()` against scores that exercise flooring, positive, negative, and boundary cases.

#### Scenario: Score 10 returns 0
- **WHEN** `modifier(10)` is called
- **THEN** the result is 0

#### Scenario: Score 18 returns +4
- **WHEN** `modifier(18)` is called
- **THEN** the result is 4

#### Scenario: Score 7 returns -2
- **WHEN** `modifier(7)` is called
- **THEN** the result is -2

#### Scenario: Score 11 floors to 0 not 0.5
- **WHEN** `modifier(11)` is called
- **THEN** the result is 0

#### Scenario: Score 1 returns -5
- **WHEN** `modifier(1)` is called
- **THEN** the result is -5

### Requirement: Combat stat tests cover all derived values
`tests/lib/character-stats.test.ts` SHALL test `calculateCombatStats()` using the character and armor fixtures. It SHALL cover effectiveDex capping, shield proficiency gating, EAC/KAC/kacVsCm, attack bonuses, saving throws, and initiative.

#### Scenario: Full combat stats with armor and proficient shield
- **WHEN** `calculateCombatStats` is called with an equipped armor, an equipped shield, and `hasShieldProficiency: true`
- **THEN** all returned values match the expected Starfinder formula outputs

#### Scenario: Shield bonus absent when not proficient
- **WHEN** `hasShieldProficiency` is false
- **THEN** `eacTotal` and `kacTotal` do not include the shield's bonuses

### Requirement: Initiative turn-progression tests cover all traversal cases
`tests/initiative/turn-progression.test.ts` SHALL test `finishTurnAction` by mocking `getBattleCombatants` and `updateBattleTurn`. It SHALL cover: normal advance, skip defeated, skip hidden, round wrap, and round wrap skipping defeated at head of list.

#### Scenario: Normal advance to next combatant
- **WHEN** `finishTurnAction` is called and the next combatant is eligible
- **THEN** `updateBattleTurn` is called with the next combatant's sortOrder index and the same round

#### Scenario: Skip defeated combatant
- **WHEN** the next combatant in sort order has `defeated: true`
- **THEN** `updateBattleTurn` is called with the index of the first non-defeated combatant after it

#### Scenario: Skip hidden combatant
- **WHEN** the next combatant in sort order has `hidden: true`
- **THEN** `updateBattleTurn` is called with the index of the first visible combatant after it

#### Scenario: Round wrap increments round number
- **WHEN** the current combatant is the last eligible one
- **THEN** `updateBattleTurn` is called with `currentRound + 1` and the index of the first eligible combatant

### Requirement: Campaign listing tests cover role de-duplication
`tests/services/campaigns.test.ts` SHALL test `listCampaignsForUser()` by mocking `getCampaignsForUser`. It SHALL verify that DM role wins when a user appears in both lists for the same campaign.

#### Scenario: Player-only campaign returns player role
- **WHEN** `getCampaignsForUser` returns a campaign only in `playerCampaigns`
- **THEN** the result contains that campaign with `role: "player"`

#### Scenario: DM-only campaign returns dm role
- **WHEN** `getCampaignsForUser` returns a campaign only in `dmCampaigns`
- **THEN** the result contains that campaign with `role: "dm"`

#### Scenario: DM role wins over player for same campaign
- **WHEN** the same campaign appears in both `dmCampaigns` and `playerCampaigns`
- **THEN** the result contains exactly one entry for that campaign with `role: "dm"`

### Requirement: Join code tests verify format invariants
`tests/services/campaigns.test.ts` SHALL test `generateJoinCode()` for length, character set, and basic uniqueness.

#### Scenario: Code is exactly 6 characters
- **WHEN** `generateJoinCode()` is called
- **THEN** the returned string has length 6

#### Scenario: Code uses only uppercase letters and digits
- **WHEN** `generateJoinCode()` is called
- **THEN** the returned string matches `/^[A-Z0-9]{6}$/`

### Requirement: Authorization tests cover all participant and viewer access paths
`tests/lib/authorization.test.ts` SHALL test `isCampaignParticipant()` and `canViewCharacter()` by mocking the underlying DB query functions. It SHALL cover: DM access, player-with-character access, stranger denial, short-circuit on DM check, and owner access.

#### Scenario: DM is a campaign participant
- **WHEN** `checkIsCampaignDm` returns true
- **THEN** `isCampaignParticipant` returns true without calling `checkHasCharacterOwnerInCampaign`

#### Scenario: Character owner in campaign is a participant
- **WHEN** `checkIsCampaignDm` returns false and `checkHasCharacterOwnerInCampaign` returns true
- **THEN** `isCampaignParticipant` returns true

#### Scenario: Unrelated user is not a participant
- **WHEN** both checks return false
- **THEN** `isCampaignParticipant` returns false

#### Scenario: Character owner can view their own character
- **WHEN** `checkIsCharacterOwner` returns true
- **THEN** `canViewCharacter` returns true

#### Scenario: DM of a campaign the character belongs to can view the character
- **WHEN** `checkIsCharacterOwner` returns false, character is in a campaign, and `checkIsCampaignDm` returns true for that campaign
- **THEN** `canViewCharacter` returns true

#### Scenario: Stranger cannot view the character
- **WHEN** `checkIsCharacterOwner` returns false and all campaign checks return false
- **THEN** `canViewCharacter` returns false
