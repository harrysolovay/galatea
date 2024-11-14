import { conn, SAMPLE_RATE, Session } from "galatea"
import { AudioContext, audioInput, audioOutput } from "../audio/mod.ts"
import "@std/dotenv/load"

const session = new Session(() => conn(Deno.env.get("OPENAI_API_KEY")!))

const audioCtx = new AudioContext({ sampleRate: SAMPLE_RATE })

session.assistant.audio().pipeTo(audioOutput(audioCtx))

audioInput().pipeTo(session.user.writeable())

session.setCommitInterval(250)
