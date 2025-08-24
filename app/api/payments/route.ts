import { NextResponse } from "next/server"
import { createClient as createSupabase } from "@/lib/supabase/server"

export async function GET() {
  const supabase = await createSupabase()
  const { data, error } = await supabase.from("payment_links").select("*").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { bookingId, amount, url } = body as { bookingId: string; amount: number; url?: string }
  if (!bookingId || !amount) return NextResponse.json({ error: "missing_fields" }, { status: 400 })
  const supabase = await createSupabase()
  const insert = {
    booking_id: bookingId,
    amount,
    status: "pending",
    url: url || null,
  }
  const { data, error } = await supabase.from("payment_links").insert(insert).select("*").single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, status } = body as { id: string; status: "pending" | "paid" | "failed" | "expired" | "canceled" }
  if (!id || !status) return NextResponse.json({ error: "missing_fields" }, { status: 400 })
  const supabase = await createSupabase()
  const patch: any = { status }
  if (status === "paid") patch.paid_at = new Date().toISOString()
  const { data, error } = await supabase.from("payment_links").update(patch).eq("id", id).select("*").single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}
