import { NextResponse } from "next/server"
import { createClient as createSupabase } from "@/lib/supabase/server"

export async function POST(req: Request) {
  try {
    const payload = await req.json()
    const supabase = await createSupabase()
    const event = payload.event
    const data = payload.data || {}

    if (event === "email.bounced") {
      const id = data.message_id || data.id
      if (id) await supabase.from("emails").update({ status: "failed" }).eq("provider_message_id", id)
    } else if (event === "email.delivered") {
      const id = data.message_id || data.id
      if (id) await supabase.from("emails").update({ status: "sent" }).eq("provider_message_id", id)
    } else if (event === "email.received") {
    } else if (event === "email.opened" || event === "email.clicked") {
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }
}
