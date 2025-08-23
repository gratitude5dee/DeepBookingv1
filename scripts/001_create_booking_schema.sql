-- DeepBooking Platform Database Schema
-- Based on Convex schema adapted for Supabase with RLS

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Venues table
CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  capacity INTEGER NOT NULL,
  contact_email TEXT NOT NULL,
  available_dates DATE[] DEFAULT '{}',
  image_url TEXT,
  address TEXT,
  amenities TEXT[] DEFAULT '{}',
  technical_specs TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Booking queries table
CREATE TABLE IF NOT EXISTS booking_queries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  performance_type TEXT NOT NULL,
  location TEXT NOT NULL,
  venues_selected UUID[] DEFAULT '{}',
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  intro_email_sent BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'negotiating', 'accepted', 'rejected', 'contracted', 'paid', 'completed')),
  current_offer DECIMAL(10, 2),
  accepted_offer DECIMAL(10, 2),
  show_date TIMESTAMP WITH TIME ZONE,
  contract_id UUID,
  payment_link_id UUID,
  invoice_id UUID,
  event_poster_url TEXT,
  merch_payment_link_sent BOOLEAN DEFAULT FALSE,
  negotiation_history JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES booking_queries(id) ON DELETE CASCADE,
  docusign_envelope_id TEXT,
  signees JSONB DEFAULT '[]',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'signed', 'completed')),
  document_url TEXT,
  performance_date TIMESTAMP WITH TIME ZONE,
  amount DECIMAL(10, 2),
  additional_terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment links table
CREATE TABLE IF NOT EXISTS payment_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES booking_queries(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  stripe_payment_link_id TEXT,
  url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired', 'canceled')),
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_intent_id TEXT,
  payment_release_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Emails table
CREATE TABLE IF NOT EXISTS emails (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES booking_queries(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('intro', 'offer', 'confirmation', 'invoice', 'thank_you', 'merch_link')),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  recipients TEXT[] DEFAULT '{}',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'
);

-- Invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES booking_queries(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  pdf_storage_url TEXT,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  items JSONB DEFAULT '[]'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_venues_location ON venues(location);
CREATE INDEX IF NOT EXISTS idx_booking_queries_status ON booking_queries(status);
CREATE INDEX IF NOT EXISTS idx_booking_queries_show_date ON booking_queries(show_date);
CREATE INDEX IF NOT EXISTS idx_booking_queries_user_id ON booking_queries(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_booking_id ON contracts(booking_id);
CREATE INDEX IF NOT EXISTS idx_payment_links_booking_id ON payment_links(booking_id);
CREATE INDEX IF NOT EXISTS idx_emails_booking_id ON emails(booking_id);

-- Enable Row Level Security
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- RLS Policies for venues (public read access)
CREATE POLICY "venues_select_all" ON venues FOR SELECT USING (true);

-- RLS Policies for booking_queries (users can only access their own bookings)
CREATE POLICY "booking_queries_select_own" ON booking_queries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "booking_queries_insert_own" ON booking_queries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "booking_queries_update_own" ON booking_queries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "booking_queries_delete_own" ON booking_queries FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for contracts (access through booking ownership)
CREATE POLICY "contracts_select_own" ON contracts FOR SELECT USING (
  EXISTS (SELECT 1 FROM booking_queries WHERE booking_queries.id = contracts.booking_id AND booking_queries.user_id = auth.uid())
);
CREATE POLICY "contracts_insert_own" ON contracts FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM booking_queries WHERE booking_queries.id = contracts.booking_id AND booking_queries.user_id = auth.uid())
);
CREATE POLICY "contracts_update_own" ON contracts FOR UPDATE USING (
  EXISTS (SELECT 1 FROM booking_queries WHERE booking_queries.id = contracts.booking_id AND booking_queries.user_id = auth.uid())
);

-- RLS Policies for payment_links (access through booking ownership)
CREATE POLICY "payment_links_select_own" ON payment_links FOR SELECT USING (
  EXISTS (SELECT 1 FROM booking_queries WHERE booking_queries.id = payment_links.booking_id AND booking_queries.user_id = auth.uid())
);
CREATE POLICY "payment_links_insert_own" ON payment_links FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM booking_queries WHERE booking_queries.id = payment_links.booking_id AND booking_queries.user_id = auth.uid())
);
CREATE POLICY "payment_links_update_own" ON payment_links FOR UPDATE USING (
  EXISTS (SELECT 1 FROM booking_queries WHERE booking_queries.id = payment_links.booking_id AND booking_queries.user_id = auth.uid())
);

-- RLS Policies for emails (access through booking ownership)
CREATE POLICY "emails_select_own" ON emails FOR SELECT USING (
  EXISTS (SELECT 1 FROM booking_queries WHERE booking_queries.id = emails.booking_id AND booking_queries.user_id = auth.uid())
);
CREATE POLICY "emails_insert_own" ON emails FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM booking_queries WHERE booking_queries.id = emails.booking_id AND booking_queries.user_id = auth.uid())
);

-- RLS Policies for invoices (access through booking ownership)
CREATE POLICY "invoices_select_own" ON invoices FOR SELECT USING (
  EXISTS (SELECT 1 FROM booking_queries WHERE booking_queries.id = invoices.booking_id AND booking_queries.user_id = auth.uid())
);
CREATE POLICY "invoices_insert_own" ON invoices FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM booking_queries WHERE booking_queries.id = invoices.booking_id AND booking_queries.user_id = auth.uid())
);
