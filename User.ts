import { assert } from "@std/assert"
import { base64EncodeAudio } from "./audio/encodePcm.ts"
import type { Content } from "./models/mod.ts"
import type { Session } from "./Session.ts"

export class User {
  constructor(private session: Session) {}

  /** Get a writable stream to which text and audio chunks can be written. */
  writeable(commitInterval = 10): WritableStream<string | Float32Array> {
    assert(commitInterval >= 1)
    let i = 0
    return new WritableStream({
      write: (value) => {
        this.write(value)
        i += 1
        if (i % commitInterval === 0) {
          this.commit()
        }
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

  commit() {
    this.session.send({ type: "input_audio_buffer.commit" })
  }

  /** Get a readable stream of the user audio transcript. */
  audioTranscript(): ReadableStream<string> {
    return this.session.state.userAudioTranscriptListeners.stream()
  }

  /** Get a readable stream of the user audio base64-decoded pcm-decoded chunks. */
  audio(): ReadableStream<Int16Array> {
    return this.session.state.assistantAudioListeners.stream()
  }

  /** Add an item to the conversation. */
  private createItem(item: Content): void {
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
