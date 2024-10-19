import { conn, Session } from "../mod.ts"
import "@std/dotenv/load"

const session = Session(() => conn(Deno.env.get("OPENAI_API_KEY")!))

// const events = session.events()
// ;(async () => {
//   for await (const event of events) {
//     console.log(event)
//   }
// })()

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

session.appendText("Tell me about Galatea from the story of Pygmalion.")
session.commit()
