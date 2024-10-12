import type { ClientEvent } from "./ClientEvent.ts"
import { connect } from "./connect.ts"
import type { ServerEvent } from "./ServerEvent.ts"

export interface ListenOptions {
  /** The OpenAI access token. */
  apiKey: string
  /** The abort signal to be used for terminating the session. */
  signal: AbortSignal
  /** Whether or not to log all incoming events. */
  debug?: boolean
}

export async function listen(options: ListenOptions, handlers: ListenHandlers): Promise<Send> {
  let nextEventId = 0
  let queue: Promise<void> = Promise.resolve()
  const connection = await connect(options.apiKey, tick)
  options.signal.addEventListener("abort", () => connection.close())

  return (event: ClientEvent) => {
    const { event_id, ...rest } = event
    if (typeof event_id !== "string") {
      event = { event_id: `event_${++nextEventId}`, ...rest }
    }
    connection.send(event)
    return event.event_id!
  }

  function tick(event: ServerEvent) {
    queue = queue.then(() => {
      if (options.debug) {
        if (event.type === "error") console.error(event)
        else console.info(event)
      }
      return handlers[event.type](event as never)
    })
  }
}

export type ListenHandlers = {
  [K in ServerEvent["type"]]: (args: Extract<ServerEvent, { type: K }>) => void | Promise<void>
}

export type Send = (event: ClientEvent) => string
