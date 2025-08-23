export type SendEmailInput = {
  from: string
  to: string[]
  subject: string
  html: string
}

export type SendEmailResult = {
  id: string
  status: "queued" | "sent" | "failed"
}

export interface EmailClient {
  send(input: SendEmailInput): Promise<SendEmailResult>
}

import client from "./agentmail"

export function getEmailClient(): EmailClient {
  return client
}
