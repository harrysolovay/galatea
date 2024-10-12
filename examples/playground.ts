import { OPENAI_API_KEY } from "../env.ts"
import { defaultSessionConfig, Session } from "../mod.ts"

const session = new Session({
  apiKey: OPENAI_API_KEY,
  initialState: { isInitial: true },
  debug: true,
}, {
  error(_e) {},
  "conversation.created"(_e) {},
  "conversation.item.created"(_e) {
    session.send({
      type: "response.create",
    })
    return { isInitial: false }
  },
  "conversation.item.deleted"(_e) {},
  "conversation.item.input_audio_transcription.completed"(_e) {},
  "conversation.item.input_audio_transcription.failed"(_e) {},
  "conversation.item.truncated"(_e) {},
  "input_audio_buffer.cleared"(_e) {},
  "input_audio_buffer.committed"(_e) {},
  "input_audio_buffer.speech_started"(_e) {},
  "input_audio_buffer.speech_stopped"(_e) {},
  "rate_limits.updated"(_e) {},
  "response.audio.delta"(_e) {},
  "response.audio.done"(_e) {},
  "response.audio_transcript.delta"(_e) {},
  "response.audio_transcript.done"(_e) {},
  "response.content_part.added"(_e) {},
  "response.content_part.done"(_e) {},
  "response.created"(_e) {
    console.log(session.state)
  },
  "response.done"(_e) {},
  "response.function_call_arguments.delta"(_e) {},
  "response.function_call_arguments.done"(_e) {},
  "response.output_item.added"(_e) {},
  "response.output_item.done"(_e) {},
  "response.text.delta"(_e) {},
  "response.text.done"(_e) {},
  "session.created"(_e) {},
  "session.updated"(_e) {
    session.send({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "system",
        content: [
          {
            type: "input_text",
            text: "Hey, are you there?",
          },
        ],
      },
    })
  },
})

// TODO: get rid of need for `await`ing
console.log("Initial state:", session.state)
await session.start()

session.send({
  type: "session.update",
  session: defaultSessionConfig,
})
