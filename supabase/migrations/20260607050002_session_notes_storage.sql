INSERT INTO storage.buckets (id, name, public)
VALUES ('session-notes', 'session-notes', false)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'authenticated_session_notes_all'
  ) THEN
    CREATE POLICY "authenticated_session_notes_all" ON storage.objects
      FOR ALL TO authenticated
      USING (bucket_id = 'session-notes')
      WITH CHECK (bucket_id = 'session-notes');
  END IF;
END $$;
