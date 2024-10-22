// @ts-nocheck

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

async function turnOff() {
  session.update({ turnDetection: false })

  const segment = session.segment((signal) => audioInput.pipeTo(session.audioInput(), { signal }))

  delay(10_000).then(() => segment.end())

  for await (const token of segment.transcript()) {
    Deno.stdout.write(new TextEncoder().encode(token))
  }
}

async function turnOn() {
  session.update({ turnDetection: true })

  session.segment((signal) => audioInput.pipeTo(session.audioInput(), { signal }))

  for await (const token of session.transcript()) {
    Deno.stdout.write(new TextEncoder().encode(token))
  }
}

function universePrime() {
  let segment: Segment | null = null
  let turnDetection = false

  function toggleMic() {
    if (segment) {
      segment.end()
      segment = null
    } else {
      segment = session.segment((signal) => audioInput.pipeTo(session.audioInput(), { signal }))
    }
  }

  function toggleTurnDetection() {
    turnDetection = !turnDetection
    session.update({ turnDetection })
  }
}

// function universeComposite() {
//   let turnDetection = false
//   let turn: Turn | null = null
//   let micOn = false
//   let foo

//   function toggleMic() {
//     micOn = !micOn
//     if(micOn) {
//       if(turnDetection) {
//         let controller = new AbortController();
//         foo = controller
//         audioInput.pipeTo(session.audioInput(), { signal: controller.signal })
//       } else {

//       }
//     }
//     if (segment) {
//       segment.end()
//       segment = null
//     } else {
//       segment = session.segment((signal) => audioInput.pipeTo(session.audioInput(), { signal }))
//     }
//   }

//   function toggleTurnDetection() {
//     turnDetection = !turnDetection
//     session.update({ turnDetection })
//   }
// }
