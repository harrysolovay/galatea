import { conn, Session } from "galatea"
// @deno-types="npm:@types/node-wav@^0.0.3"
import { decode } from "node-wav"
import "@std/dotenv/load"
import { fromFileUrl } from "@std/path"

const session = new Session(() => conn(Deno.env.get("OPENAI_API_KEY")!))

async function audioInput() {
  const bytes = await Deno.readFile(fromFileUrl(import.meta.resolve("./tell_me.wav")))
  return ReadableStream.from([decode(bytes as never).channelData[0]!])
}

{
  ;(async () => {
    for await (const token of session.assistant.text()) {
      Deno.stdout.write(new TextEncoder().encode(token))
    }
  })()
}

;(await audioInput()).pipeTo(session.user.writeable())

setTimeout(() => {
  session.user.commit()
}, 1000)

setTimeout(() => {
  session.user.write("Write a poem about it.")
  session.assistant.respond()
}, 10000)
