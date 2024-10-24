import { conn, Session, T, Tool } from "galatea"
import "@std/dotenv/load"

const session = Session(() => conn(Deno.env.get("OPENAI_API_KEY")!), {
  inputTranscript: true,
  tools: {
    end: Tool("ends the session", T.none, () => session.end()),
  },
})

let ctl: AbortController | null = new AbortController()
audioInput(ctl.signal).pipeTo(session.audioInput())

{
  ;(async () => {
    for await (const token of session.transcript()) {
      Deno.stdout.write(new TextEncoder().encode(token))
    }
  })()
}

function _toggleTurnDetection() {
  session.update({ turnDetection: false })
  if (session.turnDetection() !== !!ctl) toggleAudioInput()
}

function toggleAudioInput() {
  if (ctl) {
    ctl.abort()
    ctl = null
  } else {
    ctl = new AbortController()
    audioInput(ctl.signal).pipeTo(session.audioInput())
  }
}

declare function audioInput(signal: AbortSignal): ReadableStream<Int16Array>
