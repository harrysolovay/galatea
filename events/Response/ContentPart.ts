import type { ContentResource } from "../../models/mod.ts"

export type Added = Done

export type Done = {
  /** The ID of the response. */
  response_id: string
  /** The index of the output item in the response. */
  output_index: number
  /** The ID of the item. */
  item_id: string
  /** The index of the content part in the item's content array. */
  content_index: number
  /** The content part that is done. */
  part: ContentResource
}
