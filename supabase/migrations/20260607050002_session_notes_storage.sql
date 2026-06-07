INSERT INTO storage.buckets (id, name, public)
VALUES ('session-notes', 'session-notes', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "authenticated_session_notes_all" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'session-notes')
  WITH CHECK (bucket_id = 'session-notes');
