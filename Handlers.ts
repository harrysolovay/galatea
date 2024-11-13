import { assert, assertEquals, assertExists } from "@std/assert"
import { decodeBase64 } from "@std/encoding"
import type { ServerEvents } from "./events/mod.ts"
import { Item } from "./models/Item.ts"
import type { ErrorDetails, ItemResource, SessionResource } from "./models/mod.ts"
import { Listeners } from "./util/Listeners.ts"

export class Context {
  sessionResource?: SessionResource
  previous_item_id?: string

  itemLookup: Record<string, ItemResource> = {}
  itemAudio = new WeakMap<ItemResource, string[]>()

  textListeners
  inputTextListeners
  audioListeners
  errorListeners
  constructor(readonly signal: AbortSignal) {
    this.textListeners = new Listeners<string>(signal)
    this.inputTextListeners = new Listeners<string>(signal)
    this.audioListeners = new Listeners<string[]>(signal)
    this.errorListeners = new Listeners<ErrorDetails>(signal)
  }
}

export const handlers: Handlers = {
  error({ error }) {
    this.errorListeners.enqueue(() => error)
  },
  "session.created"({ session }) {
    this.sessionResource = session
  },
  "session.updated"({ session }) {
    this.sessionResource = session
  },
  "conversation.created"() {},
  "conversation.item.created"({ item, previous_item_id }) {
    assertEquals(this.previous_item_id, previous_item_id ?? undefined)
    this.itemLookup[item.id] = item
    this.previous_item_id = item.id ?? undefined
  },
  "conversation.item.deleted"() {},
  "conversation.item.input_audio_transcription.completed"() {},
  "conversation.item.input_audio_transcription.failed"() {},
  "conversation.item.truncated"() {},
  "input_audio_buffer.cleared"() {},
  "input_audio_buffer.committed"() {},
  "input_audio_buffer.speech_started"() {},
  "input_audio_buffer.speech_stopped"() {},
  "rate_limits.updated"() {},
  "response.audio.delta"({ item_id, delta }) {
    const item = this.itemLookup[item_id]
    assertExists(item)
    const audio = this.itemAudio.get(item)
    if (audio) {
      audio.push(delta)
    } else {
      this.itemAudio.set(item, [delta])
    }
  },
  "response.audio.done"({ item_id }) {
    const item = this.itemLookup[item_id]
    assertExists(item)
    const audio = this.itemAudio.get(item)
    assertExists(audio)
    this.audioListeners.enqueue(() => audio)
    delete this.itemLookup[item_id]
  },
  "response.audio_transcript.delta"({ delta }) {
    this.inputTextListeners.enqueue(() => delta)
  },
  "response.audio_transcript.done"() {},
  "response.content_part.added"() {},
  "response.content_part.done"() {},
  "response.created"() {},
  "response.done"() {},
  "response.function_call_arguments.delta"() {},
  "response.function_call_arguments.done"() {},
  "response.output_item.added"({ item, output_index }) {
    console.log({ OUTPUT_ITEM: { item, output_index } })
  },
  "response.output_item.done"() {},
  "response.text.delta"() {},
  "response.text.done"() {},
}

export type Handlers = { [K in keyof ServerEvents]: Handler<K> }
export type Handler<K extends keyof ServerEvents> = (this: Context, args: ServerEvents[K]) => void | Promise<void>

function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64)
  const len = binaryString.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

function mergeInt16Arrays(left: ArrayBufferLike, right: ArrayBufferLike) {
  if (left instanceof ArrayBuffer) {
    left = new Int16Array(left)
  }
  if (right instanceof ArrayBuffer) {
    right = new Int16Array(right)
  }
  if (!(left instanceof Int16Array) || !(right instanceof Int16Array)) {
    throw new Error(`Both items must be Int16Array`)
  }
  const newValues = new Int16Array(left.length + right.length)
  for (let i = 0; i < left.length; i++) {
    newValues[i] = left[i]!
  }
  for (let j = 0; j < right.length; j++) {
    newValues[left.length + j] = right[j]!
  }
  return newValues
}
