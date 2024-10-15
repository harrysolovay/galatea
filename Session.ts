import type { Config } from "./config.ts"
import type { ClientEvent, ServerEvent, ServerEvents } from "./models/mod.ts"
import { socketOpen } from "./util/mod.ts"

export type Session = (event: ClientEvent) => void

export type Handlers = {
  [K in keyof ServerEvents]: (args: ServerEvents[K]) => void | Promise<void>
}

export async function Session({ socket, debug }: Config, handlers: Handlers): Promise<Session> {
  const controller = new AbortController()
  const { signal } = controller

  socket.addEventListener("message", onMessage(handlers, debug), controller)

  const terminalOptions: AddEventListenerOptions = { once: true, signal }
  socket.addEventListener("error", (e) => controller.abort(e), terminalOptions)
  socket.addEventListener("close", () => controller.abort(), terminalOptions)

  await socketOpen(socket)
  return (event) => socket.send(JSON.stringify(event))
}

function onMessage(handlers: Handlers, debug?: boolean) {
  let queue: Promise<void> = Promise.resolve()

  return (raw: MessageEvent) => {
    const event: ServerEvent = JSON.parse(raw.data)
    queue = queue.then(() => {
      if (debug) {
        if (event.type === "error") console.error(event)
        else console.info(event)
      }
      return handlers[event.type](event as never)
    })
  }
}
