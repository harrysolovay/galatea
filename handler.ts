import type { Context } from "./Context.ts"
import type { ServerEvent, ServerEvents } from "./events/mod.ts"

export function createHandler(ctx: Context) {
  let queue: Promise<void> = Promise.resolve()
  return ({ data }: MessageEvent<string>) => {
    const event: ServerEvent = JSON.parse(data)
    queue = queue.then(() => {
      console.log(event)
      return handlers[event.type].call(ctx, event as never)
    })
  }
}

const handlers: Handlers = {
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
  "session.updated"() {},
}

type Handlers = { [K in keyof ServerEvents]: Handler<K> }
type Handler<K extends keyof ServerEvents> = (this: Context, args: ServerEvents[K]) => void | Promise<void>
