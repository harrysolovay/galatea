import type { ClientEvent } from "./ClientEvent.ts"
import { REALTIME_ENDPOINT, REALTIME_MODEL } from "./constants.ts"
import type { ServerEvent } from "./ServerEvent.ts"

export class Connection {
  constructor(readonly socket: WebSocket) {}

  send(event: ClientEvent) {
    this.socket.send(JSON.stringify(event))
  }

  subscribe(handler: SubscribeHandler, options: SubscriptionOptions) {
    this.socket.addEventListener("message", (e) => handler(JSON.parse(e.data)), { signal: options.signal })
  }
}

export async function connect(apiKey: string, options: ConnectOptions) {
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

  options.signal.addEventListener(
    "abort",
    {
      [WebSocket.CONNECTING]: () => socket.addEventListener("open", () => socket.close(), { once: true }),
      [WebSocket.OPEN]: () => socket.close(),
    }[socket.readyState] || (() => {}),
  )

  socket.addEventListener("error", (e) => {
    console.error(e)
    throw 0
  }, { signal: options.signal })

  return new Connection(socket)
}

export type SubscribeHandler = (event: ServerEvent) => void

export interface SubscriptionOptions {
  signal: AbortSignal
}

export interface ConnectOptions {
  signal: AbortSignal
}
