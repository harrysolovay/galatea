import { Context } from "./Context.ts"
import { handlers } from "./handlers/mod.ts"
import type { ClientEvent, ServerEvent } from "./mod.ts"
import type { Segment } from "./Segment.ts"

export interface Client extends ReadableStream<Segment> {
  send: (event: ClientEvent) => void
}

export function Client(socket: WebSocket): Client {
  const listenersController = new AbortController()
  const stream = new ReadableStream<Segment>({
    start(controller) {
      const context = new Context(controller)
      let queue: Promise<void> = Promise.resolve()
      socket.addEventListener("message", ({ data }) => {
        const event: ServerEvent = JSON.parse(data)
        queue = queue.then(() => {
          console.log(event)
          // handlers[event.type](context, data)
        })
      }, listenersController)
      const terminalOptions: AddEventListenerOptions = { once: true, signal: listenersController.signal }
      socket.addEventListener("error", (e) => listenersController.abort(e), terminalOptions)
      socket.addEventListener("close", () => listenersController.abort(), terminalOptions)
    },
  })
  return Object.assign(stream, {
    send: (event: ClientEvent) => socket.send(JSON.stringify(event)),
  })
}
