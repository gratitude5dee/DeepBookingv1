import { NextResponse } from "next/server"
import { createClient as createSupabase } from "@/lib/supabase/server"
import { getEmailClient } from "@/lib/email"

function env(k: string, d?: string) {
  const p = (globalThis as any).process
  const v = p && p.env ? p.env[k] : undefined
  return v === undefined ? d : (v as string)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { bookingId, amount, message, sendEmail, recipientEmail } = body as {
    bookingId: string
    amount?: number
    message?: string
    sendEmail?: boolean
    recipientEmail?: string
  }
  if (!bookingId) return NextResponse.json({ error: "missing_fields" }, { status: 400 })

  const supabase = await createSupabase()
  const { data: booking, error: bErr } = await supabase.from("booking_queries").select("*").eq("id", bookingId).single()
  if (bErr || !booking) return NextResponse.json({ error: "not_found" }, { status: 404 })

  const hist = Array.isArray((booking as any).negotiation_history) ? (booking as any).negotiation_history : []
  const entry = {
    date: new Date().toISOString(),
    message: message || (amount ? `Counter-offer: $${amount}` : "Counter-offer"),
    sender: "user",
    type: "counter",
  }
  const patch: any = { negotiation_history: [...hist, entry] }
  if (typeof amount === "number") patch.current_offer = amount

  const { data, error } = await supabase
    .from("booking_queries")
    .update(patch)
    .eq("id", bookingId)
    .select("*")
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  if (sendEmail && recipientEmail) {
    const { data: am } = await supabase
      .from("agentmail_inboxes")
      .select("*")
      .eq("booking_id", bookingId)
      .limit(1)
      .maybeSingle()

    const fromName = env("AGENTMAIL_FROM_NAME", "AgentMail")!
    const domain = env("AGENTMAIL_DOMAIN", "5-dee.com")!
    const chosenFrom =
      (am as any)?.selected_from ||
      (am as any)?.address_booking ||
      `bq-${bookingId}@${domain}`

    const html = `<div><p>Counter-offer for booking ${bookingId}</p><p>${message || ""}</p>${
      typeof amount === "number" ? `<p>Amount: $${amount}</p>` : ""
    }</div>`
    const client = getEmailClient()
    await client.send({
      from: `${fromName} <${chosenFrom}>`,
      to: [recipientEmail],
      subject: "Counter-offer",
      html,
    })

    await supabase.from("emails").insert({
      booking_id: bookingId,
      type: "offer",
      subject: "Counter-offer",
      body: html,
      recipients: [recipientEmail],
      sent_at: new Date().toISOString(),
      metadata: { reneg: true },
      from_address: chosenFrom,
    })
  }

  return NextResponse.json({ data })
}
