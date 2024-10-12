import type { ClientEvent } from "./ClientEvent.ts"
import { connect } from "./connect.ts"
import type { MatchEventArms } from "./event_common.ts"
import type { ServerEvent } from "./ServerEvent.ts"

export interface SessionOptions {
  apiKey: string
  signal: AbortSignal
  debug?: boolean
}

export type Send = (event: ClientEvent) => string

export async function session(options: SessionOptions, handlers: SessionHandlers): Promise<Send> {
  let nextEventId = 0
  const connection = await connect(options.apiKey, tick)
  options.signal.addEventListener("abort", () => connection.close())

  return (event: ClientEvent) => {
    let { event_id } = event
    if (!event_id) event_id = `event_${++nextEventId}`
    connection.send(event)
    return event_id
  }

  function tick(event: ServerEvent) {
    if (options.debug) {
      if (event.type === "error") console.error(event)
      else console.info(event)
    }
    handlers[event.type](event as never)
  }
}

// TODO: separate and have `SessionHandler`?
export type SessionHandlers = MatchEventArms<ServerEvent, void>
