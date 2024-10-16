import { Context } from "./Context.ts"
import { createHandler } from "./handler.ts"
import type { ClientEvent } from "./mod.ts"
import type { Segment } from "./Segment.ts"
import type { JsonSchema, JsonSchemaNative } from "./util/mod.ts"

export interface Client extends ReadableStream<Segment> {
  send: (event: ClientEvent) => void
  tool<T extends JsonSchema>(options: ToolOptions<T>): void
}

export interface ToolOptions<T extends JsonSchema> {
  name: string
  description: string
  params: T
  f: (args: JsonSchemaNative<T>) => void
  signal?: AbortSignal
}

export function Client(socket: WebSocket): Client {
  const ctx = new Context()
  const listenersController = new AbortController()
  const stream = new ReadableStream<Segment>({
    start(controller) {
      ctx.controller = controller
      socket.addEventListener("message", createHandler(ctx), listenersController)
      const terminalOptions: AddEventListenerOptions = { once: true, signal: listenersController.signal }
      socket.addEventListener("error", (e) => listenersController.abort(e), terminalOptions)
      socket.addEventListener("close", () => listenersController.abort(), terminalOptions)
    },
  })
  return Object.assign(stream, { send, tool })

  function send(event: ClientEvent) {
    return socket.send(JSON.stringify(event))
  }

  function tool<T extends JsonSchema>(_options: ToolOptions<T>) {
    send({
      type: "session.update",
      session: {} as never,
    })
  }
}
