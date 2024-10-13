import type { ClientEvent } from "./ClientEvent.ts"
import type { Config } from "./config.ts"
import { REALTIME_ENDPOINT, REALTIME_MODEL } from "./constants.ts"
import type { ServerEvent } from "./ServerEvent.ts"

export type ListenHandlers = {
  [K in ServerEvent["type"]]: (args: Extract<ServerEvent, { type: K }>) => void | Promise<void>
}

export async function connect(config: Config, handlers: ListenHandlers): Promise<Sender> {
  const socket = new WebSocket(`${REALTIME_ENDPOINT}?model=${REALTIME_MODEL}`, [
    "realtime",
    `openai-insecure-api-key.${config.apiKey}`,
    "openai-beta.realtime-v1",
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

  let nextEventId = 0
  return (event: ClientEvent) => {
    const { event_id, ...rest } = event
    if (typeof event_id !== "string") {
      event = { event_id: `event_${++nextEventId}`, ...rest }
    }
    socket.send(JSON.stringify(event))
    return event.event_id!
  }
}

export type SubscribeHandler = (event: ServerEvent) => void
export type Sender = (event: ClientEvent) => string

export class UnexpectedDisconnectError extends Error {
  override readonly name = "UnexpectedDisconnectError"
  override message = "Underlying websocket disconnected unexpectedly."
}
