import { Client } from "../../mod.ts"

const client = new Client(new WebSocket("ws://localhost:4646"))
;(async () => {
  for await (const line of client.transcript) console.log(line)
})()

await client.ensureTurnDetection(false)
await client.appendText("user", "Tell me about Galatea from the story of Pygmalion.")
await client.commit()
