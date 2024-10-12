import type { ClientEvent } from "./ClientEvent.ts"
import { REALTIME_ENDPOINT, REALTIME_MODEL } from "./constants.ts"
import type { ServerEvent } from "./ServerEvent.ts"

export interface Connection {
  send: (event: ClientEvent) => string
  close: () => void
}

export async function connect(apiKey: string, handler: SubscribeHandler): Promise<Connection> {
  const socket = new WebSocket(`${REALTIME_ENDPOINT}?model=${REALTIME_MODEL}`, [
    "realtime",
    `openai-insecure-api-key.${apiKey}`,
    "openai-beta.realtime-v1",
  ])

  switch (socket.readyState) {
    case WebSocket.CLOSED:
    case WebSocket.CLOSING: {
      throw 0
    }
    case WebSocket.CONNECTING: {
      const pending = Promise.withResolvers<void>()
      const controller = new AbortController()
      socket.addEventListener("open", () => {
        controller.abort()
        pending.resolve()
      }, controller)
      socket.addEventListener("close", onError, controller)
      socket.addEventListener("error", onError, controller)
      await pending.promise

      function onError() {
        controller.abort()
        pending.reject() // TODO
      }
    }
  }

  const controller = new AbortController()
  socket.addEventListener("error", (e) => console.error(e), controller)
  socket.addEventListener("message", (e) => handler(JSON.parse(e.data)), controller)

  let nextEventId = 0

  const close = {
    [WebSocket.CONNECTING]: () => {
      socket.addEventListener("open", () => socket.close(), { once: true })
    },
    [WebSocket.OPEN]: () => {
      socket.close()
    },
  }[socket.readyState] || (() => {})

  return {
    send: (event) => {
      let { event_id } = event
      if (!event_id) event_id = `event_${++nextEventId}`
      socket.send(JSON.stringify(event))
      return event_id
    },
    close,
  }
}

export type SubscribeHandler = (event: ServerEvent) => void
export type Send = (event: ClientEvent) => string
