import { base64EncodeAudio } from "./audio_util/encodePcm.ts"
import type { Content } from "./models/mod.ts"
import type { Session } from "./Session.ts"

export class User {
  constructor(private session: Session) {}

  /** Get a writable stream to which text and audio chunks can be written. */
  writeable(): WritableStream<string | Float32Array> {
    return new WritableStream<string | Float32Array>({
      write: (value) => {
        this.write(value)
      },
    })
  }

  /** Write text or audio. */
  write(value: string | Float32Array): void {
    if (typeof value === "string") {
      this.createItem({
        type: "input_text",
        text: value,
      })
    } else {
      this.session.send({
        type: "input_audio_buffer.append",
        audio: base64EncodeAudio(value),
      })
    }
  }

  /** Get a readable stream of the user audio transcript. */
  audioTranscript(): ReadableStream<string> {
    return this.session.state.inputTextListeners.stream()
  }

  /** Get a readable stream of the user audio base64-decoded pcm-decoded chunks. */
  audio(): ReadableStream<Int16Array> {
    return this.session.state.audioListeners.stream()
  }

  createItem(item: Content) {
    const { previous_item_id } = this.session.state
    this.session.send({
      type: "conversation.item.create",
      previous_item_id,
      item: {
        type: "message",
        status: "incomplete",
        role: "user",
        content: [item],
      },
    })
  }
}
