import { conn, SAMPLE_RATE, Session } from "galatea"
import { AudioContext, audioInput, audioOutput } from "../audio/mod.ts"
import { cancellationTimeout } from "../util/setCancellationTimeout.ts"
import "@std/dotenv/load"

const session = new Session(() => conn(Deno.env.get("OPENAI_API_KEY")!), {
  turnDetection: false,
})

const audioCtx = new AudioContext({ sampleRate: SAMPLE_RATE })

session.assistant.audio().pipeTo(audioOutput(audioCtx))
session.setCommitInterval(125)

cancellationTimeout(audioInput(), 5_000).pipeTo(session.user.writeable())

setTimeout(() => {
  session.respond()
})
