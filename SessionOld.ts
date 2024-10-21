import { unimplemented } from "@std/assert"
import { Context } from "./Context.ts"
import type { ClientEvent, ServerEvent } from "./events/mod.ts"
import { handlers } from "./Handlers.ts"
import type { Content, ResponseResource, SessionConfig, SessionResource } from "./models/mod.ts"
import { listen } from "./socket.ts"
import { generateId } from "./util/id.ts"
import type { JsonSchema, JsonSchemaNative } from "./util/json_schema.ts"

export interface Session extends Disposable {
  /** Get a writable stream with which to send raw client events. */
  eventsInput(): WritableStream<ClientEvent>
  /** Get a readable stream of raw server events. */
  events(): ReadableStream<ServerEvent>
  /** Update the session configuration. */
  update(session: SessionConfig): Promise<SessionResource>
  /** Get a readable stream of audio transcript tokens. */
  transcript(): ReadableStream<string>
  /** Get a readable stream of PCM-encoded audio chunks. */
  audio(): ReadableStream<Int16Array>
  /** Append text to the input buffer. */
  appendText(text: string): Promise<void>
  /** Add PCM-encoded audio to the input buffer. */
  appendAudio(audio: Int16Array, transcript?: string): Promise<void>
  /** Manually trigger response generation (when in VAD). */
  respond(): Promise<ResponseResource>
  /** Manually cancel a previously-triggered response generation (when in VAD). */
  cancelResponse(): Promise<void>
  /** Manually end the session and clean up its resources. */
  dispose(): void
}

export function Session(connect: () => WebSocket): Session {
  const ctl = new AbortController()
  const context = new Context(ctl.signal)

  const send = listen<ClientEvent, ServerEvent>(
    connect,
    (event) => {
      context.eventStreams.forEach((ctl) => ctl.enqueue(event))
      handlers[event.type].call(context, event as never)
    },
    ctl.signal,
  )

  function events(): ReadableStream<ServerEvent> {
    return context.eventStreams.stream()
  }
  function text(): ReadableStream<string> {
    return context.textStreams.stream()
  }
  function audio(): ReadableStream<Int16Array> {
    return context.audioStreams.stream()
  }

  async function appendText(text: string) {
    return append([{ type: "input_text", text }])
  }

  async function appendAudio(audio: Int16Array, transcript?: string) {
    append([{
      type: "input_audio",
      audio: new TextDecoder().decode(audio),
      transcript,
    }])
  }

  async function append(content: Content[]) {
    const { previous_item_id } = context
    const id = generateId("item")
    const event: ClientEvent = {
      type: "conversation.item.create",
      previous_item_id,
      item: {
        type: "message",
        id,
        role: "user",
        status: "incomplete",
        content,
      },
    }
    context.previous_item_id = id
    send(event)
  }

  function update(session: SessionConfig): Promise<SessionResource> {
    if (context.sessionUpdate) throw 0
    const pending = Promise.withResolvers<SessionResource>()
    context.sessionUpdate = pending
    send({ type: "session.update", session })
    return pending.promise
  }

  async function tool<T extends JsonSchema>(_options: ToolOptions<T>): Promise<void> {
    unimplemented()
  }

  async function interrupt() {
    unimplemented()
  }

  function respond(): Promise<ResponseResource> {
    if (context.responsePending) throw 0
    const pending = Promise.withResolvers<ResponseResource>()
    context.responsePending = pending
    send({ type: "response.create" })
    return pending.promise
  }

  async function cancelResponse(): Promise<void> {
    send({ type: "response.cancel" })
    // send({
    //   type: "conversation.item.truncate",
    //   item_id: null!,
    //   content_index: null!,
    //   audio_end_ms: null!,
    // })
  }

  function dispose() {
    context.eventStreams.forEach((ctl) => ctl.close())
    context.textStreams.forEach((ctl) => ctl.close())
    context.audioStreams.forEach((ctl) => ctl.close())

    ctl.abort()
  }

  return {
    update,
    appendAudio,
    appendText,
    audio,
    events,
    respond,
    cancelResponse,
    transcript,
    tool,
    dispose,
    [Symbol.dispose]: dispose,
  }
}

export interface ToolOptions<T extends JsonSchema> {
  name: string
  description: string
  parameters: T
  f: (args: JsonSchemaNative<T>) => void
  signal?: AbortSignal
}
