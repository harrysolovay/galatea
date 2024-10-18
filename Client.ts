import { unimplemented } from "@std/assert"
import type { ClientEvent, ServerEvent } from "./events/mod.ts"
import { type HandlerContext, handlers } from "./Handlers.ts"
import { type Content, SessionConfig, type SessionResource, TurnDetection } from "./models/mod.ts"
import { listen } from "./socket.ts"
import { generateId } from "./util/id.ts"
import type { JsonSchema, JsonSchemaNative } from "./util/json_schema.ts"

export interface Session extends Disposable {
  events(): ReadableStream<ServerEvent>
  text(): ReadableStream<string>
  audio(): ReadableStream<Int16Array>

  appendText(text: string): Promise<void>
  appendAudio(audio: Int16Array, transcript?: string): Promise<void>

  tool<T extends JsonSchema>(_options: ToolOptions<T>): Promise<void>

  ensureTurnDetection(enabled: boolean): Promise<void>

  commit(): Promise<void>
  restore(): Promise<void>

  respond(): Promise<void>
  cancelResponse(): Promise<void>

  dispose(): void
}

export function Session(connect: () => WebSocket): Session {
  const controller = new AbortController()

  const handlerContext: HandlerContext = {}
  const eventCtls = new Set<ReadableStreamDefaultController<ServerEvent>>()
  const textCtls = new Set<ReadableStreamDefaultController<string>>()
  const audioCtls = new Set<ReadableStreamDefaultController<Int16Array>>()

  const socket = connect()

  const send = listen<ClientEvent, ServerEvent>(
    socket,
    (event) => handlers[event.type].call(handlerContext, event as never),
    controller.signal,
  )

  function events(): ReadableStream<ServerEvent> {
    return stream(eventCtls)
  }

  function text(): ReadableStream<string> {
    return stream(textCtls)
  }

  function audio(): ReadableStream<Int16Array> {
    return stream(audioCtls)
  }

  function stream<T>(ctls: Set<ReadableStreamDefaultController<T>>): ReadableStream<T> {
    let cancelCb = () => {}
    return new ReadableStream({
      start: (ctl) => {
        ctls.add(ctl)
        cancelCb = () => ctls.delete(ctl)
      },
      cancel() {
        cancelCb()
      },
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
    const { previous_item_id } = handlerContext
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
    handlerContext.previous_item_id = id
    send(event)
  }

  const sessionUpdatePending = new Set<PromiseWithResolvers<SessionResource>>()
  function updateSession(session: SessionConfig) {
    const pending = Promise.withResolvers<SessionResource>()
    sessionUpdatePending.add(pending)
    send({ type: "session.update", session })
    return pending.promise
  }

  async function ensureTurnDetection(enabled: boolean): Promise<void> {
    await updateSession({
      ...SessionConfig.default_,
      turn_detection: enabled ? TurnDetection.default_ : null,
    })
  }

  async function tool<T extends JsonSchema>(_options: ToolOptions<T>): Promise<void> {
    unimplemented()
  }

  async function commit() {
    send({ type: "response.create" })
  }

  async function restore() {
    unimplemented()
  }

  async function respond() {
    unimplemented()
  }

  async function cancelResponse() {}

  function dispose() {
    controller.abort()
  }

  return {
    appendAudio,
    appendText,
    audio,
    cancelResponse,
    commit,
    ensureTurnDetection,
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
