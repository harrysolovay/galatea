import { assertExists } from "@std/assert"
import { Client, realtimeSocket } from "../mod.ts"
import "@std/dotenv/load"

const key = Deno.env.get("OPENAI_API_KEY")
assertExists(key)

const client = new Client(realtimeSocket(key))
;(async () => {
  for await (const chunk of client.transcript) console.log(chunk)
})()

await client.ensureTurnDetection(false)
await client.tool({
  name: "add",
  description: "Add `a` and `b` together.",
  parameters: {
    type: "object",
    properties: {
      a: { type: "number" },
      b: { type: "number" },
    },
    required: ["a", "b"],
  },
  f: ({ a, b }) => console.log(a + b),
})
await client.appendText("user", "Tell me about Galatea from the story of Pygmalion.")
await client.appendText("user", "Add 1 plus 2")
await client.commit()
