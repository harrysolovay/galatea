import { conn, Session, T, Tool } from "galatea"
import "@std/dotenv/load"

declare function audioInput(): ReadableStream<Int16Array>

const session = Session(() => conn(Deno.env.get("OPENAI_API_KEY")!), {
  inputTranscript: true,
  tools: {
    end: Tool("ends the session", T.none, () => session.end()),
  },
})

let ctl: AbortController | null = new AbortController()
audioInput().pipeTo(session.audioInput(ctl.signal))

{
  ;(async () => {
    for await (const token of session.transcript()) {
      Deno.stdout.write(new TextEncoder().encode(token))
    }
  })()
}

function _toggleTurnDetection() {
  session.toggleTurnDetection()
  if (session.turnDetection() !== !!ctl) toggleAudioInput()
}

function toggleAudioInput() {
  if (ctl) {
    ctl.abort()
    ctl = null
  } else {
    ctl = new AbortController()
    audioInput().pipeTo(session.audioInput(ctl.signal))
  }
}
