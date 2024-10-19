import { conn, Session } from "../mod.ts"
import "@std/dotenv/load"

const session = Session(() => conn(Deno.env.get("OPENAI_API_KEY")!))

const text = session.text()
;(async () => {
  for await (const token of text) {
    Deno.stdout.write(new TextEncoder().encode(token))
  }
})()

await session.update({
  instructions: "You're an A-list rapper. You respond in bars.",
  turn_detection: null,
})

await session.appendText("Tell me about Galatea from the story of Pygmalion.")

await session.respond()
