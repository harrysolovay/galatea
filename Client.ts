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
  const context = new Context()
  const controller = new AbortController()

  const send = listen<ClientEvent, ServerEvent>(
    connect,
    (event) => {
      context.eventCtls.forEach((ctl) => ctl.enqueue(event))
      handlers[event.type].call(context, event as never)
    },
    controller.signal,
  )

  function events(): ReadableStream<ServerEvent> {
    return stream(context.eventCtls)
  }
  function text(): ReadableStream<string> {
    return stream(context.textCtls)
  }
  function audio(): ReadableStream<Int16Array> {
    return stream(context.audioCtls)
  }

  function stream<T>(ctls: Set<ReadableStreamDefaultController<T>>): ReadableStream<T> {
    let cancelCb = () => {}
    return new ReadableStream({
      start: (ctl) => {
        ctls.add(ctl)
        cancelCb = () => ctls.delete(ctl)
      },
      cancel: () => cancelCb(),
    })
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
    context.eventCtls.forEach((ctl) => ctl.close())
    context.textCtls.forEach((ctl) => ctl.close())
    context.audioCtls.forEach((ctl) => ctl.close())

    controller.abort()
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
