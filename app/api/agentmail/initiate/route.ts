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
  return { bookingAddress, venueAddress, slug }
}

async function http(method: string, path: string, body?: any) {
  const base = env("AGENTMAIL_BASE_URL", "https://api.agentmail.to") as string
  const url = base.replace(/\/+$/, "") + path
  const apiKey = env("AGENTMAIL_API_KEY", "") as string
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  }
  if (apiKey) headers.Authorization = `Bearer ${apiKey}`

  const timeoutMs = 10000
  const maxRetries = 3

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
        signal: controller.signal,
      })
      clearTimeout(timer)
      if (!res.ok) {
        let err: any = {}
        try {
          err = await res.json()
        } catch {}
        const e: any = new Error(err.message || `HTTP ${res.status}`)
        e.status = res.status
        e.details = err
        throw e
      }
      try {
        return await res.json()
      } catch {
        return {}
      }
    } catch (e) {
      clearTimeout(timer)
      if (attempt === maxRetries - 1) throw e
      const backoff = Math.pow(2, attempt) * 300
      await new Promise((r) => setTimeout(r, backoff))
    }
  }
  return {}
}

async function ensureInbox(address: string) {
  const resp = await http("POST", "/inboxes", { address, type: "booking" }).catch(async (e: any) => {
    if (e.status === 409) {
      return { address, id: undefined }
    }
    throw e
  })
  const id = resp.id || resp.inbox_id
  return { id, address: resp.address || address }
}

async function getAlias(address: string) {
  try {
    const resp = await http("GET", `/aliases/${encodeURIComponent(address)}`)
    return { id: resp.id || resp.alias_id, address: resp.address || address, target: resp.target }
  } catch (e: any) {
    if (e.status === 404) return null
    throw e
  }
}

async function ensureAlias(address: string, target: string, metadata?: any) {
  const existing = await getAlias(address)
  if (existing) return existing
  const resp = await http("POST", "/aliases", {
    alias: address,
    target,
    type: "venue",
    metadata: metadata || {},
  })
  return { id: resp.id || resp.alias_id, address: resp.address || address, target: resp.target || target }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body
    const { bookingId, venueId, venueName, venueSlug, offerAmount, showDate, recipientEmail, strategy } = body
    if (!bookingId || !venueId || !venueName || !recipientEmail || !offerAmount || !showDate) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 })
    }

    const supabase = await createSupabase()

    const { bookingAddress, venueAddress, slug } = buildAddresses(bookingId, venueName, venueSlug)
    const fromName = env("AGENTMAIL_FROM_NAME", "AgentMail")!
    const wantVenue = strategy === "venue"

    const inbox = await ensureInbox(bookingAddress)
    let alias: { id?: string; address: string; target?: string } | null = null
    let chosenFromAddress = bookingAddress
    let mode = "per-booking"

    if (wantVenue) {
      try {
        alias = await ensureAlias(venueAddress, bookingAddress, { bookingId, venueId, slug })
        chosenFromAddress = venueAddress
        mode = "per-venue"
      } catch (e) {
        chosenFromAddress = bookingAddress
        mode = "per-booking"
        setTimeout(() => {
          ensureAlias(venueAddress, bookingAddress, { bookingId, venueId, slug, retry: true }).catch(() => {})
        }, 0)
      }
    }

    const from = `${fromName} <${chosenFromAddress}>`

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
        provider_inbox_id: inbox.id || null,
        provider_alias_id: alias?.id || null,
        selected_from: chosenFromAddress,
        mode,
      } as any,
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
      from_address: chosenFromAddress,
      provider_message_id: result.id,
      status: result.status,
    })

    await supabase.from("booking_queries").update({ status: "negotiating", intro_email_sent: true }).eq("id", bookingId)

    const payload = {
      bookingId,
      venueId,
      address_booking: bookingAddress,
      address_venue: venueAddress,
      selected_from: chosenFromAddress,
      mode,
      provider_message_id: result.id,
      status: result.status,
      provider_inbox_id: inbox.id || null,
      provider_alias_id: alias?.id || null,
      echoId: genId(),
    }

    return NextResponse.json(payload, { status: 200 })
  } catch (e) {
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}
