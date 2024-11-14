import type { ErrorDetails } from "./models/mod.ts"
import type { Session } from "./Session.ts"

export class Assistant {
  constructor(private session: Session) {}

  /** Get a readable stream of assistant text. */
  text(): ReadableStream<string> {
    return this.session.state.textListeners.stream()
  }

  /** Get a readable stream of the assistant audio base64-decoded pcm-decoded chunks. */
  audio(): ReadableStream<Int16Array> {
    return this.session.state.audioListeners.stream()
  }

  /** Get a readable stream of any server error details. */
  error(): ReadableStream<ErrorDetails> {
    return this.session.state.errorListeners.stream()
  }

  respond() {
    this.session.send({ type: "response.create" })
  }
}
