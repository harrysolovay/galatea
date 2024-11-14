import type { Session } from "./Session.ts"

export class Assistant {
  constructor(private session: Session) {}

  /** Get a readable stream of assistant text. */
  text(): ReadableStream<string> {
    return this.session.state.assistantTextListeners.stream()
  }

  /** Get a readable stream of the assistant audio base64-decoded pcm-decoded chunks. */
  audio(): ReadableStream<Int16Array> {
    return this.session.state.assistantAudioListeners.stream()
  }

  respond() {
    this.session.send({ type: "response.create" })
  }
}
