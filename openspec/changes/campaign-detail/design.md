## Context

The campaigns list page links to `/dashboard/campaigns/[id]` which 404s. The schema has `campaigns`, `characters`, and `campaign_characters`. The queries layer has `getCampaignsForUser` but nothing to fetch a single campaign with its members. No character detail route exists yet.

## Goals / Non-Goals

**Goals:**
- Campaign detail page showing name, join code (DM only), and character roster
- Character detail stub page (character name, placeholder content)
- Membership gate on both routes: non-members redirected to `/dashboard/campaigns`
- Single `isCampaignMember` query reused across both pages via the service layer

**Non-Goals:**
- Character sheet fields (stats, abilities — future change)
- Editing campaign settings
- Removing characters from a campaign
- Pagination of the character list

## Decisions

### 1. Membership check in the service layer, not the proxy

The proxy only handles `/` ↔ `/dashboard` redirects. Campaign membership is business logic — it lives in `src/services/campaigns.ts` as `getCampaignDetailForUser`. Both pages call this function; if it throws (non-member or campaign not found), the page catches and redirects.

### 2. `isCampaignMember` as a single query with OR logic

```sql
SELECT EXISTS (
  SELECT 1 FROM campaigns WHERE id = $campaignId AND dm_id = $userId
  UNION ALL
  SELECT 1 FROM campaign_characters cc
    JOIN characters ch ON ch.id = cc.character_id
    WHERE cc.campaign_id = $campaignId AND ch.owner_id = $userId
)
```

Implemented in Drizzle using two `.select()` calls and a boolean OR in the service — same two-query merge pattern established in `listCampaignsForUser`. Avoids raw SQL while staying typed.

### 3. `getCampaignWithCharacters` returns campaign + characters in two queries

Drizzle doesn't support relational joins returning nested objects without the relational API or manual mapping. Two queries (fetch campaign, fetch characters via join) mapped in the service is cleaner than a flat join with repeated campaign columns.

### 4. Join code visible to DM only on the campaign page

The campaign page server component checks `campaign.dmId === user.id` and conditionally renders the join code. Players see the roster but not the join code.

### 5. Character detail page is a stub

`/dashboard/campaigns/[id]/characters/[characterId]/page.tsx` renders the character name and a placeholder. The membership check still applies — a non-member hitting this URL gets redirected even though the content is sparse.

### 6. Non-member and not-found both redirect to `/dashboard/campaigns`

Distinguishing "campaign doesn't exist" from "you're not a member" leaks information. Both cases redirect silently to the campaigns list.

## Risks / Trade-offs

- **Two queries per page load** (membership check + campaign+characters fetch) → Acceptable at this scale; no caching needed yet.
- **Character detail is a stub** → Links work, pages render, content comes in a future change.
