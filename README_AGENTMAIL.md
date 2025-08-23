AgentMail integration overview

Domain: 5-dee.com

Addresses:
- Per-booking: bq-&lt;bookingId&gt;@5-dee.com
- Per-venue: &lt;venue-slug&gt;@5-dee.com

Env:
- AGENTMAIL_DOMAIN=5-dee.com
- AGENTMAIL_FROM_NAME=AgentMail
- AGENTMAIL_DEV_MODE=true

API:
- POST /api/agentmail/initiate
  body: {
    bookingId, venueId, venueName, venueSlug?, offerAmount, showDate, recipientEmail,
    strategy?: "booking" | "venue"  # default "booking"
  }
  response: {
    address_booking, address_venue, selected_from, mode, provider_message_id, status
  }

DB:
- scripts/004_add_agentmail.sql introduces agentmail_inboxes and extends emails.

UI:
- VenueGrid.sendOffer triggers initiate API call.
