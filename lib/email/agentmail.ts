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
    if (dev) {
      await simulateSend()
      return { id: genId(), status: "sent" }
    }
    await simulateSend()
    return { id: genId(), status: "sent" }
  }
}

const client = new AgentMailClient()
export default client
