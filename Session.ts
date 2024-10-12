import { assert } from "@std/assert"
import type { ClientEvent } from "./ClientEvent.ts"
import { connect, type Connection } from "./connect.ts"
import type { MatchEventArms } from "./event_common.ts"
import type { ServerEvent } from "./ServerEvent.ts"

export interface SessionOptions<S> {
  apiKey: string
  initialState: S
  debug?: boolean
}

export class Session<S> {
  private nextEventId = 0
  declare private sessionController?: AbortController
  declare private connection?: Connection
  private state
  constructor(readonly options: SessionOptions<S>, readonly handlers: SessionHandlers<S>) {
    this.state = { ...options.initialState }
  }

  send(event: ClientEvent) {
    if (!event.event_id) {
      event = { event_id: `event_${++this.nextEventId}`, ...event }
    }
    assert(this.connection, "TODO")
    this.connection.send(event)
  }

  async start() {
    this.sessionController = new AbortController()
    this.connection = await connect(this.options.apiKey, { signal: this.sessionController.signal })
    this.connection.subscribe(this.tick, { signal: this.sessionController.signal })
  }

  stop() {
    this.sessionController!.abort()
    delete this["sessionController"]
  }

  // TODO
  gc() {}

  tick = (event: ServerEvent) => {
    if (this.options.debug) {
      if (event.type === "error") {
        console.error(event)
      } else {
        console.info(event)
      }
    }
    const result = (this.handlers[event.type] as any).call(this.state as never, event)
    if (result) this.state = result
  }
}

// TODO: separate and have `SessionHandler`?
export type SessionHandlers<S> = MatchEventArms<ServerEvent, S, S | void>
