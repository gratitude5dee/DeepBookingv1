import type { EmailClient, SendEmailInput, SendEmailResult } from "./index"

function env(k: string, d?: string) {
  const p = (globalThis as any).process
  const v = p && p.env ? p.env[k] : undefined
  return v === undefined ? d : (v as string)
}

function genId() {
  return "am_" + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

async function simulateSend(): Promise<void> {
  await new Promise((r) => setTimeout(r, 50))
}

class AgentMailClient implements EmailClient {
  async send(input: SendEmailInput): Promise<SendEmailResult> {
    const dev = env("AGENTMAIL_DEV_MODE", "true") === "true"
    try {
      if (dev) {
        await simulateSend()
        console.log("[AgentMail][dev] send", {
          from: input.from,
          to: input.to,
          subject: input.subject,
        })
        return { id: genId(), status: "sent" }
      }
      await simulateSend()
      console.log("[AgentMail] send", {
        from: input.from,
        to: input.to,
        subject: input.subject,
      })
      return { id: genId(), status: "sent" }
    } catch (err) {
      console.error("[AgentMail] send error", err)
      return { id: genId(), status: "failed" }
    }
  }
}

const client = new AgentMailClient()
export default client
