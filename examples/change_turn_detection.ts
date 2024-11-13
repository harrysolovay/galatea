import { conn, Session } from "galatea"
import "@std/dotenv/load"

const session = Session(() => conn(Deno.env.get("OPENAI_API_KEY")!), {
  inputTranscript: true,
})

let ctl: AbortController | undefined
toggleAudioInput()

{
  ;(async () => {
    for await (const token of session.text()) {
      Deno.stdout.write(new TextEncoder().encode(token))
    }
  })()
}

function toggleTurnDetection() {
  const turnDetection = !session.turnDetection()
  session.update({ turnDetection })
  if (turnDetection !== !!ctl) toggleAudioInput()
}

function toggleAudioInput() {
  if (ctl) {
    ctl.abort()
    ctl = undefined
  } else {
    ctl = new AbortController()
    audioInput(ctl.signal).pipeTo(session.audioInput())
  }
}

declare function audioInput(signal: AbortSignal): ReadableStream<Int16Array>
