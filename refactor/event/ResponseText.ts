import type { EventGroup } from "./common.ts"

export type ResponseText = EventGroup<"response.text", {}, {
  // https://platform.openai.com/docs/api-reference/realtime-server-events/response-text-delta
  /** Returned when the text value of a "text" content part is updated. */
  delta: {
    /** The ID of the response. */
    response_id: string
    /** The ID of the item. */
    item_id: string
    /** The index of the output item in the response. */
    output_index: number
    /** The index of the content part in the item's content array. */
    content_index: number
    /** The text delta. */
    delta: string
  }
  // https://platform.openai.com/docs/api-reference/realtime-server-events/response-text-done
  /** Returned when the text value of a "text" content part is done streaming. Also emitted when a Response is interrupted, incomplete, or cancelled. */
  done: {
    /** The ID of the response. */
    response_id: string
    /** The ID of the item. */
    item_id: string
    /** The index of the output item in the response. */
    output_index: number
    /** The index of the content part in the item's content array. */
    content_index: number
    /** The final text content. */
    text: string
  }
}, {}>
