// NOTES:
// - are streams lazy / do they need to be explicitly piped / will the error piping into the transform work?

import { conn, Session, tool } from "galatea"
import "@std/dotenv/load"
import { delay } from "@std/async"

declare const audioInput: ReadableStream<Int16Array>

const session = Session(() => conn(Deno.env.get("OPENAI_API_KEY")!))

// Log errors if any.
session.errors().pipeThrough(new TransformStream({ transform: console.error }))

// Set the initial session configuration.
session.update({
  turnDetection: false,
  inputTranscript: true,
  tools: {
    end: tool("ends the session", session.end),
  },
})

const turn = session.startSegment((signal) => audioInput.pipeTo(session.audioInput(), { signal }))

// Wait 10 seconds (to allow input audio to be collected), then end the turn.
delay(10_000).then(() => turn.end())

// Print tokens of transcript stream to stdout.
// The stream will close when the response generation is completed.
for await (const token of turn.inputTranscript()) {
  Deno.stdout.write(new TextEncoder().encode(token))
}

// Reenable VAD (the default) turn detection.
session.update({ turnDetection: true })

// Begin piping audio input into server buffer.
audioInput.pipeTo(session.audioInput())

// Print tokens of transcript stream to stdout. Non-blocking.
{
  ;(async () => {
    for await (const token of session.transcript()) {
      Deno.stdout.write(new TextEncoder().encode(token))
    }
  })()
}
