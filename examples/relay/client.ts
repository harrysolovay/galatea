import { Client } from "../../mod.ts"
import { id } from "../../util/mod.ts"

const conversation = Client(new WebSocket("ws://localhost:4646"))
;(async () => {
  for await (const segment of conversation) {
    console.log(segment)
  }
})()

conversation.send({
  type: "conversation.item.create",
  item: {
    id: id("item"),
    type: "message",
    role: "user",
    status: "completed",
    content: [{
      type: "input_text",
      text: "Tell me about Galatea from the story of Pygmalion.",
    }],
  },
})
