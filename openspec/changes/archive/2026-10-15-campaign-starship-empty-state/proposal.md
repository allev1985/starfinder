## Why

The campaign overview page (`src/app/dashboard/campaigns/[id]/page.tsx`) hides its entire "Starship" section when a campaign has zero spaceships (`{spaceships.length > 0 && (...)}` at line 126), for every role including the GM. This makes the feature look entirely absent to a player on the one page most people land on first, even though the campaign sidebar (present on every campaign sub-page) already renders a correct empty state and a GM-only "+ Add ship" link in the same situation. The fix is to make the overview page match the sidebar's existing, spec-correct behavior rather than silently disappearing.

## What Changes

- The campaign overview page's Starship section SHALL always render its section label, even when no spaceships exist yet.
- When zero spaceships exist, the section SHALL show an empty-state message, visible to all participants.
- When zero spaceships exist, the GM SHALL additionally see a "+ Add ship" link within that section (same destination as the sidebar's existing create link).
- No change to authorization: viewing remains open to all campaign participants; creating remains GM-only. No change to the sidebar, which already behaves correctly.

## Capabilities

### New Capabilities
(none)

### Modified Capabilities
- `campaign-spaceship`: the "No spaceship exists yet" empty-state requirement currently only describes behavior in the spaceship section generally (satisfied today by the sidebar); this clarifies and extends it to explicitly cover the campaign overview page, which previously rendered nothing in this case.

## Impact

- `src/app/dashboard/campaigns/[id]/page.tsx` (the only file expected to change)
- No database, API, or authorization changes
