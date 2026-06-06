-- Allow campaign members to read character rows for characters in their campaign.
-- This is required for Supabase Realtime subscriptions to deliver events to
-- non-owner viewers (GMs, other players) on the character sheet.

ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_combat_stats ENABLE ROW LEVEL SECURITY;

-- Owner can do everything on their own character.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'characters' AND policyname = 'characters_owner_all'
  ) THEN
    CREATE POLICY characters_owner_all ON characters
      FOR ALL
      USING (owner_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'character_combat_stats' AND policyname = 'character_combat_stats_owner_all'
  ) THEN
    CREATE POLICY character_combat_stats_owner_all ON character_combat_stats
      FOR ALL
      USING (
        character_id IN (
          SELECT id FROM characters WHERE owner_id = auth.uid()
        )
      );
  END IF;
END $$;

-- Campaign members can read character rows for characters in their campaign.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'characters' AND policyname = 'characters_campaign_member_read'
  ) THEN
    CREATE POLICY characters_campaign_member_read ON characters
      FOR SELECT
      USING (
        id IN (
          SELECT cc.character_id
          FROM campaign_characters cc
          WHERE cc.campaign_id IN (
            SELECT cc2.campaign_id
            FROM campaign_characters cc2
            JOIN characters c2 ON c2.id = cc2.character_id
            WHERE c2.owner_id = auth.uid()
          )
        )
      );
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'character_combat_stats' AND policyname = 'character_combat_stats_campaign_member_read'
  ) THEN
    CREATE POLICY character_combat_stats_campaign_member_read ON character_combat_stats
      FOR SELECT
      USING (
        character_id IN (
          SELECT cc.character_id
          FROM campaign_characters cc
          WHERE cc.campaign_id IN (
            SELECT cc2.campaign_id
            FROM campaign_characters cc2
            JOIN characters c2 ON c2.id = cc2.character_id
            WHERE c2.owner_id = auth.uid()
          )
        )
      );
  END IF;
END $$;
