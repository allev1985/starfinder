## Context

`src/app/dashboard/campaigns/[id]/page.tsx` renders a "Starship" section only when `spaceships.length > 0` (line 126). `src/app/dashboard/campaigns/[id]/_components/campaign-sidebar.tsx`, present on every campaign sub-page including this one, already handles the zero-ships case correctly: it shows "None yet" for non-GMs and an always-present "+ Add ship" link for the GM. The overview page's inline card is the only place this empty state is missing.

## Goals / Non-Goals

**Goals:**
- Make the overview page's Starship section behave consistently with the sidebar's existing empty-state pattern.
- Keep the fix isolated to this one page; no new components, no schema or query changes.

**Non-Goals:**
- No change to authorization (viewing stays open to all participants, creating stays GM-only).
- No change to the sidebar itself — it's already correct and untouched.
- No redesign of the Starship section's visual layout beyond adding the empty state.

## Decisions

- **Mirror the sidebar's existing empty-state copy/link rather than inventing new UX**: the sidebar already encodes the right behavior (GM-only create link, read-only empty message for others); reusing that pattern on the overview page avoids a second, possibly-diverging definition of "empty state" for the same feature.
- **Always render the section label**: removes the silent-disappearance behavior that caused the confusion in the first place — a participant should always be able to tell the Starship feature exists, even with zero ships.

## Risks / Trade-offs

- [None of significance] — this is a single-file, additive UI change with no data or auth implications. The only risk is minor visual duplication with the sidebar's empty state (the same information shown in two places), which is acceptable since the overview page and sidebar serve different navigation purposes and both already show this duplication for the non-empty case (ship list) today.
