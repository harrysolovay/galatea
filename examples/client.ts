import { assertExists } from "@std/assert"
import { Client, id, realtimeSocket, SessionConfig } from "../mod.ts"
import "@std/dotenv/load"

const key = Deno.env.get("OPENAI_API_KEY")
assertExists(key)

const session = Client(realtimeSocket(key))
;(async () => {
  for await (const chunk of session) console.log(chunk)
})()

// state.send({
//   type: "session.update",
//   session: SessionConfig({ turn_detection: null }),
// })

// state.send({
//   type: "conversation.item.create",
//   item: {
//     id: id("item"),
//     type: "message",
//     role: "user",
//     status: "completed",
//     content: [{
//       type: "input_text",
//       text: "Tell me about Galatea from the story of Pygmalion.",
//     }],
//   },
// })
