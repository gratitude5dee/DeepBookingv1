AgentMail integration overview

Domain: 5-dee.com

Addresses:
- Per-booking: bq-&lt;bookingId&gt;@5-dee.com
- Per-venue: &lt;venue-slug&gt;@5-dee.com

Env:
- AGENTMAIL_DOMAIN=5-dee.com
- AGENTMAIL_FROM_NAME=AgentMail
- AGENTMAIL_BASE_URL=https://api.agentmail.to
- AGENTMAIL_API_KEY=REPLACE
- AGENTMAIL_DEV_MODE=false
- WEBHOOK_URL=http://localhost:3000/api

API:
- POST /api/agentmail/initiate
  body: {
    bookingId, venueId, venueName, venueSlug?, offerAmount, showDate, recipientEmail,
    strategy?: "booking" | "venue"
  }
  response: {
    address_booking, address_venue, selected_from, mode, provider_message_id, status, provider_inbox_id?, provider_alias_id?
  }

- POST /api/agentmail/webhook
  body: { event, data }
  updates emails.status for delivered/failed

DB:
- scripts/004_add_agentmail.sql introduces agentmail_inboxes and extends emails.
- scripts/005_agentmail_alias_id.sql adds provider_alias_id, selected_from, mode.

UI:
- VenueGrid.sendOffer triggers initiate API call.

Notes:
- Authorization: Bearer ${AGENTMAIL_API_KEY} to ${AGENTMAIL_BASE_URL}
- Endpoints used: /inboxes, /aliases, /send
- Strategy: default per-booking; if venue strategy fails alias creation, falls back to booking and schedules alias creation

Updates:
- New API routes:
  - GET/POST/PATCH /api/contracts
  - POST /api/contracts/send
  - GET/POST/PATCH /api/payments
  - POST /api/payments/send
  - POST /api/bookings/reneg

UI wiring:
- ContractManagement: lists, creates, and sends contracts via the API.
- PaymentProcessing: lists and creates payment links, can email links.
- Bookings (counter-offer): persists renegotiation and can email a counter-offer using AgentMail strategy.
