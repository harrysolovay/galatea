import type { EventGroup } from "./common.ts"

export type ResponseAudio = EventGroup<"response.audio", {}, {
  // https://platform.openai.com/docs/api-reference/realtime-server-events/response-audio-delta
  /** Returned when the model-generated audio is updated. */
  delta: {
    /** The ID of the response. */
    response_id: string
    /** The ID of the item. */
    item_id: string
    /** The index of the output item in the response. */
    output_index: number
    /** The index of the content part in the item's content array. */
    content_index: number
    /** Base64-encoded audio data delta. */
    delta: string
  }
  // https://platform.openai.com/docs/api-reference/realtime-server-events/response-audio-done
  /** Returned when the model-generated audio is done. Also emitted when a Response is interrupted, incomplete, or cancelled. */
  done: {
    /** The ID of the response. */
    response_id: string
    /** The ID of the item. */
    item_id: string
    /** The index of the output item in the response. */
    output_index: number
    /** The index of the content part in the item's content array. */
    content_index: number
  }
}, {}>
