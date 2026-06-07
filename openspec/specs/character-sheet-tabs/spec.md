## ADDED Requirements

### Requirement: Tab navigation on character detail page
The character detail page SHALL render a shadcn/ui `Tabs` component with two always-visible tabs ("Stats" and "Abilities & Gear") and a third tab ("Spells") that appears only when the character `isSpellcaster` is true.

#### Scenario: Stats and Abilities tabs always visible
- **WHEN** any character detail page loads
- **THEN** the "Stats" and "Abilities & Gear" tabs are visible and selectable

#### Scenario: Spells tab hidden for non-spellcasters
- **WHEN** the character is not a spellcaster
- **THEN** no "Spells" tab is rendered

#### Scenario: Spells tab visible for spellcasters
- **WHEN** the character is a spellcaster
- **THEN** a "Spells" tab is rendered as the third tab

#### Scenario: Stats tab is active by default
- **WHEN** the character detail page first loads
- **THEN** the "Stats" tab is the active tab

### Requirement: Stats tab two-column layout
The "Stats" tab content SHALL use a two-column grid (`md:grid-cols-2 grid-cols-1`). The left column SHALL contain Ability Scores then Skills. The right column SHALL contain Initiative, Health & Resolve, Armor Class, Saving Throws, Attack Bonuses, and Weapons — in that order.

#### Scenario: Left column content
- **WHEN** the Stats tab is active on a desktop viewport
- **THEN** Ability Scores and Skills appear in the left column

#### Scenario: Right column content
- **WHEN** the Stats tab is active on a desktop viewport
- **THEN** Initiative, Health & Resolve, Armor Class, Saving Throws, Attack Bonuses, and Weapons appear in the right column

#### Scenario: Single column on mobile
- **WHEN** the Stats tab is active on a viewport narrower than the `md` breakpoint
- **THEN** all sections stack in a single column

### Requirement: Abilities & Gear tab two-column layout
The "Abilities & Gear" tab content SHALL use a two-column grid (`md:grid-cols-2 grid-cols-1`). The left column SHALL contain Class Features, Theme Features, Feats, Abilities, and Proficiencies. The right column SHALL contain Armour inventory, Equipment inventory, and Notes.

#### Scenario: Left column content
- **WHEN** the Abilities & Gear tab is active
- **THEN** Class Features, Theme Features, Feats, Abilities, and Proficiencies appear in the left column

#### Scenario: Right column content
- **WHEN** the Abilities & Gear tab is active
- **THEN** Armour, Equipment, and Notes appear in the right column

### Requirement: Section header label-badge style
Every section heading on the character sheet SHALL be rendered as a `bg-primary text-primary-foreground` inline block with bold uppercase tracking-widest text, matching the label-badge style of the official character sheet. This applies to: Ability Scores, Skills, Initiative, Health & Resolve, Armor Class, Saving Throws, Attack Bonuses, Weapons, Class Features, Theme Features, Feats & Proficiencies, Armour, Equipment.

#### Scenario: Section header uses primary colour
- **WHEN** any character sheet section renders
- **THEN** its heading is displayed with a filled primary-colour background and primary-foreground text

#### Scenario: Section header text is uppercase
- **WHEN** any character sheet section renders
- **THEN** its heading text is bold, uppercase, and wide-tracked
