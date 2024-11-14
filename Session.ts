import { Assistant } from "./Assistant.ts"
import type { ClientEvent, ServerEvent } from "./events/mod.ts"
import { handlers, SessionState } from "./handlers.ts"
import { listen } from "./listen.ts"
import { formatSessionConfigUpdate, type SessionConfig, type SessionUpdateConfig } from "./SessionConfig.ts"
import { User } from "./User.ts"

export class Session {
  #ctl = new AbortController()

  state = new SessionState(this.#ctl.signal)
  user = new User(this)
  assistant = new Assistant(this)

  send
  constructor(readonly connect: () => WebSocket, config?: SessionConfig) {
    this.send = listen<ClientEvent, ServerEvent>(
      connect,
      (event) => {
        return handlers[event.type].call(this.state, event as never)
      },
      this.#ctl.signal,
    )
    if (config) {
      this.update(config)
    }
  }

  /** Trigger a response generation. */
  respond(): void {
    this.send({ type: "response.create" })
  }

  /** Update the session configuration. */
  update(sessionConfigUpdate: SessionUpdateConfig): void {
    this.send({
      type: "session.update",
      session: formatSessionConfigUpdate(sessionConfigUpdate),
    })
  }

  /** End the conversation and clean up resources. */
  end(): void {
    this.#ctl.abort()
  }

  /** Get the latest turn detection state resolved from the server. */
  turnDetection(): boolean {
    if (!this.state.sessionResource) {
      return true
    }
    return !!this.state.sessionResource.turn_detection
  }
}
