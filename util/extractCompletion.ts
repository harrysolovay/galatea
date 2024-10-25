import { assertExists } from "@std/assert"
import type Openai from "openai"

export function extractCompletion({ usage, choices }: Openai.Chat.ChatCompletion) {
  const { finish_reason, message } = choices[0]!
  console.log(JSON.stringify({ usage, finish_reason }, null, 2))
  console.log("\n")
  assertExists(message.content)
  return message.content
}
