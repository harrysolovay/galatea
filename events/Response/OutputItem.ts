import type { ItemResource } from "../common/mod.ts"

export type Added = {
  /** The ID of the response to which the item belongs. */
  response_id: string
  /** The index of the output item in the response. */
  output_index: number
  /** The item that was added. */
  item: ItemResource
}

export type Done = {
  /** The ID of the response to which the item belongs. */
  response_id: string
  /** The index of the output item in the response. */
  output_index: number
  /** The completed item. */
  item: ItemResource
}
