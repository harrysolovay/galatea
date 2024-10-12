import type { ClientEvent } from "./ClientEvent.ts"
import { REALTIME_ENDPOINT, REALTIME_MODEL } from "./constants.ts"
import type { ServerEvent } from "./ServerEvent.ts"
import { GalateaError } from "./util.ts"

export interface ConnectionOptions {
  /** The OpenAI access token. */
  apiKey: string
  /** The abort signal to be used for terminating the session. */
  signal: AbortSignal
  /** Whether or not to log all incoming events. */
  debug?: boolean
}

export type ListenHandlers = {
  [K in ServerEvent["type"]]: (args: Extract<ServerEvent, { type: K }>) => void | Promise<void>
}

export async function connect(options: ConnectionOptions, handlers: ListenHandlers): Promise<Send> {
  const socket = new WebSocket(`${REALTIME_ENDPOINT}?model=${REALTIME_MODEL}`, [
    "realtime",
    `openai-insecure-api-key.${options.apiKey}`,
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
  socket.addEventListener("message", onMessage, controller)

  options.signal.addEventListener("abort", () => {
    const close = () => {
      controller.abort()
      socket.close()
    }
    ;({
      [WebSocket.CONNECTING]: () => socket.addEventListener("open", close, { once: true }),
      [WebSocket.OPEN]: close,
    }[socket.readyState]) || (() => {})()
  })

  let nextEventId = 0
  return send

  function onMessage(raw: MessageEvent) {
    const event: ServerEvent = JSON.parse(raw.data)
    queue = queue.then(() => {
      if (options.debug) {
        if (event.type === "error") console.error(event)
        else console.info(event)
      }
      return handlers[event.type](event as never)
    })
  }

  function send(event: ClientEvent) {
    const { event_id, ...rest } = event
    if (typeof event_id !== "string") {
      event = { event_id: `event_${++nextEventId}`, ...rest }
    }
    socket.send(JSON.stringify(event))
    return event.event_id!
  }
}

export type SubscribeHandler = (event: ServerEvent) => void
export type Send = (event: ClientEvent) => string

export class UnexpectedDisconnectError
  extends GalateaError("UnexpectedDisconnectError", "Underlying disconnected unexpectedly")
{}
