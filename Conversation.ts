import type { Config } from "./config.ts"
import * as D from "./defaults.ts"
import type * as T from "./models/mod.ts"
import { Send } from "./Session.ts"

interface ConversationState {
  audioBuffer: Int16Array

  itemLookup: Record<string, T.Item>
  items: T.Item[]

  responseLookup: Record<string, T.ConversationResource>
  responses: T.ConversationResource[]

  queuedSpeechItems: Record<string, string>
  // queuedTranscriptItems = {};
  // queuedInputAudio = null;
}

export async function conversation(config: Config) {
  const send = await Session(config, {
    error() {},
    "conversation.created"({ conversation }) {},
    "conversation.item.created"() {
      send({ type: "response.create" })
    },
    "conversation.item.deleted"() {},
    "conversation.item.input_audio_transcription.completed"() {},
    "conversation.item.input_audio_transcription.failed"() {},
    "conversation.item.truncated"() {},
    "input_audio_buffer.cleared"() {},
    "input_audio_buffer.committed"() {},
    "input_audio_buffer.speech_started"({ item_id, audio_start_ms }) {},
    "input_audio_buffer.speech_stopped"({ item_id, audio_end_ms }) {},
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
    "session.updated"() {},
  })

  send({
    type: "session.update",
    session: D.sessionConfig,
  })
}
