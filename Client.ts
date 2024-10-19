import { unimplemented } from "@std/assert"
import { Context } from "./Context.ts"
import type { ClientEvent, ServerEvent } from "./events/mod.ts"
import { handlers } from "./Handlers.ts"
import type { Content, ResponseResource, SessionConfig, SessionResource } from "./models/mod.ts"
import { listen } from "./socket.ts"
import { generateId } from "./util/id.ts"
import type { JsonSchema, JsonSchemaNative } from "./util/json_schema.ts"

export interface Session extends Disposable {
  update(session: SessionConfig): Promise<SessionResource>

  events(): ReadableStream<ServerEvent>
  text(): ReadableStream<string>
  audio(): ReadableStream<Int16Array>

  appendText(text: string): Promise<void>
  appendAudio(audio: Int16Array, transcript?: string): Promise<void>

  tool<T extends JsonSchema>(_options: ToolOptions<T>): Promise<void>

  restore(): Promise<void>

  respond(): Promise<ResponseResource>
  cancelResponse(): void

  dispose(): void
}

export function Session(connect: () => WebSocket): Session {
  const ctl = new AbortController()
  const context = new Context(ctl.signal)

  const send = listen<ClientEvent, ServerEvent>(
    connect,
    (event) => {
      context.eventListeners.forEach((ctl) => ctl.enqueue(event))
      handlers[event.type].call(context, event as never)
    },
    ctl.signal,
  )

  function events(): ReadableStream<ServerEvent> {
    return context.eventListeners.stream()
  }
  function text(): ReadableStream<string> {
    return context.textListeners.stream()
  }
  function audio(): ReadableStream<Int16Array> {
    return context.audioListeners.stream()
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

  async function restore() {
    unimplemented()
  }

  function respond(): Promise<ResponseResource> {
    if (context.responsePending) throw 0
    const pending = Promise.withResolvers<ResponseResource>()
    context.responsePending = pending
    send({ type: "response.create" })
    return pending.promise
  }

  function cancelResponse() {
    send({ type: "response.cancel" })
  }

  function dispose() {
    context.eventListeners.forEach((ctl) => ctl.close())
    context.textListeners.forEach((ctl) => ctl.close())
    context.audioListeners.forEach((ctl) => ctl.close())

    ctl.abort()
  }

  return {
    update,
    appendAudio,
    appendText,
    audio,
    cancelResponse,
    events,
    respond,
    restore,
    text,
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
