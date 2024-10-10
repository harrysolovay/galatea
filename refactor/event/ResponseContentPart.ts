import type { ContentPart } from "../models.ts"
import type { EventGroup } from "./common.ts"

export type ResponseContentPart = EventGroup<"response.content_part", {}, {
  // https://platform.openai.com/docs/api-reference/realtime-server-events/response-content-part-added
  /** Returned when a new content part is added to an assistant message item during response generation. */
  added: {
    /** The ID of the response. */
    response_id: string
    /** The ID of the item to which the content part was added. */
    item_id: string
    /** The index of the output item in the response. */
    output_index: number
    /** The index of the content part in the item's content array. */
    content_index: number
    /** The content part that was added. */
    part: ContentPart
  }
  // https://platform.openai.com/docs/api-reference/realtime-server-events/response-content-part-done
  /** Returned when a content part is done streaming in an assistant message item. Also emitted when a Response is interrupted, incomplete, or cancelled. */
  done: {
    /** The ID of the response. */
    response_id: string
    /** The ID of the item. */
    item_id: string
    /** The index of the output item in the response. */
    output_index: number
    /** The index of the content part in the item's content array. */
    content_index: number
    /** The content part that is done. */
    part: ContentPart
  }
}, {}>
