import type { Item } from "../models.ts"
import type { EventGroup } from "./common.ts"

export type ResponseOutputItem = EventGroup<"response.output_item", {}, {
  // https://platform.openai.com/docs/api-reference/realtime-server-events/response-output-item-added
  /** Returned when a new Item is created during response generation. */
  added: {
    /** The ID of the response to which the item belongs. */
    response_id: string
    /** The index of the output item in the response. */
    output_index: number
    /** The item that was added. */
    item: Item
  }
  // https://platform.openai.com/docs/api-reference/realtime-server-events/response-output-item-done
  /** Returned when an Item is done streaming. Also emitted when a Response is interrupted, incomplete, or cancelled. */
  done: {
    /** The ID of the response to which the item belongs. */
    response_id: string
    /** The index of the output item in the response. */
    output_index: number
    /** The completed item. */
    item: Item
  }
}, {}>
