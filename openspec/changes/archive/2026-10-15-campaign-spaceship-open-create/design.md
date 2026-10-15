## Context

The `campaign-spaceship` spec currently states "Only the DM can create or edit the spaceship... non-DM participants SHALL see the spaceship in read-only mode." That was never actually implemented for editing: `_name-editor.tsx` has no role checks on any field, `_spaceship-actions.tsx`'s Delete button has none either, and every mutating action in `actions.ts` (`updateSpaceshipAction`, `deleteSpaceshipAction`, weapon/note/crew actions) checks only `isCampaignParticipant`. The only place a GM-only gate actually exists is around *creating* a new ship, at three UI/route points. Since `isCampaignParticipant` is defined as `isCampaignGm OR checkHasCharacterOwnerInCampaign`, "any non-GM participant" is already exactly "any user who owns a character in this campaign" — there is no narrower or broader population to carve out.

## Goals / Non-Goals

**Goals:**
- Let any campaign participant create a spaceship, not just the GM.
- Bring the `campaign-spaceship` spec in line with actual (and now fully intended) behavior for both create and edit/delete.

**Non-Goals:**
- No change to how editing/deleting already works — it's already open to all participants and stays that way.
- No new authorization utility or server-side check — `isCampaignParticipant` already exists and already guards every mutating action correctly; only UI/route-level gates need to change.
- No campaign-membership model change (e.g. "joined but no character yet") — out of scope and not something the current data model supports.

## Decisions

- **Remove the GM-only gates rather than invert them to a new "participant-only" check that duplicates existing logic**: `new/page.tsx` and `spaceship/page.tsx` sit under `campaigns/[id]/layout.tsx`, which already calls `isCampaignParticipant` and redirects non-participants before these pages ever render. Adding a second explicit participant check in these pages would be redundant; simply deleting the extra `isGm` redirect/branch is sufficient and avoids a second source of truth for the same authorization decision.
- **Spec correction covers both create and edit/delete in one modified requirement**, rather than two separate deltas, since they're the same underlying rule ("any participant has full access") and splitting them would misrepresent edit/delete as a new change when it's actually just documenting existing behavior.

## Risks / Trade-offs

- [Any participant can now delete the only ship, or any ship, not just the GM] → Mitigation: this already was true before this change (delete was never gated); not a new risk introduced here, and the existing confirm-dialog on delete (`_spaceship-actions.tsx`) is unchanged.
- [No "who created this ship" attribution] → Not addressed here — out of scope per the user's decision that any participant can edit any ship, matching the GM's current unrestricted access. Worth a future note if accountability ever becomes a concern, but not a blocker for this change.
