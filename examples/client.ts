import { conn, Session } from "../mod.ts"
import "@std/dotenv/load"

using session = Session(() => conn(Deno.env.get("OPENAI_API_KEY")!))

const text = session.text()
;(async () => {
  for await (const segment of text) {
    Deno.stdout.write(new TextEncoder().encode(segment))
  }
})()

await session.ensureTurnDetection(false)

session.appendText("Tell me about Galatea from the story of Pygmalion.")
session.commit()

setTimeout(() => text.cancel(), 1000)
