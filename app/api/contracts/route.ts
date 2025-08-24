import { NextResponse } from "next/server"
import { createClient as createSupabase } from "@/lib/supabase/server"

function env(k: string, d?: string) {
  const p = (globalThis as any).process
  const v = p && p.env ? p.env[k] : undefined
  return v === undefined ? d : (v as string)
}

export async function GET() {
  const supabase = await createSupabase()
  const { data, error } = await supabase.from("contracts").select("*").order("created_at", { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function POST(req: Request) {
  const body = await req.json()
  const supabase = await createSupabase()
  const insert = {
    booking_id: body.bookingId,
    performance_date: body.performanceDate || null,
    amount: body.amount ?? null,
    additional_terms: body.additionalTerms || null,
    status: "draft",
  }
  const { data, error } = await supabase.from("contracts").insert(insert).select("*").single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const supabase = await createSupabase()
  const patch: any = {}
  if (body.status) patch.status = body.status
  if (body.docusign_envelope_id) patch.docusign_envelope_id = body.docusign_envelope_id
  const { data, error } = await supabase.from("contracts").update(patch).eq("id", body.id).select("*").single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ data })
}
