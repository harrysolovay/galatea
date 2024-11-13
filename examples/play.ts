import { conn, Session } from "galatea"
import "@std/dotenv/load"
import { AudioContext } from "@mutefish/web-audio-api"

const session = Session(() => conn(Deno.env.get("OPENAI_API_KEY")!))

const ctx = new AudioContext({ sampleRate: 24_000 })
let queueTime = 0

session.audio().pipeTo(
  new WritableStream({
    async write(chunk) {
      const audioBuffer = await ctx.decodeAudioData(chunk.buffer)
      const source = ctx.createBufferSource()
      source.buffer = audioBuffer
      source.connect(ctx.destination)
      source.start(queueTime)
      queueTime += audioBuffer.duration
    },
  }),
)

const textInput = session.textInput().getWriter()
textInput.write("Tell me about Galatea from the story of Pygmalion")
textInput.releaseLock()
session.respond()
