import type { ClientEvent } from "./ClientEvent.ts"
import { connect } from "./connect.ts"
import type { MatchEventArms } from "./event_common.ts"
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
    let { event_id } = event
    if (!event_id) event_id = `event_${++nextEventId}`
    connection.send(event)
    return event_id
  }

  function tick(event: ServerEvent) {
    queue = queue.then(() => {
      if (options.debug) {
        if (event.type === "error") console.error(event)
        else console.info(event)
      }
      handlers[event.type](event as never)
    })
  }
}

// TODO: separate and have `SessionHandler`?
export type ListenHandlers = MatchEventArms<ServerEvent, void>

export type Send = (event: ClientEvent) => string
