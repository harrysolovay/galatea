import { conn, Session } from "galatea"
import "@std/dotenv/load"
import { delay } from "@std/async"

declare const audioInput: ReadableStream<Int16Array>

const sessionCtl = new AbortController()
const session = Session(() => conn(Deno.env.get("OPENAI_API_KEY")!), sessionCtl.signal)

// Can pass misc. configuration into `manualTurn` as to avoid the second `session.update`...
const startTurn = session.manual({
  // ... for instance, tools.
  tools: session.tools((_) =>
    _.add("end", "Call this when the user no longer requires replies.", () => sessionCtl.abort())
  ),
})

const turn = startTurn()

// Wait 10 seconds (to allow input audio to be collected), then end the turn.
delay(10_000).then(turn.end)

// Print tokens of transcript stream to stdout.
// The stream will close when the response generation is completed.
for await (const token of turn.transcript()) {
  Deno.stdout.write(new TextEncoder().encode(token))
}

// Reenable auto (the default) turn detection.
session.auto()
audioInput.pipeTo(session.audioInput())

// Print tokens of transcript stream to stdout. Non-blocking.
{
  ;(async () => {
    for await (const token of session.transcript()) {
      Deno.stdout.write(new TextEncoder().encode(token))
    }
  })()
}
