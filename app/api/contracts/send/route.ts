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
  const { contractId, recipientEmail } = body as { contractId: string; recipientEmail: string }
  if (!contractId || !recipientEmail) return NextResponse.json({ error: "missing_fields" }, { status: 400 })

  const supabase = await createSupabase()

  const { data: contract, error: cErr } = await supabase.from("contracts").select("*").eq("id", contractId).single()
  if (cErr || !contract) return NextResponse.json({ error: "not_found" }, { status: 404 })

  const { data: am } = await supabase
    .from("agentmail_inboxes")
    .select("*")
    .eq("booking_id", contract.booking_id)
    .limit(1)
    .maybeSingle()

  const fromName = env("AGENTMAIL_FROM_NAME", "AgentMail")!
  const domain = env("AGENTMAIL_DOMAIN", "5-dee.com")!
  const chosenFrom =
    (am as any)?.selected_from ||
    (am as any)?.address_booking ||
    `bq-${contract.booking_id}@${domain}`

  const from = `${fromName} <${chosenFrom}>`
  const html = `<div><p>Contract for booking ${contract.booking_id}</p><p>Amount: $${contract.amount ?? ""}</p></div>`

  const client = getEmailClient()
  const send = await client.send({
    from,
    to: [recipientEmail],
    subject: "Performance Contract",
    html,
  })

  await supabase.from("emails").insert({
    booking_id: contract.booking_id,
    type: "confirmation",
    subject: "Performance Contract",
    body: html,
    recipients: [recipientEmail],
    sent_at: new Date().toISOString(),
    metadata: { contractId },
    from_address: chosenFrom,
    provider_message_id: send.id,
    status: send.status,
  })

  await supabase.from("contracts").update({ status: "sent" }).eq("id", contractId)

  return NextResponse.json({ ok: true, provider_message_id: send.id, status: send.status })
}
