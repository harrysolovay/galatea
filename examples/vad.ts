import { decodeWav } from "audio"
import { conn, Session } from "galatea"
import "@std/dotenv/load"
import { fromFileUrl } from "@std/path"

const session = new Session(() => conn(Deno.env.get("OPENAI_API_KEY")!))

function audioInput() {
  const bytes = Deno.readFileSync(fromFileUrl(import.meta.resolve("./tell_me.wav")))
  return ReadableStream.from([decodeWav(bytes as never).channelData[0]!])
}

{
  ;(async () => {
    for await (const token of session.assistant.text()) {
      Deno.stdout.write(new TextEncoder().encode(token))
    }
  })()
}

audioInput().pipeTo(session.user.writeable())

setTimeout(() => {
  session.user.commit()
}, 1000)

setTimeout(() => {
  session.user.write("Write a poem about it.")
  session.assistant.respond()
}, 10000)
