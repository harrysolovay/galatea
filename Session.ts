import type { Config } from "./config.ts"
import { REALTIME_ENDPOINT, REALTIME_MODEL, realtimeHeaders } from "./constants.ts"
import type { ClientEvent, ServerEvent, ServerEvents } from "./models/mod.ts"

export type Session = (event: ClientEvent) => void

export type Handlers = {
  [K in keyof ServerEvents]: (args: ServerEvents[K]) => void | Promise<void>
}

export async function Session(config: Config, handlers: Handlers): Promise<Session> {
  const socket = new WebSocket(`${REALTIME_ENDPOINT}?model=${REALTIME_MODEL}`, [
    "realtime",
    ...Object.entries(realtimeHeaders(config.apiKey)).map(([k, v]) => `${k}.${v}`),
  ])

  switch (socket.readyState) {
    case WebSocket.CLOSED:
    case WebSocket.CLOSING:
      throw new UnexpectedDisconnectError()
    case WebSocket.CONNECTING: {
      const pending = Promise.withResolvers<void>()
      const controller = new AbortController()
      socket.addEventListener("open", onEvent, controller)
      socket.addEventListener("close", onError, controller)
      socket.addEventListener("error", onError, controller)
      await pending.promise

      function onEvent() {
        controller.abort()
        pending.resolve()
      }
      function onError() {
        onEvent()
        throw new UnexpectedDisconnectError()
      }
    }
  }

  const controller = new AbortController()
  socket.addEventListener("error", (e) => console.error(e), controller)

  let queue: Promise<void> = Promise.resolve()
  const onMessage = (raw: MessageEvent) => {
    const event: ServerEvent = JSON.parse(raw.data)
    queue = queue.then(() => {
      if (config.debug) {
        if (event.type === "error") console.error(event)
        else console.info(event)
      }
      return handlers[event.type](event as never)
    })
  }
  socket.addEventListener("message", onMessage, controller)

  config.signal.addEventListener("abort", () => {
    const close = () => {
      controller.abort()
      socket.close()
    }
    switch (socket.readyState) {
      case WebSocket.CONNECTING:
        socket.addEventListener("open", close, { once: true })
        break
      case WebSocket.OPEN:
        close()
    }
  })

  return (event) => socket.send(JSON.stringify(event))
}

export class UnexpectedDisconnectError extends Error {
  override readonly name = "UnexpectedDisconnectError"
  override message = "Underlying websocket disconnected unexpectedly."
}
