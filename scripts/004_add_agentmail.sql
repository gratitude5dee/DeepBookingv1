
CREATE TABLE IF NOT EXISTS agentmail_inboxes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES booking_queries(id) ON DELETE CASCADE,
  venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
  address_booking TEXT NOT NULL,
  address_venue TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'agentmail',
  provider_inbox_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (booking_id, venue_id)
);

CREATE INDEX IF NOT EXISTS idx_agentmail_inboxes_booking ON agentmail_inboxes(booking_id);
CREATE INDEX IF NOT EXISTS idx_agentmail_inboxes_venue ON agentmail_inboxes(venue_id);

ALTER TABLE emails
  ADD COLUMN IF NOT EXISTS from_address TEXT,
  ADD COLUMN IF NOT EXISTS provider_message_id TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'sent' CHECK (status IN ('queued','sent','failed'));

ALTER TABLE agentmail_inboxes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "agentmail_inboxes_select_own" ON agentmail_inboxes FOR SELECT USING (
  EXISTS (SELECT 1 FROM booking_queries WHERE booking_queries.id = agentmail_inboxes.booking_id AND booking_queries.user_id = auth.uid())
);

CREATE POLICY "agentmail_inboxes_insert_own" ON agentmail_inboxes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM booking_queries WHERE booking_queries.id = agentmail_inboxes.booking_id AND booking_queries.user_id = auth.uid())
);

CREATE POLICY "agentmail_inboxes_update_own" ON agentmail_inboxes FOR UPDATE USING (
  EXISTS (SELECT 1 FROM booking_queries WHERE booking_queries.id = agentmail_inboxes.booking_id AND booking_queries.user_id = auth.uid())
);
