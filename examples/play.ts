import { conn, SAMPLE_RATE, Session, TEST_PROMPT } from "galatea"
import "@std/dotenv/load"
import { AudioContext } from "@mutefish/web-audio-api"
import { audioOutput } from "audio-util"

const session = new Session(() => conn(Deno.env.get("OPENAI_API_KEY")!), {
  turnDetection: false,
})

const audioCtx = new AudioContext({ sampleRate: SAMPLE_RATE })

session.assistant.audio().pipeTo(audioOutput(audioCtx))

session.user.write(TEST_PROMPT)
session.assistant.respond()

// setTimeout(() => session.end(), 5_000)
