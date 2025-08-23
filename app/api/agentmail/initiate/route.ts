import { NextResponse } from "next/server"
import { getEmailClient } from "@/lib/email"
import { createClient as createSupabase } from "@/lib/supabase/server"

type Body = {
  venueId: string
  venueName: string
  venueSlug?: string
  bookingId: string
  offerAmount: number
  showDate: string
  recipientEmail: string
  strategy?: "booking" | "venue"
}

function env(k: string, d?: string) {
  const p = (globalThis as any).process
  const v = p && p.env ? p.env[k] : undefined
  return v === undefined ? d : (v as string)
}

function genId() {
  return "am_" + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
}

function buildAddresses(bookingId: string, venueName: string, venueSlug: string | undefined) {
  const domain = env("AGENTMAIL_DOMAIN", "5-dee.com")!
  const bookingAddress = `bq-${bookingId}@${domain}`
  const slug = venueSlug && venueSlug.length > 0 ? venueSlug : slugify(venueName)
  const venueAddress = `${slug}@${domain}`
  return { bookingAddress, venueAddress }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body
    const { bookingId, venueId, venueName, venueSlug, offerAmount, showDate, recipientEmail } = body
    if (!bookingId || !venueId || !venueName || !recipientEmail || !offerAmount || !showDate) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 })
    }

    const supabase = await createSupabase()

    const { bookingAddress, venueAddress } = buildAddresses(bookingId, venueName, venueSlug)
    const fromName = env("AGENTMAIL_FROM_NAME", "AgentMail")!
    const from = `${fromName} <${bookingAddress}>`

    const client = getEmailClient()
    const html = `
      <div>
        <p>Offer for ${venueName}</p>
        <p>Date: ${new Date(showDate).toLocaleString()}</p>
        <p>Offer Amount: $${Number(offerAmount).toLocaleString()}</p>
      </div>
    `
    const result = await client.send({
      from,
      to: [recipientEmail],
      subject: `Offer for ${venueName}`,
      html,
    })

    await supabase.from("agentmail_inboxes").upsert(
      {
        booking_id: bookingId,
        venue_id: venueId,
        address_booking: bookingAddress,
        address_venue: venueAddress,
        provider: "agentmail",
      },
      { onConflict: "booking_id,venue_id" },
    )

    await supabase.from("emails").insert({
      booking_id: bookingId,
      type: "offer",
      subject: `Offer for ${venueName}`,
      body: html,
      recipients: [recipientEmail],
      sent_at: new Date().toISOString(),
      metadata: { venueId, venueName },
      from_address: bookingAddress,
      provider_message_id: result.id,
      status: result.status,
    })

    await supabase.from("booking_queries").update({ status: "negotiating", intro_email_sent: true }).eq("id", bookingId)

    const payload = {
      bookingId,
      venueId,
      address_booking: bookingAddress,
      address_venue: venueAddress,
      provider_message_id: result.id,
      status: result.status,
      echoId: genId(),
    }

    return NextResponse.json(payload, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}
