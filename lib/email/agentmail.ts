import type { EmailClient, SendEmailInput, SendEmailResult } from "./index"

function env(k: string, d?: string) {
  const p = (globalThis as any).process
  const v = p && p.env ? p.env[k] : undefined
  return v === undefined ? d : (v as string)
}

function genId() {
  return "am_" + Math.random().toString(36).slice(2) + Date.now().toString(36)
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
        signal: controller.signal,
      })
      clearTimeout(timer)
      if (!res.ok) {
        let err: any = {}
        try {
          err = await res.json()
        } catch {}
        const msg = err.message || `HTTP ${res.status}`
        const e: any = new Error(msg)
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

class AgentMailClient implements EmailClient {
  async send(input: SendEmailInput): Promise<SendEmailResult> {
    const dev = env("AGENTMAIL_DEV_MODE", "true") === "true"
    try {
      if (dev) {
        console.log("[AgentMail][dev] send", { from: input.from, to: input.to, subject: input.subject })
        return { id: genId(), status: "sent" }
      }
      const payload = {
        from: input.from,
        to: Array.isArray(input.to) ? input.to : [input.to],
        subject: input.subject,
        html: input.html,
        text: (input as any).text,
        cc: (input as any).cc || [],
        bcc: (input as any).bcc || [],
        reply_to: (input as any).replyTo || input.from,
        headers: (input as any).headers || {},
        attachments: (input as any).attachments || [],
        track: { opens: true, clicks: true, unsubscribe: false },
        tags: (input as any).tags || [],
      }
      const resp = await http("POST", "/send", payload)
      const id = resp.id || resp.message_id || genId()
      const status = resp.status || "queued"
      console.log("[AgentMail] send ok", { id, status })
      return { id, status: status === "queued" ? "sent" : status }
    } catch (err) {
      console.error("[AgentMail] send error", err)
      return { id: genId(), status: "failed" }
    }
  }

  async createInbox(address: string, metadata?: any) {
    const dev = env("AGENTMAIL_DEV_MODE", "true") === "true"
    if (dev) {
      return { id: genId(), address, status: "active" }
    }
    const body = {
      address,
      type: "booking",
      metadata: metadata || {},
      settings: { auto_reply: false, forward_to: null },
    }
    const resp = await http("POST", "/inboxes", body)
    return {
      id: resp.id || resp.inbox_id || genId(),
      address: resp.address || address,
      status: resp.status || "active",
    }
  }

  async getAlias(address: string) {
    const dev = env("AGENTMAIL_DEV_MODE", "true") === "true"
    if (dev) return null
    try {
      const resp = await http("GET", `/aliases/${encodeURIComponent(address)}`)
      return {
        id: resp.id || resp.alias_id,
        address: resp.address || address,
        status: resp.status || "active",
        target: resp.target,
      }
    } catch (e: any) {
      if (e && e.status === 404) return null
      throw e
    }
  }

  async createAlias(address: string, target: string, metadata?: any) {
    const dev = env("AGENTMAIL_DEV_MODE", "true") === "true"
    if (dev) {
      return { id: genId(), address, target, status: "active" }
    }
    const body = {
      alias: address,
      target,
      type: "venue",
      metadata: metadata || {},
      settings: { active: true, preserve_original_recipient: true },
    }
    const resp = await http("POST", "/aliases", body)
    return {
      id: resp.id || resp.alias_id || genId(),
      address: resp.address || address,
      target: resp.target || target,
      status: resp.status || "active",
    }
  }
}

const client = new AgentMailClient()
export default client
