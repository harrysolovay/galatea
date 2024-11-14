import { Assistant } from "./Assistant.ts"
import type { ClientEvent, ServerEvent } from "./events/mod.ts"
import { handlers, SessionState } from "./handlers.ts"
import { listen } from "./listen.ts"
import type { ErrorDetails } from "./models/mod.ts"
import { formatSessionConfigUpdate, type SessionConfig, type SessionUpdateConfig } from "./SessionConfig.ts"
import { User } from "./User.ts"

export class Session {
  state: SessionState = new SessionState()
  user: User = new User(this)
  assistant: Assistant = new Assistant(this)

  send: (event: ClientEvent) => void
  constructor(readonly connect: () => WebSocket, config?: SessionConfig) {
    this.send = listen<ClientEvent, ServerEvent>(
      connect,
      (event) => {
        return handlers[event.type].call(this.state, event as never)
      },
      this.state.ctl.signal,
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

  /** Get a readable stream of any server error details. */
  error(): ReadableStream<ErrorDetails> {
    return this.state.serverErrorListeners.stream()
  }

  /** End the conversation and clean up resources. */
  end(): void {
    this.state.ctl.abort()
  }

  /** Get the latest turn detection state resolved from the server. */
  turnDetection(): boolean {
    if (!this.state.sessionResource) {
      return true
    }
    return !!this.state.sessionResource.turn_detection
  }

  setCommitInterval(ms: number): number {
    return setInterval(() => {
      this.send({
        type: "input_audio_buffer.commit",
      })
    }, ms)
  }
}
