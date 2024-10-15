import { defaults, Session } from "../../mod.ts"
import { idFactory } from "../../util/mod.ts"

const nextItemId = idFactory("item")

const socket = new WebSocket("ws://localhost:4646")
const send = await Session({ socket, debug: true }, {
  error() {},
  "conversation.created"() {},
  "conversation.item.created"() {},
  "conversation.item.deleted"() {},
  "conversation.item.input_audio_transcription.completed"() {},
  "conversation.item.input_audio_transcription.failed"() {},
  "conversation.item.truncated"() {},
  "input_audio_buffer.cleared"() {},
  "input_audio_buffer.committed"() {},
  "input_audio_buffer.speech_started"() {},
  "input_audio_buffer.speech_stopped"() {},
  "rate_limits.updated"() {},
  "response.audio.delta"() {},
  "response.audio.done"() {},
  "response.audio_transcript.delta"() {},
  "response.audio_transcript.done"() {},
  "response.content_part.added"() {},
  "response.content_part.done"() {},
  "response.created"() {},
  "response.done"() {},
  "response.function_call_arguments.delta"() {},
  "response.function_call_arguments.done"() {},
  "response.output_item.added"() {},
  "response.output_item.done"() {},
  "response.text.delta"() {},
  "response.text.done"() {},
  "session.created"() {},
  "session.updated"() {
    send({
      type: "conversation.item.create",
      item: {
        type: "message",
        id: nextItemId(),
        status: "completed",
        role: "user",
        content: [
          {
            type: "input_text",
            text: "Tell me about Galatea from the story of Pygmalion.",
          },
        ],
      },
    })
  },
})

send({
  type: "session.update",
  session: defaults.sessionConfig,
})
