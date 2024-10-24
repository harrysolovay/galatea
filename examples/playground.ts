import { conn, Session } from "galatea"
import "@std/dotenv/load"

const session = Session(() => conn(Deno.env.get("OPENAI_API_KEY")!), {
  inputTranscript: true,
  turnDetection: false,
})

session.appendText("Tell me about Galatea from the story of Pygmalion")
session.respond()

for await (const item of session.transcript(true)) {
  Deno.stdout.write(new TextEncoder().encode(item))
}
