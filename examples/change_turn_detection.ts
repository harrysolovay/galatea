import { conn, Session } from "galatea"
import { audioInput } from "../audio/mod.ts"
import "@std/dotenv/load"

const session = new Session(() => conn(Deno.env.get("OPENAI_API_KEY")!))

let input: undefined | ReadableStream<Float32Array>

toggleAudioInput()

{
  ;(async () => {
    for await (const token of session.assistant.text()) {
      Deno.stdout.write(new TextEncoder().encode(token))
    }
  })()
}

function _toggleTurnDetection() {
  const turnDetection = !session.turnDetection()
  session.update({ turnDetection })
  if (turnDetection !== !!input) {
    toggleAudioInput()
  }
}

function toggleAudioInput() {
  if (input) {
    input.cancel()
    input = undefined
  } else {
    input = audioInput()
    input.pipeTo(session.user.writeable(125))
  }
}
