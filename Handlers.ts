import type { Context } from "./Context.ts"
import type { ServerEvents } from "./events/mod.ts"

export const handlers: Handlers = {
  error() {},
  "session.created"({ session }) {
    this.sessionResource = session
  },
  "session.updated"({ session }) {
    if (!this.sessionUpdate) throw 0
    this.sessionUpdate.resolve(session)
    delete this.sessionUpdate
  },
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
  "response.audio_transcript.delta"({ delta }) {
    this.textCtls.forEach((ctl) => ctl.enqueue(delta))
  },
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
}

export type Handlers = { [K in keyof ServerEvents]: Handler<K> }
export type Handler<K extends keyof ServerEvents> = (this: Context, args: ServerEvents[K]) => void | Promise<void>
