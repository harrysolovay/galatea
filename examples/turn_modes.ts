import { conn, Session, Tool } from "galatea"
import "@std/dotenv/load"
import { delay } from "@std/async"

declare const audioInput: ReadableStream<Int16Array>

const session = Session(() => conn(Deno.env.get("OPENAI_API_KEY")!))

session.update({
  turnDetection: false,
  tools: {
    end: Tool("Call when the user is done conversing with you.", { type: "null" }, session.end),
  },
})

const turn = session.turn((signal) => audioInput.pipeTo(session.audioInput(), { signal }))

// Wait 10 seconds (to allow input audio to be collected), then end the turn.
delay(10_000).then(turn.end)

// Print tokens of transcript stream to stdout.
// The stream will close when the response generation is completed.
for await (const token of turn.transcript()) {
  Deno.stdout.write(new TextEncoder().encode(token))
}

// Reenable auto (the default) turn detection.
session.update({ turnDetection: true })
audioInput.pipeTo(session.audioInput())

// Print tokens of transcript stream to stdout. Non-blocking.
{
  ;(async () => {
    for await (const token of session.transcript()) {
      Deno.stdout.write(new TextEncoder().encode(token))
    }
  })()
}
