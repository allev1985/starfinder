-- Rename dm_id → gm_id on campaigns
ALTER TABLE campaigns RENAME COLUMN dm_id TO gm_id;

-- Rename dm_storage_path → gm_storage_path on session_notes
ALTER TABLE session_notes RENAME COLUMN dm_storage_path TO gm_storage_path;
