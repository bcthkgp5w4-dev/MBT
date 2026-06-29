-- Add media support to journal entries
ALTER TABLE journal_entries
  ADD COLUMN IF NOT EXISTS media_urls TEXT[] DEFAULT '{}';

-- Supabase Storage bucket for journal media (run in dashboard if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('journal-media', 'journal-media', false)
-- ON CONFLICT DO NOTHING;

-- RLS policy for journal-media bucket
-- CREATE POLICY "Users manage own journal media"
--   ON storage.objects FOR ALL
--   USING (bucket_id = 'journal-media' AND auth.uid()::text = (storage.foldername(name))[1]);
