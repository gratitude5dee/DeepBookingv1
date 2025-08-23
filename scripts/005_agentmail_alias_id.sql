ALTER TABLE agentmail_inboxes
  ADD COLUMN IF NOT EXISTS provider_alias_id TEXT,
  ADD COLUMN IF NOT EXISTS selected_from TEXT,
  ADD COLUMN IF NOT EXISTS mode TEXT CHECK (mode IN ('per-venue','per-booking'));

CREATE INDEX IF NOT EXISTS idx_agentmail_inboxes_provider_alias ON agentmail_inboxes(provider_alias_id);
