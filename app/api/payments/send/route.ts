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
  const { paymentId, recipientEmail } = body as { paymentId: string; recipientEmail: string }
  if (!paymentId || !recipientEmail) return NextResponse.json({ error: "missing_fields" }, { status: 400 })

  const supabase = await createSupabase()
  const { data: payment, error: pErr } = await supabase.from("payment_links").select("*").eq("id", paymentId).single()
  if (pErr || !payment) return NextResponse.json({ error: "not_found" }, { status: 404 })

  const { data: am } = await supabase
    .from("agentmail_inboxes")
    .select("*")
    .eq("booking_id", payment.booking_id)
    .limit(1)
    .maybeSingle()

  const fromName = env("AGENTMAIL_FROM_NAME", "AgentMail")!
  const domain = env("AGENTMAIL_DOMAIN", "5-dee.com")!
  const chosenFrom =
    (am as any)?.selected_from ||
    (am as any)?.address_booking ||
    `bq-${payment.booking_id}@${domain}`

  const from = `${fromName} <${chosenFrom}>`
  const link = payment.url || `https://example.com/pay/${payment.id}`
  const html = `<div><p>Payment Request for booking ${payment.booking_id}</p><p>Amount: $${payment.amount}</p><p><a href="${link}">Pay Now</a></p></div>`

  const client = getEmailClient()
  const send = await client.send({
    from,
    to: [recipientEmail],
    subject: "Payment Request",
    html,
  })

  await supabase.from("emails").insert({
    booking_id: payment.booking_id,
    type: "invoice",
    subject: "Payment Request",
    body: html,
    recipients: [recipientEmail],
    sent_at: new Date().toISOString(),
    metadata: { paymentId },
    from_address: chosenFrom,
    provider_message_id: send.id,
    status: send.status,
  })

  return NextResponse.json({ ok: true, provider_message_id: send.id, status: send.status })
}
