-- Seed venues with Bay Area locations for testing
INSERT INTO venues (name, location, capacity, contact_email, address, amenities, latitude, longitude, image_url) VALUES
(
  'The Fillmore',
  'San Francisco, CA',
  1150,
  'booking@thefillmore.com',
  '1805 Geary Blvd, San Francisco, CA 94115',
  ARRAY['Sound System', 'Lighting', 'Bar', 'Merchandise Stand'],
  37.7849,
  -122.4324,
  '/placeholder.svg?height=300&width=400'
),
(
  'The Independent',
  'San Francisco, CA',
  500,
  'shows@theindependentsf.com',
  '628 Divisadero St, San Francisco, CA 94117',
  ARRAY['Sound System', 'Lighting', 'Bar', 'Photo Pit'],
  37.7751,
  -122.4376,
  '/placeholder.svg?height=300&width=400'
),
(
  'Fox Theater',
  'Oakland, CA',
  2800,
  'booking@foxoakland.com',
  '1807 Telegraph Ave, Oakland, CA 94612',
  ARRAY['Sound System', 'Lighting', 'Bar', 'VIP Area', 'Balcony'],
  37.8081,
  -122.2711,
  '/placeholder.svg?height=300&width=400'
),
(
  'The Catalyst',
  'Santa Cruz, CA',
  800,
  'info@catalystclub.com',
  '1011 Pacific Ave, Santa Cruz, CA 95060',
  ARRAY['Sound System', 'Lighting', 'Bar', 'Dance Floor'],
  36.9741,
  -122.0308,
  '/placeholder.svg?height=300&width=400'
);

-- Set available dates for the next 6 months
UPDATE venues SET available_dates = ARRAY[
  CURRENT_DATE + INTERVAL '7 days',
  CURRENT_DATE + INTERVAL '14 days',
  CURRENT_DATE + INTERVAL '21 days',
  CURRENT_DATE + INTERVAL '28 days',
  CURRENT_DATE + INTERVAL '35 days',
  CURRENT_DATE + INTERVAL '42 days',
  CURRENT_DATE + INTERVAL '49 days',
  CURRENT_DATE + INTERVAL '56 days',
  CURRENT_DATE + INTERVAL '63 days',
  CURRENT_DATE + INTERVAL '70 days'
];
