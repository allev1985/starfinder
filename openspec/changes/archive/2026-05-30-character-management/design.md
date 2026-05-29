## Context

The `characters` table exists with `id`, `name`, `owner_id`, `created_at`. The `campaign_characters` join table exists. `getCharacterById` lives in `campaigns.ts` (used by campaign pages — left there). No character-specific queries, services, or pages exist beyond the list stub.

The `authorization.ts` util already has `isCampaignParticipant` and `isCampaignDm`. The `getUser()` helper in `session.ts` is used across all pages and actions.

## Goals / Non-Goals

**Goals:**
- `isCharacterOwner` and `canViewCharacter` in `authorization.ts`
- Character queries layer in `src/db/queries/characters.ts`
- Character service layer in `src/services/characters.ts`
- Characters list (owner's characters only)
- Create character page
- Character detail page: metadata, campaigns joined, join campaign inline form, edit/delete (owner only)
- Edit character page (name only)

**Non-Goals:**
- Character sheet fields beyond name (stats, class, race — future)
- Removing a character from a campaign
- Character visibility settings

## Decisions

### 1. `canViewCharacter` authorization logic

Two-query approach in `authorization.ts`:

1. Check `isCharacterOwner` — if true, return early.
2. Check shared campaign membership: does `userId` participate in any campaign that `characterId` has joined?

```sql
EXISTS (
  SELECT 1 FROM campaign_characters cc
  JOIN campaigns c ON c.id = cc.campaign_id
  WHERE cc.character_id = $characterId
  AND (
    c.dm_id = $userId
    OR EXISTS (
      SELECT 1 FROM campaign_characters cc2
      JOIN characters ch ON ch.id = cc2.character_id
      WHERE cc2.campaign_id = c.id AND ch.owner_id = $userId
    )
  )
)
```

Implemented as two Drizzle queries (owner check + shared-campaign check) in TS rather than raw SQL to stay within the typed API.

### 2. Separate `src/db/queries/characters.ts`

Character queries are character-centric and growing. Keeping them separate from `campaigns.ts` maintains clear module boundaries. `getCharacterById` stays in `campaigns.ts` (it's used by campaign-context pages).

### 3. Join campaign flow on character detail page (owner only)

Inline form: single join code input + "Join" button. On submit, `joinCampaignAction(characterId, formData)`:
1. Verify `isCharacterOwner`
2. `findCampaignByJoinCode(code)` — returns campaign or null
3. If not found → inline error "Invalid join code"
4. Check not already in `campaign_characters` → if already joined → inline error
5. Insert `campaign_characters` row → refresh campaign list on page

The form is a client component (needs state for errors + loading). The campaign list below it is re-fetched after successful join via `router.refresh()`.

### 4. Delete order: campaign_characters first, then character

`deleteCharacter(id)` in the query layer:
1. Delete all `campaign_characters` rows where `character_id = id`
2. Delete the character row

Same pattern as `deleteCampaign`.

### 5. Character detail page — who sees what

```
canViewCharacter gate → all visitors

Owner only (isCharacterOwner):
  - Edit button
  - Delete button (AlertDialog)
  - Join campaign form

All authorised viewers:
  - Character name + created date
  - Campaign list
```

### 6. Edit page follows campaign-manage pattern

`/characters/[id]/edit` is a server component with `isCharacterOwner` gate, passing data to a client form component (`_edit-form.tsx`). Name is the only editable field for now.

## Risks / Trade-offs

- **`canViewCharacter` runs two queries** → Acceptable at this scale.
- **`router.refresh()` after join** → Causes a full server re-render of the page. Simple and correct; no optimistic UI needed here.
- **Characters list shows only owned characters** → Non-owners discovering characters happens via campaign pages only.
